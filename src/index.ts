import { Options, DefOptions } from './options';
import StepperView from './StepperView';
import { tag } from './utils';

import StepperClassNames from './StepperClassNames'

export default class Stepper {
    private eventListenters = {
        'change': []
    };

    private stepperView: StepperView;
    private progressView?: StepperView;
    private currentStep: number;
    private stepsCount: number;
    private wrapper: HTMLElement;
    private options: Options;

    constructor(container: HTMLElement, opts: Options) {
        this.options = { ...DefOptions, ...opts };
        this.stepsCount = this.getStepsCount(container);
        this.wrapper = this.setup(container, this.options);
        this.currentStep = this.getInitialStep();

        this.performStepChange(null, this.currentStep);
        this.onStepChangeCall(this.handleStepChangeCall.bind(this));

        if (!this.isStepsHTMLStructureValid(this.wrapper)) {
            throw new Error();
        }
    }


    // #region Public API

    public getCurrentStep(): number {
        return this.currentStep;
    }

    public prev(cb?: (step: number) => void): void {
        this.runStepChange(this.currentStep, this.currentStep - 1, cb);
    }

    public next(cb?: (step: number) => void): void {
        this.runStepChange(this.currentStep, this.currentStep + 1, cb);
    }

    public stepTo(step: number, cb?: (step: number) => void): void {
        const ok = this.runStepChange(this.currentStep, step, cb);

        if (!ok) {
            console.warn(`[Stepper.js]: transiion failed to step: ${step}. Looks like your step number is not within possible range.`);
        }
    }

    // #endregion


    private setup(container: HTMLElement, opts: Options): HTMLElement {
        const wrapper = tag('div', { attr: { class: StepperClassNames.container } });
        this.stepperView = new StepperView(container.children);

        if (opts.progress) this.insertProgressView(wrapper, container.children);

        /**
         * insert new HTML
         */
        wrapper.appendChild(this.stepperView.getHTML());
        container.insertAdjacentElement('beforebegin', wrapper);

        /**
         * clean initial container
         */
        if (container.parentElement) container.parentElement.removeChild(container);

        return wrapper;
    }

    private insertProgressView(wrapper: HTMLElement, steps: HTMLCollection) {
        this.progressView = new StepperView(steps, true);

        if (!this.options.progressContainer) {
            wrapper.insertAdjacentElement('afterbegin', this.progressView.getHTML());
        } else {
            this.options.progressContainer.innerHTML = '';
            this.options.progressContainer.appendChild(this.progressView.getHTML());
        }
    }

    private getStepsCount(container: HTMLElement): number {
        return container.children.length;
    }

    private getInitialStep(): number {
        /**
         * 0
         * get from cache
         * get from param
         */

        return 1;
    }

    private handleStepChangeCall(prev: number, next: number): void {
        this.performStepChange(prev, next);
    }

    private performStepChange(prev: number, next: number): void {
        this.setProgressItemActive(prev, next);
        this.stepperView.setStep(prev, next);
    }

    private onStepChangeCall(cb: () => any): void {
        this.eventListenters.change.push(cb);
    }

    private runStepChange(prev: number, next: number, cb?: (step: number) => void): boolean {
        next = Number.parseInt(next as any);

        const ok = this.isStepValid(next);

        if (!ok) return;

        this.currentStep = next;
        this.eventListenters.change.forEach(cb => setTimeout(() => cb(prev, next), 0));

        if (cb && typeof cb === 'function') cb(next);

        return ok;
    }

    private isStepValid(step: number): boolean {
        /**
         * Make sure value is always a number
         */
        if (typeof step !== 'number' || !Number.isFinite(step)) {
            console.warn(`[Stepper.js] supplied step value is not a number`);

            return;
        }

        /**
         * Make sure step is in steps range
         */
        return step >= 1 && step <= this.stepsCount;
    }

    private setProgressItemActive(prev, next: number) {
        if (!this.progressView) return;

        this.progressView.setStep(prev, next);
    }

    private canStepNext(): boolean {
        // run custom validation

        return true;
    }

    private isStepsHTMLStructureValid(el: HTMLElement): boolean {
        return true;
    }

    private validateArgs() {

    }

    private isOptsValid() {

    }

    private isContainerValid() {

    }

    private logError() {

    }
}