import React, { useEffect, useMemo, useRef, useState } from "react";
import { fetchNNPlayground } from "../api";
import type { NNPlaygroundResponse } from "../api";
import { forward } from "../components/nn/network";
import type { SelectedNeuron } from "../components/nn/network";
import NetworkGraph from "../components/nn/NetworkGraph";
import DataCanvas from "../components/nn/DataCanvas";
import { Page, PageHeader } from "../components/ui/Page";
import { Card, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import { Callout, Slider, Status } from "../components/ui/Bits";
import NextStep from "../components/ui/NextStep";
import { useT } from "../i18n";
import styles from "./NeuralNetwork.module.css";

const NeuralNetwork: React.FC = () => {
    const t = useT("neuralnet");
    const [net, setNet] = useState<NNPlaygroundResponse | null>(null);
    // Only a flag is stored: the message is read from the dictionary at render
    // time, so it follows a language switch instead of freezing at fetch time.
    const [hasError, setHasError] = useState<boolean>(false);
    const [x1, setX1] = useState<number>(1.0);
    const [x2, setX2] = useState<number>(0.8);
    const [animStep, setAnimStep] = useState<number | null>(null);
    const [selected, setSelected] = useState<SelectedNeuron>(null);
    const animTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchNNPlayground()
            .then(setNet)
            .catch(() => setHasError(true));
        return () => {
            if (animTimer.current) clearInterval(animTimer.current);
        };
    }, []);

    const fp = useMemo(() => (net ? forward(net, x1, x2) : null), [net, x1, x2]);

    const startAnimation = () => {
        if (animTimer.current) clearInterval(animTimer.current);
        setSelected(null);
        setAnimStep(1);
        let step = 1;
        animTimer.current = setInterval(() => {
            step += 1;
            if (step > 5) {
                if (animTimer.current) clearInterval(animTimer.current);
                animTimer.current = null;
                setAnimStep(null);
            } else {
                setAnimStep(step);
            }
        }, 1100);
    };

    const renderInspector = () => {
        if (!net || !fp || selected === null) return null;

        const mono = styles.math;

        if (selected.layer === "input") {
            const v = fp.input[selected.index as 0 | 1] ?? 0;
            return (
                <div>
                    <h4 className={styles.inspectorTitle}>{t.inspector.inputTitle(selected.index + 1)}</h4>
                    <p className={styles.inspectorBody}>
                        {t.inspector.inputBody}
                    </p>
                    <div className={mono}>{t.inspector.inputValue} = {v.toFixed(2)}</div>
                </div>
            );
        }

        if (selected.layer === "hidden") {
            const j = selected.index;
            const w1 = net.W1[0]?.[j] ?? 0;
            const w2 = net.W1[1]?.[j] ?? 0;
            const b = net.b1[j] ?? 0;
            const z = fp.hiddenZ[j] ?? 0;
            const a = fp.hiddenA[j] ?? 0;
            return (
                <div>
                    <h4 className={styles.inspectorTitle}>{t.inspector.hiddenTitle(j + 1)}</h4>
                    <p className={styles.inspectorBody}>
                        {t.inspector.hiddenBody}
                        {a === 0 && (
                            <strong className="tone-orange">{t.inspector.hiddenInactive}</strong>
                        )}
                    </p>
                    <div className={mono}>
                        z = w₁·x₁ + w₂·x₂ + b = ({w1.toFixed(2)})·({x1.toFixed(2)}) + ({w2.toFixed(2)})·({x2.toFixed(2)}) + ({b.toFixed(2)}) = {z.toFixed(3)}
                        <br />
                        a = ReLU(z) = max(0, {z.toFixed(3)}) = <strong>{a.toFixed(3)}</strong>
                    </div>
                </div>
            );
        }

        const terms = net.W2.map((w, j) => `(${w.toFixed(2)})·(${(fp.hiddenA[j] ?? 0).toFixed(2)})`).join(" + ");
        return (
            <div>
                <h4 className={styles.inspectorTitle}>{t.inspector.outputTitle}</h4>
                <p className={styles.inspectorBody}>
                    {t.inspector.outputBody}
                </p>
                <div className={mono}>
                    z = {terms} + ({net.b2.toFixed(2)}) = {fp.outputZ.toFixed(3)}
                    <br />
                    ŷ = σ(z) = 1 / (1 + e^(−z)) = <strong>{fp.outputA.toFixed(3)}</strong>
                </div>
            </div>
        );
    };

    const inside = fp ? fp.outputA >= 0.5 : true;

    return (
        <Page width="wide">
            <PageHeader page="neural-network" title={t.header.title} subtitle={t.header.subtitle} />

            {hasError && (
                <Card padding="md">
                    <Status kind="error" title={t.connectionError} />
                </Card>
            )}

            {!net && !hasError && <Status kind="loading" title={t.training} />}

            {net && fp && (
                <div className={styles.content}>
                    <Callout icon="info">
                        <p>{t.problem(net.b1.length)}</p>
                    </Callout>

                    <div className={styles.layout}>
                        <div className={styles.side}>
                            <Card padding="md">
                                <CardHeader compact title={t.inputSpace} icon="target" tone="cyan" />
                                <DataCanvas
                                    net={net}
                                    x1={x1}
                                    x2={x2}
                                    onChange={(nx1, nx2) => {
                                        setX1(nx1);
                                        setX2(nx2);
                                    }}
                                />
                                <div className={styles.sliders}>
                                    <Slider label="x₁" valueLabel={x1.toFixed(2)} min={-3} max={3} step={0.05} value={x1} onChange={setX1} />
                                    <Slider label="x₂" valueLabel={x2.toFixed(2)} min={-3} max={3} step={0.05} value={x2} onChange={setX2} />
                                </div>
                            </Card>

                            <Card padding="md">
                                <CardHeader compact title={t.prediction.heading} icon="sparkles" tone={inside ? "indigo" : "orange"} />
                                <div className={styles.prediction} data-tone={inside ? "indigo" : "orange"}>
                                    <span className={styles.probability}>{(fp.outputA * 100).toFixed(1)}%</span>
                                    <span className={styles.probabilityLabel}>{t.prediction.probabilityInside}</span>
                                </div>
                                <div className={styles.meter} data-tone={inside ? "indigo" : "orange"}>
                                    <div className={styles.meterFill} style={{ width: `${fp.outputA * 100}%` }} />
                                </div>
                                <p className={styles.predictionMeta}>
                                    {t.prediction.activeNeurons}{" "}
                                    <strong>
                                        {fp.hiddenA.filter((a) => a > 0).length} / {fp.hiddenA.length}
                                    </strong>
                                    {" · "}{t.prediction.accuracy} <strong>{(net.accuracy * 100).toFixed(0)}%</strong>
                                </p>
                            </Card>
                        </div>

                        <Card padding="md" className={styles.graphCard}>
                            <CardHeader
                                compact
                                title={t.graph.heading}
                                icon="network"
                                actions={
                                    <Button icon="play" onClick={startAnimation} disabled={animStep !== null}>
                                        {t.graph.propagate}
                                    </Button>
                                }
                            />

                            {animStep !== null && (
                                <div className={`${styles.stepCaption} animate-in`} key={animStep}>
                                    <span className={styles.stepNumber}>{animStep}/5</span>
                                    {t.steps[animStep as 1 | 2 | 3 | 4 | 5]}
                                </div>
                            )}

                            <NetworkGraph net={net} fp={fp} animStep={animStep} selected={selected} onSelect={setSelected} />

                            {selected !== null && (
                                <div className={`${styles.inspector} animate-in`}>{renderInspector()}</div>
                            )}
                        </Card>
                    </div>

                    <section className={styles.theory}>
                        <Card padding="md">
                            <h4 className={styles.theoryTitle}>
                                <span className={styles.theoryIcon} data-tone="indigo"><Icon name="scale" size={18} /></span>
                                {t.theory.weighted.title}
                            </h4>
                            <p className="prose prose-sm">{t.theory.weighted.body}</p>
                        </Card>
                        <Card padding="md">
                            <h4 className={styles.theoryTitle}>
                                <span className={styles.theoryIcon} data-tone="orange"><Icon name="zap" size={18} /></span>
                                {t.theory.relu.title}
                            </h4>
                            <p className="prose prose-sm">{t.theory.relu.body}</p>
                        </Card>
                        <Card padding="md">
                            <h4 className={styles.theoryTitle}>
                                <span className={styles.theoryIcon} data-tone="cyan"><Icon name="layers" size={18} /></span>
                                {t.theory.concepts.title}
                            </h4>
                            <p className="prose prose-sm">{t.theory.concepts.body}</p>
                        </Card>
                    </section>

                    <NextStep from="neural-network" />
                </div>
            )}
        </Page>
    );
};

export default NeuralNetwork;
