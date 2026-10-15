import React from 'react';
import { Page, PageHeader, Stack } from '../components/ui/Page';
import { Card } from '../components/ui/Card';
import { Callout, Figure, SectionTitle, StepBadge } from '../components/ui/Bits';
import NextStep from '../components/ui/NextStep';
import { useT } from '../i18n';
import styles from './Train.module.css';

/** Image of each step of the cycle; the copy comes from the active locale. */
const STEP_IMAGES = {
    1: '/step1_batches.png',
    2: '/step2_forward.png',
    3: '/step3_loss.png',
    4: '/step4_optimization.png',
} as const;

const Train: React.FC = () => {
    const t = useT('train');
    const elements = t.elements;

    return (
        <Page width="prose">
            <PageHeader page="train" title={t.header.title} subtitle={t.header.subtitle} />

            <Stack gap="lg">
                <Card as="section" padding="lg">
                    <div className="prose">
                        <p>{t.intro.p1}</p>
                        <p>{t.intro.p2}</p>
                    </div>
                </Card>

                <Card as="section" padding="lg">
                    <SectionTitle step={1}>{elements.heading}</SectionTitle>
                    <p className={`prose ${styles.lead}`}>{elements.lead}</p>

                    <div className={styles.elements}>
                        <Card variant="sunken" padding="md">
                            <h3 className={styles.elementTitle}>
                                <StepBadge size="sm">A</StepBadge>
                                {elements.dataset.title}
                            </h3>
                            <p className="prose prose-sm">{elements.dataset.body}</p>

                            <p className={styles.tableLabel}>{elements.dataset.exampleLabel}</p>
                            <div className={styles.tableWrap}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>{elements.dataset.table.headers.area}</th>
                                            <th>{elements.dataset.table.headers.rooms}</th>
                                            <th>{elements.dataset.table.headers.elevator}</th>
                                            <th className={styles.target}>{elements.dataset.table.headers.price}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elements.dataset.table.rows.map((row) => (
                                            <tr key={row.area}>
                                                <td>{row.area}</td>
                                                <td>{row.rooms}</td>
                                                <td>{row.elevator}</td>
                                                <td className={styles.target}>{row.price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <Card variant="sunken" padding="md">
                            <h3 className={styles.elementTitle}>
                                <StepBadge size="sm">B</StepBadge>
                                {elements.expected.title}
                            </h3>
                            <p className="prose prose-sm">{elements.expected.body}</p>
                        </Card>

                        <Card variant="sunken" padding="md">
                            <h3 className={styles.elementTitle}>
                                <StepBadge size="sm">C</StepBadge>
                                {elements.algorithm.title}
                            </h3>
                            <p className="prose prose-sm">{elements.algorithm.body}</p>
                        </Card>
                    </div>
                </Card>

                <Card as="section" padding="lg">
                    <SectionTitle step={2}>{t.cycle.heading}</SectionTitle>
                    <p className={`prose ${styles.lead}`}>{t.cycle.lead}</p>

                    <ol className={styles.timeline}>
                        {([1, 2, 3, 4] as const).map((n) => {
                            const step = t.cycle.steps[n];
                            return (
                                <li key={n} className={styles.timelineItem}>
                                    <StepBadge variant="solid" size="md">{n}</StepBadge>
                                    <div className={styles.timelineBody}>
                                        <h3 className={styles.stepTitle}>{step.title}</h3>
                                        <p className="prose">{step.body}</p>

                                        {n === 3 && (
                                            <Callout icon="target" title={t.cycle.analogies.dartboard.title}>
                                                <p>{t.cycle.analogies.dartboard.body}</p>
                                            </Callout>
                                        )}
                                        {n === 4 && (
                                            <Callout icon="sliders" title={t.cycle.analogies.mixer.title}>
                                                <p>{t.cycle.analogies.mixer.body}</p>
                                            </Callout>
                                        )}

                                        <Figure src={STEP_IMAGES[n]} alt={step.imageAlt} caption={step.caption} />
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    <p className={`prose ${styles.outro}`}>{t.cycle.outro}</p>
                </Card>

                <NextStep from="train">
                    <p className={styles.ctaTitle}>{t.cta.title}</p>
                    <p className={styles.ctaBody}>{t.cta.body}</p>
                </NextStep>
            </Stack>
        </Page>
    );
};

export default Train;
