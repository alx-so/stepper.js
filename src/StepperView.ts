import ProgressView from "./ProgressView";
import StepperClassNames from "./StepperClassNames";
import StepperViewBase, { Step } from "./StepperViewBase";

export default class StepperView extends StepperViewBase {
    private progress?: ProgressView;
    
    constructor(steps: HTMLCollection) {
        super(steps);

        this.setup(this.getStepsHtml());
    }

    public setStepActive(step: Step): void {
        const { index } = step;
        const [prev, next] = this.setStep(index);

        if (prev) prev.elem.classList.remove(StepperClassNames.itemActive);
        if (next) next.elem.classList.add(StepperClassNames.itemActive);

        if (this.progress) {
            this.progress.setActive(index);
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