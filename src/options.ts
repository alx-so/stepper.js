import { Step } from "./StepperViewBase";

export interface Options {
    window: Window | null;
    startStep: number;
    progress?: boolean;
    progressNavEnabled?: boolean;
    progressContainer?: HTMLElement;
    validateStepChange?: (prev: Step, next: Step) => boolean;
}

export const DefOptions: Options = {
    window: typeof window !== 'undefined' ? window : null,
    startStep: 0
}