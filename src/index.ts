import { Options, DefOptions } from './options';
import StepperView from './components/StepperView';
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

    public prev() {
        if (this.isFirstStep(this.currentStep) || !this.canStepPrev()) return;
        this.runStepChange(this.currentStep, --this.currentStep);
    }

    public next() {
        if (this.isLastStep(this.currentStep) || !this.canStepNext()) return;
        this.runStepChange(this.currentStep, ++this.currentStep);
    }

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

    private runStepChange(prev: number, next: number): void {
        this.eventListenters.change.forEach(cb => setTimeout(() => cb(prev, next), 0));
    }

    private isFirstStep(step: number): boolean {
        return step === 1;
    }

    private isLastStep(step: number): boolean {
        return step === this.stepsCount;
    }

    private setProgressItemActive(prev, next: number) {
        if (!this.progressView) return;

        this.progressView.setStep(prev, next);
    }

    private canStepNext(): boolean {
        // run custom validation

        return true;
    }

    private canStepPrev(): boolean {
        // run custom validator

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