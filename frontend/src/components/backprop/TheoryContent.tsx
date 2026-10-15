import React from 'react';
import { Card } from '../ui/Card';
import { Stack } from '../ui/Page';
import { Callout, Figure, Formula, SectionTitle } from '../ui/Bits';
import NextStep from '../ui/NextStep';
import { useT } from '../../i18n';
import styles from './TheoryContent.module.css';

const TheoryContent: React.FC = () => {
    const t = useT('gradient').theory;

    return (
        <div className={`${styles.theory} animate-in`}>
            <Stack gap="lg">
                <Card as="section" padding="lg">
                    <SectionTitle step={1}>{t.optimization.heading}</SectionTitle>
                    <div className="prose">
                        <p>{t.optimization.p1}</p>
                        <p>{t.optimization.p2}</p>
                    </div>
                </Card>

                <Card as="section" padding="lg">
                    <SectionTitle step={2}>{t.cost.heading}</SectionTitle>
                    <div className="prose">
                        <p>{t.cost.p1}</p>
                        <p>{t.cost.p2}</p>
                    </div>
                    <div className={styles.costGrid}>
                        <Card variant="sunken" padding="md" className={styles.costCard}>
                            <h3 className={styles.costTitle}>{t.cost.mse.title}</h3>
                            <p className="prose prose-sm">{t.cost.mse.body}</p>
                            <Formula size="sm">MSE = (1/n) Σ (y - ŷ)²</Formula>
                        </Card>
                        <Card variant="sunken" padding="md" className={styles.costCard}>
                            <h3 className={styles.costTitle}>{t.cost.crossEntropy.title}</h3>
                            <p className="prose prose-sm">{t.cost.crossEntropy.body}</p>
                            <Formula size="sm">L = -1/n Σ [y·log(ŷ) + (1-y)·log(1-ŷ)]</Formula>
                        </Card>
                    </div>
                </Card>

                <Card as="section" padding="lg">
                    <SectionTitle step={3}>{t.analogy.heading}</SectionTitle>
                    <div className="prose">
                        <p>{t.analogy.p1}</p>
                        <Figure src="/gradient_descent_math.png" alt={t.analogy.mathAlt} />
                        <p>{t.analogy.lead}</p>
                        <Callout icon="lightbulb">
                            <p>{t.analogy.quote}</p>
                        </Callout>
                        <Figure src="/gradient_descent.png" alt={t.analogy.descentAlt} caption={t.analogy.descentCaption} />
                        <p>{t.analogy.p2}</p>
                        <p>{t.analogy.p3}</p>
                    </div>
                </Card>

                <Card as="section" padding="lg">
                    <SectionTitle step={4}>{t.math.heading}</SectionTitle>
                    <div className="prose">
                        <p>{t.math.p1}</p>
                        <Formula>w = w - η ∇ J(w)</Formula>
                    </div>
                    <dl className={styles.terms}>
                        <div>
                            <dt>w</dt>
                            <dd>{t.math.terms.weights}</dd>
                        </div>
                        <div>
                            <dt>∇ J(w)</dt>
                            <dd>{t.math.terms.gradient}</dd>
                        </div>
                        <div>
                            <dt>η</dt>
                            <dd>{t.math.terms.learningRate}</dd>
                        </div>
                    </dl>
                </Card>

                <NextStep from="gradient-descent">{t.cta}</NextStep>
            </Stack>
        </div>
    );
};

export default TheoryContent;
