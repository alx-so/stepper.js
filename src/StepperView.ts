import ProgressView from "./ProgressView";
import StepperClassNames from "./StepperClassNames";
import Stepper, { Step } from "./Stepper";

export default class StepperView extends Stepper {
    private container: HTMLElement;
    private progress?: ProgressView;

    constructor(container: HTMLElement) {
        super(container.children);

        this.container = container;
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

    public setProgress(progress: ProgressView): void {
        if (this.progress) {
            console.warn('[Stepper.js] progress already setup!');

            return;
        }

        this.progress = progress;
        this.setupProgress(this.progress);
    }

    public getProgress(): ProgressView | null {
        return this.progress;
    }

    public setupProgress(progress: ProgressView): void {
        const opts = progress.getOpts();
        if (typeof opts === 'object') {
            if (!opts.container) this.container.insertAdjacentElement('beforebegin', progress.getHTML());
        }
    }
    
    private setup(steps: HTMLCollection): void {
        Array.prototype.forEach.call(steps, v => {
            v.classList.add(StepperClassNames.item);
        });
    }
}