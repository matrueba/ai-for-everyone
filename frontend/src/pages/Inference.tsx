import React, { useState, useEffect, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useChartTheme } from '../components/charts/chartTheme';
import Scene3D from '../components/three/Scene3D';
import Axes3D from '../components/three/Axes3D';
import { Contours, Surface } from '../components/three/Surface';
import { Points } from '../components/three/Points';
import { KeyLegend, RampLegend } from '../components/three/Legend';
import { extent, probabilityRamp, worldScales } from '../components/three/scale';
import { Page, PageHeader } from '../components/ui/Page';
import { Card, CardHeader } from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import { Callout, Formula, Slider, Stat, Status } from '../components/ui/Bits';
import NextStep from '../components/ui/NextStep';
import { useI18n, useT } from '../i18n';
import type { InferenceScenarioId } from '../i18n/content-types';
import styles from './Inference.module.css';

interface ModelData {
    w1: number;
    w2: number;
    b: number;
    dataX1: number[];
    dataX2: number[];
    dataY: number[];
}

/** Numeric setup of a scenario — language independent, so it stays in the component. */
interface ScenarioRanges {
    x1Range: [number, number];
    x2Range: [number, number];
    defaultX1: number;
    defaultX2: number;
    step1: number;
    step2: number;
    isClassification?: boolean;
}

/** Ranges + the active locale's copy + locale-aware formatters. */
interface TabConfig extends ScenarioRanges {
    id: InferenceScenarioId;
    tab: string;
    title: string;
    description: string;
    x1Label: string;
    x2Label: string;
    yLabel: string;
    format1: (v: number) => string;
    format2: (v: number) => string;
    formatY: (v: number) => string;
}

const SCENARIO_IDS: InferenceScenarioId[] = ['generic', 'houses', 'admission'];

const SCENARIO_RANGES: Record<InferenceScenarioId, ScenarioRanges> = {
    generic: {
        x1Range: [-6, 6],
        x2Range: [-6, 6],
        defaultX1: 2.0,
        defaultX2: -1.0,
        step1: 0.1,
        step2: 0.1,
        isClassification: false,
    },
    houses: {
        x1Range: [40, 300],
        x2Range: [0, 10],
        defaultX1: 100,
        defaultX2: 7,
        step1: 1,
        step2: 0.1,
        isClassification: false,
    },
    admission: {
        x1Range: [0, 100],
        x2Range: [0, 20],
        defaultX1: 70,
        defaultX2: 10,
        step1: 1,
        step2: 0.5,
        isClassification: true,
    },
};

interface InferencePlot3DProps {
    model: ModelData | null;
    inputX1: number;
    inputX2: number;
    predY: number;
    config: TabConfig;
}

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const BOUNDARY = [0.5];

