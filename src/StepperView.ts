import ProgressView, { Opts as ProgressViewOpts } from "./ProgressView";
import StepperClassNames from "./StepperClassNames";
import Stepper from "./Stepper";

export interface Opts {
    index: number,
    progress: ProgressViewOpts,
    progressClickHandler?: (n: number) => void
}

export default class StepperView extends Stepper {
    private container: HTMLElement;
    private progress?: ProgressView;
    private opts: Opts;

    constructor(container: HTMLElement, opts: Opts) {
        super(container.children);

        this.container = container;
        this.opts = opts;
        this.setup(this.getStepsHtml());

        if (opts.progress) this.setupProgress(opts.progress);

        this.setStepActive(opts.index);
    }

    public setStepActive(index: number): void {
        if (!isFinite(index)) return;

        const [prev, next] = this.setStep(index);

        if (prev) prev.elem.classList.remove(StepperClassNames.itemActive);
        if (next) next.elem.classList.add(StepperClassNames.itemActive);

        if (this.progress && next) {
            this.progress.setActive(next.index);
        }
    }

    private setupProgress(opts: ProgressViewOpts): void {
        const p = new ProgressView(this.getStepsCount(), opts);
        opts = p.getOpts();

        if (typeof opts === 'object') {
            if (!opts.container) this.container.insertAdjacentElement('beforebegin', p.getHTML());
        }

        if (opts.navEnabled && typeof this.opts.progressClickHandler === 'function') {
            p.onClick = n => this.opts.progressClickHandler(n);
        }

        this.progress = p;
    }
    
    private setup(steps: HTMLCollection): void {
        Array.prototype.forEach.call(steps, v => {
            v.classList.add(StepperClassNames.item);
        });
    }
}