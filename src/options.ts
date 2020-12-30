import { ProgressOptions } from "./ProgressView";
import { Step } from "./Stepper";

export interface Options {
    window: Window | null;
    startStep: number;
    progress?: boolean | ProgressOptions;
    validateStepChange?: (prev: Step, next: Step) => boolean;
}

export const DefOptions: Options = {
    window: typeof window !== 'undefined' ? window : null,
    startStep: 0
}