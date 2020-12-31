import { Opts as ProgressOptions } from "./ProgressView";
import { Step } from "./Stepper";

export interface Options {
    window: Window | null;
    startIndex: number;
    progress?: ProgressOptions;
    cache?: boolean;
    urlParam?: string,
    validateStepChange?: (prev: Step, next: Step) => boolean;
}

export const DefOptions: Options = {
    window: typeof window !== 'undefined' ? window : null,
    startIndex: 0
}