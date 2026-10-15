import styles from './chartStyles.module.css';

/** Class for d3-appended axis titles (SVG text can't use the component's CSS module directly). */
export const AXIS_LABEL = styles.axisLabel ?? '';

/** Fitted-equation readout in plot footers. */
export const EQUATION = styles.equation ?? '';
