import { ClassNameOpts } from "./options";
import ProgressView, { Opts as ProgressViewOpts } from "./ProgressView";
import StepperBase from "./StepperBase";

export interface Opts {
    index: number;
    className: ClassNameOpts;
    progress: ProgressViewOpts;
}

export default class StepperView extends StepperBase {
    private container: HTMLElement;
    private progress?: ProgressView;
    private opts: Opts;

    constructor(container: HTMLElement, opts: Opts) {
        super(container.children);

        this.opts = opts;
        this.container = container;
        this.setup(this.getStepsHtml());

        if (opts.progress) this.setupProgress();

        this.setStepActive(opts.index);
    }

    public setStepActive(index: number): void {
        if (!isFinite(index)) return;

        const [prev, next] = this.setStep(index);

        if (prev) prev.elem.classList.remove(this.opts.className.stepActive);
        if (next) next.elem.classList.add(this.opts.className.stepActive);

        if (this.progress && next) {
            this.progress.setActive(next.index);
        }
    }

    public getHTML(): HTMLElement {
        return this.container;
    }

    public getProgress(): ProgressView {
        return this.progress;
    }

    private setupProgress(): void {
        const p = new ProgressView(this.getStepsCount(), this.opts.className, this.opts.progress);

        if (this.opts.progress && !this.opts.progress.container) {
            this.container.insertAdjacentElement('beforebegin', p.getHTML());
        }

        this.progress = p;
    }
    
    private setup(steps: HTMLCollection): void {
        this.container.classList.add(this.opts.className.stepsContainer);
        Array.prototype.forEach.call(steps, v => {
            v.classList.add(this.opts.className.stepItem);
        });
    }
}