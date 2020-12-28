import { Options, DefOptions } from './options';
import StepperView from './StepperView';
import ProgressView from './ProgressView';

export default class Stepper {
    private eventListenters = { 'change': [] };
    private stepperView: StepperView;
    private options: Options;
    private frozen: boolean;

    constructor(container: HTMLElement, opts: Options) {
        this.options = { ...DefOptions, ...opts };
        this.setup(container, this.options);
        this.onStepChangeCall(this.handleStepChangeCall.bind(this));
        this.performStepChange(this.getInitialStep());
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

    public getCurrentStep(): number {
        return this.stepperView.getCurrentStepIndex();
    }

    public prev(cb?: (step: number) => void): void {
        this.performStepChange(this.stepperView.getCurrentStepIndex() - 1, cb);
    }

    public next(cb?: (step: number) => void): void {
        this.performStepChange(this.stepperView.getCurrentStepIndex() + 1, cb);
    }

    public stepTo(step: number, cb?: (step: number) => void): void {
        const ok = this.performStepChange(step, cb);

        if (!ok) {
            console.warn(`[Stepper.js]: transiion failed to step: ${step}. Looks like your step number is not within possible range.`);
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

    private getInitialStep(): number {
        /**
         * 0
         * get from cache
         * get from param
         */

        return this.options.startStep;
    }

    private handleStepChangeCall(prev: number, next: number): void {
        this.stepperView.setStepActive(next);
    }

    private onStepChangeCall(cb: () => any): void {
        this.eventListenters.change.push(cb);
    }

    private performStepChange(next: number, cb?: (step: number) => void): boolean {
        let prev = this.stepperView.getCurrentStepIndex();
        next = Number.parseInt(next as any);

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
    private isStepChangeValid(prev: number, next: number): boolean {
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