export interface SurfaceData {
    w?: number[];
    b?: number[];
    z: number[][];
    x?: number[];
    y?: number[];
}

export interface Step {
    w: number;
    b: number;
    cost: number;
    iteration: number;
    w1?: number;
    w2?: number;
    [key: string]: any;
}

export interface PlotData {
    x?: number[];
    y?: number[];
    x1?: number[];
    x2?: number[];
    label?: number[];
}

export interface ModelData {
    steps: Step[];
    surface: SurfaceData;
    plot_data: PlotData;
}
