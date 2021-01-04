import { Opts as ProgressOptions } from "./ProgressView";
import { Step } from "./StepperBase";

export interface ClassNameOpts {
    progressContainer: string;
    progressItem: string;
    progressActive: string;
    stepsContainer: string;
    stepItem: string;
    stepActive: string;
}

export interface Options {
    startIndex: number;
    className: ClassNameOpts
    progress?: ProgressOptions;
    cache?: boolean;
    urlParam?: string,
    validateStepChange?: (prev: Step, next: Step) => boolean;
}

export const DefOptions: Options = {
    startIndex: 0,
    className: {
        progressContainer: 'stepper-progress',
        progressItem: 'stepper-progress-item',
        progressActive: 'is-active',
        stepsContainer: 'stepper',
        stepItem: 'stepper-item',
        stepActive: 'is-active'
    }
}