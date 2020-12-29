import ProgressView from "./ProgressView";
import StepperClassNames from "./StepperClassNames";
import Stepper, { Step } from "./Stepper";

export default class StepperView extends Stepper {
    private progress?: ProgressView;
    
    constructor(steps: HTMLCollection) {
        super(steps);

        this.setup(this.getStepsHtml());
    }

    public setStepActive(step: Step): void {
        if (!step) return;

        const { index } = step;
        const [prev, next] = this.setStep(index);

        if (prev) prev.elem.classList.remove(StepperClassNames.itemActive);
        if (next) next.elem.classList.add(StepperClassNames.itemActive);

        if (this.progress) {
            this.progress.setActive(next.index);
        }
    }

    public enableProgress(progress: ProgressView): void {
        this.progress = progress;
    }
    
    private setup(steps: HTMLCollection): void {
        Array.prototype.forEach.call(steps, v => {
            v.classList.add(StepperClassNames.item);
        });
    }
}