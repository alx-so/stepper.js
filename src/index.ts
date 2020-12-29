import { Options, DefOptions } from './options';
import StepperView from './StepperView';
import ProgressView from './ProgressView';
import { Step } from './StepperViewBase';

export default class Stepper {
    private eventListenters = { 'change': [] };
    private stepperView: StepperView;
    private options: Options;
    private frozen: boolean;

    constructor(container: HTMLElement, opts: Options) {
        this.options = { ...DefOptions, ...opts };
        this.setup(container, this.options);
        this.onStepChangeCall(this.handleStepChangeCall.bind(this));
        this.performStepChange(this.getInitialStep().index);
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
        this.performStepChange(0);
    }

    public isFrozen(): boolean {
        return this.frozen;
    }

    public freeze(isFrozen: boolean): void {
        this.frozen = isFrozen;
    }

    public getCurrentStep(): Step {
        return this.stepperView.getCurrentStep();
    }

    public prev(cb?: (step: Step) => void): void {
        this.performStepChange(this.stepperView.getCurrentStep().index - 1, cb);
    }

    public next(cb?: (step: Step) => void): void {
        this.performStepChange(this.stepperView.getCurrentStep().index + 1, cb);
    }

    public stepTo(stepIndex: number, cb?: (step: Step) => void): void {
        const ok = this.performStepChange(stepIndex, cb);

        if (!ok) {
            console.warn(`[Stepper.js]: transiion failed to step: ${stepIndex}. Looks like your step index is not within possible range.`);
        }
    }

    // #endregion


    private setup(container: HTMLElement, opts: Options): void {
        this.stepperView = new StepperView(container.children);

        if (opts.progress)  {
            this.stepperView.enableProgress(
                new ProgressView(this.stepperView.getStepsCount(), opts.progressContainer)
            );
        }
    }

    private getInitialStep(): Step {
        /**
         * get from cache
         * get from param
         */

        /**
         * Steps HTMLElement[] items index is zero-based.
         */
        return this.stepperView.getStep(this.options.startStep);
    }

    private handleStepChangeCall(prev: Step, next: Step): void {
        this.stepperView.setStepActive(next);
    }

    private onStepChangeCall(cb: () => any): void {
        this.eventListenters.change.push(cb);
    }

    private performStepChange(nextIndex: number, cb?: (step: Step) => void): boolean {
        nextIndex = Number.parseInt(nextIndex as any);

        let prev = this.stepperView.getCurrentStep();
        let next = this.stepperView.getStep(nextIndex)

        if (this.frozen) {
            console.warn('[Stepper.js] is frozen');

            return;
        }

        const ok = this.isStepChangeValid(prev, next);
        
        if (!ok) return;

        this.eventListenters.change.forEach(cb => setTimeout(() => cb(prev, next), 0));

        if (cb && typeof cb === 'function') cb(next);

        return ok;
    }

    /**
     * Custom validator supplied by user
     */
    private isStepChangeValid(prev: Step, next: Step): boolean {
        if (!this.options.validateStepChange || 
            typeof this.options.validateStepChange !== 'function') return true;

        return this.options.validateStepChange(prev, next);
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