import React, { useState, useEffect } from 'react';
import LogisticRegressionPlot from './LogisticRegressionPlot';
import CostSurface from './CostSurface';
import LogisticRegressionPlot3D from './LogisticRegressionPlot3D';
import Backprop3D from './Backprop3D';
import TrainingControls from './TrainingControls';
import { Card } from '../ui/Card';
import Tabs from '../ui/Tabs';
import { Callout, Figure, Formula, Status } from '../ui/Bits';
import { useT } from '../../i18n';
import styles from './Playground.module.css';

import type { Step, SurfaceData, PlotData } from './types';

interface FormattedData {
    steps: Step[];
    cost_surface: SurfaceData;
    data: PlotData;
}

const logistic_regression_data = (vizMode: '2d' | '3d') => {
    let X: number[][], y: number[];
    if (vizMode === '2d') {
        const rawX = Array.from({ length: 40 }, (_, i) => -5 + (i * 10 / 39));
        X = rawX.map(x => [x]);
        y = rawX.map(x => (Math.random() < (1 / (1 + Math.exp(-(2 * x - 1)))) ? 1 : 0));
    } else {
        X = Array.from({ length: 100 }, () => [
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
        ]);
        y = X.map((row) => {
            const x1 = row[0] ?? 0;
            const x2 = row[1] ?? 0;
            return (Math.random() < (1 / (1 + Math.exp(-(2 * x1 + 3 * x2 + 1)))) ? 1 : 0);
        });
    }
    return { X, y };
}

const LogisticRegressionContent: React.FC = () => {
    const gradient = useT('gradient');
    const t = gradient.logistic;
    const [data, setData] = useState<FormattedData | null>(null);
    const [data3d, setData3d] = useState<FormattedData | null>(null);
    const [vizMode, setVizMode] = useState<'2d' | '3d'>('2d');
    const [learningRate, setLearningRate] = useState<number>(0.5);
    const [currentIteration, setCurrentIteration] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        const { X, y } = logistic_regression_data(vizMode);

        fetch('http://localhost:8000/api/logistic-regression-matrix', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                X,
                y,
                learning_rate: learningRate,
                iterations: 150
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
                        w: vizMode === '2d' ? step.weights[0] : undefined,
                        w1: vizMode === '3d' ? step.weights[0] : undefined,
                        w2: vizMode === '3d' ? step.weights[1] : undefined,
                        b: step.bias,
                        predictions: vizMode === '2d'
                            ? X.map(r => 1 / (1 + Math.exp(-((r[0] ?? 0) * (step.weights?.[0] ?? 0) + (step.bias ?? 0)))))
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
        if (isPlaying && currentData && currentIteration < currentData.steps.length - 1) {
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
    const currentStep = activeData?.steps ? activeData.steps[currentIteration] : undefined;

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

                        <Figure src="/sigmoid_function.png" alt={t.sigmoidAlt} caption={t.sigmoidCaption} />

                        <h4 className={styles.subheading}>{t.modelHeading}</h4>
                        <p>{t.modelLead}</p>

                        <Formula size="md">
                            z = W₁X₁ + W₂X₂ + b{'\n'}y = σ(z) = 1 / (1 + e<sup>-z</sup>)
                        </Formula>

                        <div className={styles.legend}>
                            <div>{t.legend.y}</div>
                            <div>{t.legend.z}</div>
                            <div>{t.legend.x}</div>
                            <div>{t.legend.w}</div>
                            <div>{t.legend.sigma}</div>
                        </div>

                        <h4 className={styles.subheading}>{t.borderHeading}</h4>
                        <p>{t.borderBody}</p>

                        <Callout tone="red" icon="alert" title={t.lossBox.title}>
                            <p>{t.lossBox.body}</p>
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
                        lrMin={0.01}
                        lrMax={5}
                        lrStep={0.01}
                        iteration={currentIteration}
                        maxIteration={(activeData?.steps?.length ?? 1) - 1}
                        onIterationChange={setCurrentIteration}
                    />

                    <div className={styles.plots}>
                        {vizMode === '2d' ? (
                            <>
                                <LogisticRegressionPlot data={data?.data} currentStep={currentStep} />
                                <CostSurface surface={data?.cost_surface ?? null} steps={data?.steps ?? null} currentIteration={currentIteration} />
                            </>
                        ) : (
                            <>
                                <LogisticRegressionPlot3D data={data3d?.data} currentStep={currentStep} />
                                <Backprop3D surface={data3d?.cost_surface ?? null} steps={data3d?.steps ?? null} currentIteration={currentIteration} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticRegressionContent;
