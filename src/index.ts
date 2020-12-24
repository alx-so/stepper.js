import { Options, DefOptions } from './options';
import ProgressBar from './ProgressBar';
import { tag } from './utils';

import StepperClassNames from './StepperClassNames'

export default class Stepper {
    private eventListenters = {
        'change': []
    };

    private progressBar?: ProgressBar;
    private currentStep: number;
    private stepsCount: number;
    private stepElems: Element[] = [];
    private container: HTMLElement;
    private options: Options;

    constructor(stepsContainer: HTMLElement, opts: Options) {
        this.options = { ...DefOptions, ...opts };
        this.container = this.setup(stepsContainer, this.options);

        this.currentStep = this.getInitialStep();
        this.performStepChange(null, this.currentStep);
        this.onStepChangeCall(this.handleStepChangeCall.bind(this));

        if (!this.isStepsHTMLStructureValid(this.container)) {
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
        this.stepsCount = this.getStepsCount(container);
        const wrapper = tag('div', { attr: { class: StepperClassNames.container } });

        if (opts.progress) {
            this.progressBar = this.setupProgressBar(wrapper);
        }

        wrapper.appendChild(this.setupStepperItems(container));

        /**
         * insert new HTML
         */
        container.insertAdjacentElement('beforebegin', wrapper);

        /**
         * clean initial container
         */
        if (container.parentElement) container.parentElement.removeChild(container);

        return wrapper;
    }

    private setupInitialState(step: number): void {
        this.setStepItemActive(null, this.currentStep);
    }

    private setupStepperItems(srcContainer: HTMLElement): HTMLElement {
        const inner = tag('div', { attr: { class: StepperClassNames.inner } });

        Array.prototype.forEach.call(srcContainer.children, (el: HTMLElement) => {
            inner.appendChild(el.cloneNode(true));

            const stepEl = inner.children[inner.childElementCount - 1];

            this.stepElems.push(stepEl);

            stepEl.classList.add(StepperClassNames.item);
        });

        return inner;
    }

    private setupProgressBar(wrapper: HTMLElement): ProgressBar {
        const el = tag('div', {
            attr: { 'class': StepperClassNames.progress }
        });

        const pb = new ProgressBar(el as HTMLElement, this.stepsCount);

        if (!this.options.progressContainer) {
            wrapper.insertAdjacentElement('afterbegin', pb.container);
        } else {
            this.options.progressContainer.innerHTML = '';
            this.options.progressContainer.appendChild(pb.container);
        }

        return pb;
    }

    private getStepsCount(container: HTMLElement): number {
        return container.children.length;
    }

    private getInitialStep(): number {
        /**
         * 0
         * get from cache
         * get from param
         * 
         */

        return 1;
    }

    private handleStepChangeCall(prev: number, next: number): void {
        this.performStepChange(prev, next);
    }

    private performStepChange(prev: number, next: number): void {
        this.setProgressItemActive(next);
        this.setStepItemActive(prev, next);
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

    private setProgressItemActive(step: number) {
        if (!this.progressBar) return;

        this.progressBar.setStep(step);
    }

    private setStepItemActive(prevStep: number, nextStep: number) {
        if (prevStep) {
            this.stepElems[prevStep - 1].classList.remove(StepperClassNames.itemActive);
        }

        if (nextStep) {
            this.stepElems[nextStep - 1].classList.add(StepperClassNames.itemActive);
            this.container.setAttribute('active-step', nextStep.toString());
        }
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