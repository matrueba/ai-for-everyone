import React, { useState, useEffect } from 'react';
import RegressionPlot from './RegressionPlot';
import CostSurface from './CostSurface';
import Backprop3D from './Backprop3D';
import RegressionPlot3D from './RegressionPlot3D';
import TrainingControls from './TrainingControls';
import { Card } from '../ui/Card';
import Tabs from '../ui/Tabs';
import { Callout, Formula, Status } from '../ui/Bits';
import { useT } from '../../i18n';
import styles from './Playground.module.css';

import type { Step, SurfaceData } from './types';

interface FormattedData {
    steps: Step[];
    cost_surface: SurfaceData;
    data: {
        x?: number[];
        y: number[];
        x1?: number[];
        x2?: number[];
    };
}

const gradient_descent_data = (vizMode: '2d' | '3d') => {
    let X: number[][], y: number[];
    if (vizMode === '2d') {
        const rawX = Array.from({ length: 20 }, (_, i) => -5 + (i * 10 / 19));
        X = rawX.map(x => [x]);
        y = rawX.map(x => 2 * x + 1 + (Math.random() - 0.5) * 2);
    } else {
        // Realistic house pricing dataset
        const n = 100;
        // Raw features: m² (40-250), location rating (1-10)
        const rawM2 = Array.from({ length: n }, () => 40 + Math.random() * 210);
        const rawNota = Array.from({ length: n }, () => 1 + Math.random() * 9);
        // Realistic price: ~1500€/m² + 20000€ per location point + 50k base + noise
        const rawPrecio = rawM2.map((m2, i) =>
            1500 * m2 + 20000 * (rawNota[i] ?? 0) + 50000 + (Math.random() - 0.5) * 30000
        );

        // Min-max normalization to [0, 1]
        const normalize = (arr: number[]) => {
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            return arr.map(v => (v - min) / (max - min));
        };

        const normM2 = normalize(rawM2);
        const normNota = normalize(rawNota);
        const normPrecio = normalize(rawPrecio);

        X = normM2.map((m2, i) => [m2, normNota[i] ?? 0]);
        y = normPrecio;
    }
    return { X, y };
}

const LinearRegressionContent: React.FC = () => {
    const gradient = useT('gradient');
    const t = gradient.linear;
    const [data, setData] = useState<FormattedData | null>(null);
    const [data3d, setData3d] = useState<FormattedData | null>(null);
    const [vizMode, setVizMode] = useState<'2d' | '3d'>('2d');
    const [learningRate, setLearningRate] = useState<number>(0.01);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const { X, y } = gradient_descent_data(vizMode);

        fetch('http://localhost:8000/api/gradient-descent-matrix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                X,
                y,
                learning_rate: learningRate,
                iterations: 100
            })
        })
            .then(res => res.json())
            .then((resData: any) => {
                const formattedData: FormattedData = {
                    ...resData,
                    data: vizMode === '2d'
                        ? { x: X.map(r => r[0] ?? 0), y: y }
                        : { x1: X.map(r => r[0] ?? 0), x2: X.map(r => r[1] ?? 0), y: y },
                    steps: resData.steps.map((step: any) => ({
                        ...step,
                        w: vizMode === '2d' ? (step.weights[0] ?? 0) : undefined,
                        w1: vizMode === '3d' ? (step.weights[0] ?? 0) : undefined,
                        w2: vizMode === '3d' ? (step.weights[1] ?? 0) : undefined,
                        b: step.bias,
                        predictions: vizMode === '2d'
                            ? X.map(r => (r[0] ?? 0) * step.weights[0] + step.bias)
                            : undefined
                    }))
                };

                if (vizMode === '2d') {
                    setData(formattedData);
                } else {
                    setData3d(formattedData);
                }
                setCurrentIteration(0);
                setIsPlaying(false);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [vizMode, learningRate]);

    useEffect(() => {
        let interval: any;
        const currentData = vizMode === '2d' ? data : data3d;
        if (isPlaying && currentData && currentData.steps && currentIteration < (currentData.steps.length ?? 0) - 1) {
            interval = setInterval(() => {
                setCurrentIteration(prev => prev + 1);
            }, 100);
        } else {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, data, data3d, currentIteration, vizMode]);

    if (loading && !data && !data3d) return <Status kind="loading" title={t.loading} />;

    const activeData = vizMode === '2d' ? data : data3d;
    const currentStep = activeData?.steps[currentIteration];

    return (
        <div className="animate-in">
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>{t.title}</h2>
                    <p className={styles.subtitle}>{t.subtitle}</p>
                </div>
                <Tabs
                    label={t.title}
                    value={vizMode}
                    onChange={setVizMode}
                    items={[
                        { id: '2d', label: t.mode2d },
                        { id: '3d', label: t.mode3d },
                    ]}
                />
            </div>

            <div className={styles.layout}>
                <Card padding="md" className={styles.explain}>
                    <div className="prose">
                        <h3 className={styles.explainHeading}>{t.heading}</h3>
                        <p>{t.p1}</p>

                        <Callout icon="info" title={t.scenario.title}>
                            <p>{t.scenario.lead}</p>
                            <ul>
                                <li>{t.scenario.bullets[1]}</li>
                                <li>{t.scenario.bullets[2]}</li>
                            </ul>
                        </Callout>

                        <p>{t.p2}</p>

                        <h4 className={styles.subheading}>{t.modelHeading}</h4>
                        <p>{t.modelLead}</p>

                        <Formula>y = W₁X₁ + W₂X₂ + b</Formula>

                        <div className={styles.legend}>
                            <div>{t.legend.y}</div>
                            <div>{t.legend.x}</div>
                            <div>{t.legend.w}</div>
                            <div>{t.legend.b}</div>
                        </div>

                        <h4 className={styles.subheading}>{t.realtimeHeading}</h4>
                        <p>{t.realtimeBody}</p>

                        <Callout tone="red" icon="alert" title={t.lrBox.title}>
                            <p>
                                <span className={styles.lrTerm}>{t.lrBox.tooLowLabel}</span>
                                {t.lrBox.tooLowBody}
                            </p>
                            <p>
                                <span className={styles.lrTerm}>{t.lrBox.tooHighLabel}</span>
                                {t.lrBox.tooHighBody}
                            </p>
                        </Callout>
                    </div>
                </Card>

                <div className={styles.work}>
                    <TrainingControls
                        isPlaying={isPlaying}
                        onTogglePlay={() => setIsPlaying(!isPlaying)}
                        onReset={() => {
                            setCurrentIteration(0);
                            setIsPlaying(false);
                        }}
                        learningRate={learningRate}
                        onLearningRateChange={setLearningRate}
                        lrMin={0.001}
                        lrMax={1}
                        lrStep={0.001}
                        iteration={currentIteration}
                        maxIteration={(activeData?.steps?.length ?? 1) - 1}
                        onIterationChange={setCurrentIteration}
                    />

                    <div className={styles.plots}>
                        {vizMode === '2d' ? (
                            <>
                                <RegressionPlot data={data?.data} currentStep={currentStep} />
                                <CostSurface surface={data?.cost_surface || null} steps={data?.steps || null} currentIteration={currentIteration} />
                            </>
                        ) : (
                            <>
                                <RegressionPlot3D data={data3d?.data} currentStep={currentStep} />
                                <Backprop3D surface={data3d?.cost_surface || null} steps={data3d?.steps || null} currentIteration={currentIteration} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinearRegressionContent;
