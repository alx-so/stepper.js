import { Opts as ProgressOptions } from "./ProgressView";
import { Step } from "./Stepper";

export interface Options {
    startIndex: number;
    progress?: ProgressOptions;
    cache?: boolean;
    urlParam?: string,
    validateStepChange?: (prev: Step, next: Step) => boolean;
}

export const DefOptions: Options = {
    startIndex: 0
}