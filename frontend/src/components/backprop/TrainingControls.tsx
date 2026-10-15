import React from 'react';
import Button from '../ui/Button';
import { Card } from '../ui/Card';
import { useT } from '../../i18n';
import styles from './TrainingControls.module.css';

interface TrainingControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    onReset: () => void;
    learningRate: number;
    onLearningRateChange: (lr: number) => void;
    lrMin: number;
    lrMax: number;
    lrStep: number;
    iteration: number;
    maxIteration: number;
    onIterationChange: (iteration: number) => void;
}

/** Play / reset / learning rate / timeline toolbar of the gradient-descent playgrounds. */
const TrainingControls: React.FC<TrainingControlsProps> = ({
    isPlaying,
    onTogglePlay,
    onReset,
    learningRate,
    onLearningRateChange,
    lrMin,
    lrMax,
    lrStep,
    iteration,
    maxIteration,
    onIterationChange,
}) => {
    const t = useT('gradient').controls;
    const fill = maxIteration > 0 ? (iteration / maxIteration) * 100 : 0;

    return (
        <Card padding="sm" className={styles.toolbar}>
            <div className={styles.buttons}>
                <Button
                    variant={isPlaying ? 'danger' : 'primary'}
                    icon={isPlaying ? 'pause' : 'play'}
                    onClick={onTogglePlay}
                >
                    {isPlaying ? t.pause : t.start}
                </Button>
                <Button variant="secondary" icon="reset" onClick={onReset}>
                    {t.reset}
                </Button>
            </div>

            <label className={styles.lr}>
                <span className={styles.lrLabel}>{t.learningRate}</span>
                <input
                    type="number"
                    step={lrStep}
                    min={lrMin}
                    max={lrMax}
                    value={learningRate}
                    onChange={(e) => onLearningRateChange(parseFloat(e.target.value))}
                    className={styles.lrInput}
                />
            </label>

            <div className={styles.timeline}>
                <span className={styles.bound}>0</span>
                <input
                    type="range"
                    min={0}
                    max={maxIteration}
                    value={iteration}
                    onChange={(e) => onIterationChange(parseInt(e.target.value, 10))}
                    aria-label={t.iteration}
                    style={{ '--fill': `${fill}%` } as React.CSSProperties}
                />
                <span className={styles.bound}>{maxIteration}</span>
            </div>

            <div className={styles.iteration}>
                <span className={styles.iterationLabel}>{t.iteration}</span>
                <span className={styles.iterationValue}>{iteration}</span>
            </div>
        </Card>
    );
};

export default TrainingControls;
