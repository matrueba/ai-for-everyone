/**
 * Shapes shared by every locale.
 *
 * They exist so TypeScript can enforce *completeness* on content that lives in
 * collections: a `Record<Id, Copy>` forces every locale to provide every entry,
 * which a plain array (`Copy[]`) could not guarantee.
 */

export type PageId =
    | "home"
    | "history"
    | "train"
    | "gradient-descent"
    | "inference"
    | "neural-network"
    | "evaluation"
    | "visualizer";

export type MenuLabels = Record<PageId, string>;

/** Ids of the timeline slides in the History page. */
export type HistorySlideId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19;

export interface HistorySlideContent {
    title: string;
    year: string;
    description: string;
    milestones: string[];
    quote: { text: string; author: string };
}

export type HistorySlides = Record<HistorySlideId, HistorySlideContent>;

/** Scenarios exposed by `/api/inference-scenario`. */
export type InferenceScenarioId = "generic" | "houses" | "admission";

export interface InferenceScenarioCopy {
    /** Short label for the tab selector. */
    tab: string;
    title: string;
    description: string;
    x1Label: string;
    x2Label: string;
    yLabel: string;
}

export type InferenceScenarios = Record<InferenceScenarioId, InferenceScenarioCopy>;

/** Captions of the step-by-step forward-pass animation. */
export type NNStepCaptions = Record<1 | 2 | 3 | 4 | 5, string>;
