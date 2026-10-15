import React from 'react';
import { Card, CardHeader } from '../ui/Card';
import styles from './PlotPanel.module.css';

interface PlotPanelProps {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    /** Live readout under the chart (iteration, cost, fitted equation…). */
    footer?: React.ReactNode;
    children: React.ReactNode;
}

/** Card frame shared by every gradient-descent chart, so they line up in the grid. */
const PlotPanel: React.FC<PlotPanelProps> = ({ title, subtitle, actions, footer, children }) => (
    <Card padding="sm" fill className={styles.panel}>
        <CardHeader compact title={title} subtitle={subtitle} actions={actions} />
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
    </Card>
);

/** Small inline readout: "Label value", value in mono. */
export const Readout: React.FC<{ label: React.ReactNode; value: React.ReactNode; tone?: 'indigo' | 'red' | undefined }> = ({
    label,
    value,
    tone = 'indigo',
}) => (
    <span className={styles.readout}>
        {label} <span className={styles.readoutValue} data-tone={tone}>{value}</span>
    </span>
);

export default PlotPanel;
