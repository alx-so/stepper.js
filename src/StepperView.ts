import { ClassNameOpts } from "./options";
import ProgressView, { Opts as ProgressViewOpts } from "./ProgressView";
import StepperBase, { Step } from "./StepperBase";

export interface Opts {
    index: number;
    className: ClassNameOpts;
    progress?: ProgressViewOpts;
}

export default class StepperView extends StepperBase {
    private container: HTMLElement;
    private progress?: ProgressView;
    private opts: Opts;

    constructor(container: HTMLElement, opts: Opts) {
        super(container.children, opts.index);

        this.opts = opts;
        this.container = container;
        
        if (opts.progress) {
            this.progress = this.setupProgress();
        }
        
        this.setup(this.getStepsHtml());
    }

    public setStepActive(index: number): void {
        if (!isFinite(index)) return;

        const [prev, next] = this.setStep(index);

        this.setStepClassActive(prev, next);

        if (this.progress && next) {
            this.progress.setActive(next.index);
        }
    }

    public getHTML(): HTMLElement {
        return this.container;
    }

    public getProgress(): ProgressView | undefined {
        return this.progress;
    }

    private setStepClassActive(prev?: Step, next?: Step) {
        if (prev) prev.elem.classList.remove(this.opts.className.stepActive);
        if (next) next.elem.classList.add(this.opts.className.stepActive);
    }

    private setupProgress(): ProgressView {
        const p = new ProgressView(this.getStepsCount(), this.opts.className, this.opts.progress);

        if (!this.opts.progress?.container) {
            this.container.insertAdjacentElement('beforebegin', p.getHTML());
        }

        return p;
    }
    
    private setup(steps: HTMLCollection): void {
        this.container.classList.add(this.opts.className.stepsContainer);

        Array.prototype.forEach.call(steps, (v: HTMLElement) => {
            v.classList.add(this.opts.className.stepItem);
            v.classList.remove(this.opts.className.stepActive);
        });

        // set initial active className
        this.setStepClassActive(undefined, this.getCurrentStep());
        if (this.progress) this.progress.setActive(this.opts.index);
    }
}