const InferencePlot3D: React.FC<InferencePlot3DProps> = ({ model, inputX1, inputX2, predY, config }) => {
    const t = useT('inference').plot;
    const { palette } = useChartTheme();
    const w1 = model?.w1 ?? 0;
    const w2 = model?.w2 ?? 0;
    const b = model?.b ?? 0;
    const dataY = model?.dataY;

    const ramp = useMemo(() => probabilityRamp(palette), [palette]);

    // The box depends only on the scenario and the trained model, so it stays put while the sliders move.
    const scales = useMemo(() => {
        if (config.isClassification) return worldScales(config.x1Range, config.x2Range, [0, 1]);
        const corners = [config.x1Range[0], config.x1Range[1]].flatMap(a =>
            [config.x2Range[0], config.x2Range[1]].map(c => w1 * a + w2 * c + b)
        );
        return worldScales(config.x1Range, config.x2Range, extent([...(dataY ?? []), ...corners], 0.05));
    }, [config, w1, w2, b, dataY]);

    const planeData = useMemo(() => {
        const steps = config.isClassification ? 36 : 12;
        const x1Range: number[] = [];
        const x2Range: number[] = [];
        for (let i = 0; i <= steps; i++) {
            x1Range.push(config.x1Range[0] + (config.x1Range[1] - config.x1Range[0]) * i / steps);
            x2Range.push(config.x2Range[0] + (config.x2Range[1] - config.x2Range[0]) * i / steps);
        }
        const zPlane = x2Range.map(x2Val =>
            x1Range.map(x1Val => {
                const z = w1 * x1Val + w2 * x2Val + b;
                return config.isClassification ? sigmoid(z) : z;
            })
        );
        return { xs: x1Range, ys: x2Range, z: zPlane };
    }, [w1, w2, b, config]);

    if (!model) return null;

    const { dataX1, dataX2 } = model;
    const px = scales.x(inputX1);
    const pz = scales.y(inputX2);
    const zLo = scales.z.domain[0];
    const zHi = scales.z.domain[1];
    const py = scales.z(Math.min(zHi, Math.max(zLo, predY)));

    return (
        <Card padding="md" fill className={styles.plotCard}>
            <CardHeader title={config.title} subtitle={config.description} icon="target" />
            <div className={styles.plot}>
                <Scene3D
                    label={config.title}
                    legend={
                        <>
                            {config.isClassification && <RampLegend ramp={ramp} low="P = 0" high="P = 1" />}
                            <KeyLegend
                                items={[
                                    { label: t.dataName, color: config.isClassification ? palette.indigo : palette.data },
                                    { label: t.modelName, color: config.isClassification ? palette.textStrong : palette.indigo, shape: 'line' },
                                    { label: t.inputTooltip, color: palette.purple },
                                    { label: t.predictionTooltip, color: palette.green },
                                ]}
                            />
                        </>
                    }
                >
                    <Axes3D
                        scales={scales}
                        x={{ label: config.x1Label, format: config.format1 }}
                        y={{ label: config.x2Label, format: config.format2 }}
                        z={{ label: config.yLabel, format: config.formatY }}
                    />
                    <Points
                        x={dataX1}
                        y={dataX2}
                        z={model.dataY}
                        scales={scales}
                        color={config.isClassification
                            ? (i => ((model.dataY[i] ?? 0) === 1 ? palette.indigo : palette.red))
                            : palette.data}
                        opacity={0.75}
                        size={0.022}
                    />
                    {config.isClassification ? (
                        <>
                            <Surface xs={planeData.xs} ys={planeData.ys} z={planeData.z} scales={scales} colorRamp={ramp} opacity={0.7} />
                            <Contours
                                xs={planeData.xs}
                                ys={planeData.ys}
                                z={planeData.z}
                                scales={scales}
                                levels={BOUNDARY}
                                colorFor={() => palette.textStrong}
                                lineWidth={2.2}
                            />
                        </>
                    ) : (
                        <Surface
                            xs={planeData.xs}
                            ys={planeData.ys}
                            z={planeData.z}
                            scales={scales}
                            color={palette.indigo}
                            opacity={0.3}
                            wireEvery={2}
                            wireColor={palette.indigo}
                            clip
                        />
                    )}

                    {/* From the input on the floor up to the model's answer */}
                    <Line points={[[px, 0.004, pz], [px, py, pz]]} color={palette.orange} lineWidth={2.5} dashed dashSize={0.04} gapSize={0.025} />
                    <mesh position={[px, 0.02, pz]}>
                        <sphereGeometry args={[0.04, 24, 24]} />
                        <meshStandardMaterial color={palette.purple} />
                    </mesh>
                    <mesh position={[px, py, pz]}>
                        <sphereGeometry args={[0.05, 32, 32]} />
                        <meshStandardMaterial color={palette.green} emissive={palette.green} emissiveIntensity={0.2} />
                    </mesh>
                </Scene3D>
            </div>
            <p className={styles.plotCaption}>
                {t.inputTooltip} ({config.x1Label} = {config.format1(inputX1)}, {config.x2Label} = {config.format2(inputX2)}) → {t.predictionTooltip} {config.yLabel} = {config.formatY(predY)}
            </p>
        </Card>
    );
};

