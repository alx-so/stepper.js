import { Options, DefOptions } from './options';
import StepperView from './StepperView';
import { tag } from './utils';

import StepperClassNames from './StepperClassNames'

export default class Stepper {
    private eventListenters = { 'change': [] };
    private stepperView: StepperView;
    private progressView?: StepperView;
    private currentStep: number;
    private stepsCount: number;
    private wrapper: HTMLElement;
    private options: Options;
    private frozen: boolean;

    constructor(container: HTMLElement, opts: Options) {
        this.options = { ...DefOptions, ...opts };
        this.stepsCount = this.getStepsCount(container);
        this.wrapper = this.setup(container, this.options);
        this.currentStep = this.getInitialStep();

        this.onStepChangeCall(this.handleStepChangeCall.bind(this));

        if (!this.isStepsHTMLStructureValid(this.wrapper)) {
            throw new Error();
        }

        this.performStepChange(null, this.currentStep);
    }

    // #region Public API

    public destroy(): void {
        for (let key in this) {
            // if (key === 'options') continue;
            delete this[key];
        }

        // cleanup prototype chain
        let p = Object.getPrototypeOf(this);
        while(p) {
            for (let key in p) {
                delete p[key];
            }

            p = Object.getPrototypeOf(p);
        }
    }

    public reset(): void {
        this.frozen = false;
        this.performStepChange(this.currentStep, 1);
    }

    public isFrozen(): boolean {
        return this.frozen;
    }

    public freeze(isFrozen: boolean): void {
        this.frozen = isFrozen;
    }

    public getCurrentStep(): number {
        return this.currentStep;
    }

    public prev(cb?: (step: number) => void): void {
        this.performStepChange(this.currentStep, this.currentStep - 1, cb);
    }

    public next(cb?: (step: number) => void): void {
        this.performStepChange(this.currentStep, this.currentStep + 1, cb);
    }

    public stepTo(step: number, cb?: (step: number) => void): void {
        const ok = this.performStepChange(this.currentStep, step, cb);

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

        return this.options.startStep;
    }

    private handleStepChangeCall(prev: number, next: number): void {
        this.currentStep = next;
        this.performViewUpdate(prev, next);
    }

    private performViewUpdate(prev: number, next: number): void {
        this.setProgressItemActive(prev, next);
        this.stepperView.setStep(prev, next);
    }

    private onStepChangeCall(cb: () => any): void {
        this.eventListenters.change.push(cb);
    }

    private performStepChange(prev: number, next: number, cb?: (step: number) => void): boolean {
        next = Number.parseInt(next as any);

        if (this.frozen) {
            console.warn('[Stepper.js] is frozen');

            return;
        }

        const ok = this.isStepValid(next) && this.isStepChangeValid(prev, next);
        
        if (!ok) return;

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

    /**
     * Custom validator supplied by user
     */
    private isStepChangeValid(prev: number, next: number): boolean {
        if (!this.options.validateStepChange || typeof this.options.validateStepChange !== 'function') return true;

        return this.options.validateStepChange(prev, next);
    }

    private setProgressItemActive(prev: number, next: number) {
        if (!this.progressView) return;

        this.progressView.setStep(prev, next);
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