const Inference: React.FC = () => {
    const t = useT('inference');
    const { formatNumber } = useI18n();
    const [activeTab, setActiveTab] = useState<InferenceScenarioId>('generic');
    const [model, setModel] = useState<ModelData | null>(null);
    const [inputX1, setInputX1] = useState<number>(SCENARIO_RANGES.generic.defaultX1);
    const [inputX2, setInputX2] = useState<number>(SCENARIO_RANGES.generic.defaultX2);
    const [predY, setPredY] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    /** Copy + ranges + formatters, rebuilt whenever the language changes. */
    const tabConfigs = useMemo<Record<InferenceScenarioId, TabConfig>>(() => {
        const fixed = (digits: number) => (v: number) =>
            formatNumber(v, { minimumFractionDigits: digits, maximumFractionDigits: digits });

        return {
            generic: {
                id: 'generic',
                ...t.scenarios.generic,
                ...SCENARIO_RANGES.generic,
                format1: fixed(2),
                format2: fixed(2),
                formatY: fixed(4),
            },
            houses: {
                id: 'houses',
                ...t.scenarios.houses,
                ...SCENARIO_RANGES.houses,
                format1: (v) => `${fixed(0)(v)} m²`,
                format2: (v) => `${fixed(1)(v)}/10`,
                formatY: (v) => formatNumber(v, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
            },
            admission: {
                id: 'admission',
                ...t.scenarios.admission,
                ...SCENARIO_RANGES.admission,
                format1: (v) => `${fixed(0)(v)}/100`,
                format2: (v) => `${fixed(1)(v)}h`,
                formatY: (v) => `${fixed(1)(v * 100)}%`,
            },
        };
    }, [t, formatNumber]);

    const currentConfig = tabConfigs[activeTab];

    useEffect(() => {
        setLoading(true);

        fetch(`http://localhost:8000/api/inference-scenario?scenario=${activeTab}`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch scenario data");
                return res.json();
            })
            .then(data => {
                setModel({
                    w1: data.weights?.[0] ?? 0,
                    w2: data.weights?.[1] ?? 0,
                    b: data.bias ?? 0,
                    dataX1: (data.X ?? []).map((r: number[]) => r[0] ?? 0),
                    dataX2: (data.X ?? []).map((r: number[]) => r[1] ?? 0),
                    dataY: data.y ?? []
                });
                const ranges = SCENARIO_RANGES[activeTab];
                setInputX1(ranges.defaultX1);
                setInputX2(ranges.defaultX2);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load scenario:", err);
                setLoading(false);
            });
    }, [activeTab]);

    useEffect(() => {
        if (!model) return;

        const timer = setTimeout(() => {
            fetch('http://localhost:8000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    x: [inputX1, inputX2],
                    weights: [model.w1, model.w2],
                    bias: model.b
                })
            })
                .then(res => res.json())
                .then(data => {
                    const val = currentConfig.isClassification
                        ? 1 / (1 + Math.exp(-data.prediction))
                        : data.prediction;
                    setPredY(val);
                })
                .catch(err => console.error("Prediction error:", err));
        }, 50);

        return () => clearTimeout(timer);
    }, [inputX1, inputX2, model, currentConfig]);

    return (
        <Page width="wide">
            <PageHeader
                page="inference"
                title={t.title}
                subtitle={t.subtitle}
                actions={
                    <Tabs<InferenceScenarioId>
                        label={t.title}
                        value={activeTab}
                        onChange={setActiveTab}
                        items={SCENARIO_IDS.map(id => ({ id, label: t.scenarios[id].tab }))}
                    />
                }
            />

            <div className={styles.intro}>
                <Callout icon="info">
                    <p>{t.intro}</p>
                </Callout>
            </div>

            <div className={styles.layout}>
                <div className={styles.side}>
                    <Card padding="md">
                        <CardHeader title={t.params.heading} icon="sliders" tone="purple" />
                        <div className={styles.sliders}>
                            <Slider
                                label={currentConfig.x1Label}
                                valueLabel={currentConfig.format1(inputX1)}
                                min={currentConfig.x1Range[0]}
                                max={currentConfig.x1Range[1]}
                                step={currentConfig.step1}
                                value={inputX1}
                                onChange={setInputX1}
                                tone="purple"
                            />
                            <Slider
                                label={currentConfig.x2Label}
                                valueLabel={currentConfig.format2(inputX2)}
                                min={currentConfig.x2Range[0]}
                                max={currentConfig.x2Range[1]}
                                step={currentConfig.step2}
                                value={inputX2}
                                onChange={setInputX2}
                                tone="cyan"
                            />
                        </div>
                    </Card>

                    <Card padding="md">
                        <CardHeader title={t.brain.heading} icon="cpu" />
                        <div className={styles.model}>
                            <p className={styles.modelLabel}>{t.brain.equation}</p>
                            <Formula size="md">
                                {currentConfig.isClassification ? 'Y = σ(W₁·X₁ + W₂·X₂ + b)' : 'Y = W₁·X₁ + W₂·X₂ + b'}
                            </Formula>
                            <div className={styles.params}>
                                <Stat label="W₁" value={model?.w1.toFixed(3)} />
                                <Stat label="W₂" value={model?.w2.toFixed(3)} />
                                <Stat label="b" value={model?.b.toFixed(1)} />
                            </div>
                            <Stat
                                size="lg"
                                tone="green"
                                label={t.brain.result}
                                value={loading ? '…' : currentConfig.formatY(predY)}
                            />
                        </div>
                    </Card>
                </div>

                <div className={styles.main}>
                    {loading ? (
                        <Card padding="md" fill>
                            <Status kind="loading" fill title={t.loading(currentConfig.title)}>
                                {t.loadingHint}
                            </Status>
                        </Card>
                    ) : model ? (
                        <InferencePlot3D model={model} inputX1={inputX1} inputX2={inputX2} predY={predY} config={currentConfig} />
                    ) : (
                        <Card padding="md" fill>
                            <Status
                                kind="error"
                                fill
                                title={t.error}
                                action={
                                    <Button variant="secondary" icon="reset" onClick={() => window.location.reload()}>
                                        {t.retry}
                                    </Button>
                                }
                            />
                        </Card>
                    )}
                </div>
            </div>

            <div className={styles.next}>
                <NextStep from="inference" />
            </div>
        </Page>
    );
};

export default Inference;
