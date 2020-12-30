import { Options, DefOptions } from './options';
import { Step } from './Stepper';
import StepperView, { Opts as StepperViewOpts } from './StepperView';

interface State {
    isFrozen: boolean,
    step: Step
}

export default class Stepper {
    private eventListenters = { 'change': [] };
    private stepperView: StepperView;
    private options: Options;
    private state: State;

    constructor(container: HTMLElement, opts: Options) {
        this.options = { ...DefOptions, ...opts };
        this.state = this.getInitialState();
        this.stepperView = new StepperView(container, this.composeStepperViewOpts(this.options));

        this.onStateChange(this.handleStateChange.bind(this));
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
        const step = this.stepperView.getStep(0);
        this.setState({...this.state, isFrozen: false, step });
    }

    public isFrozen(): boolean {
        return this.state.isFrozen;
    }

    public freeze(isFrozen: boolean): void {
        this.setState({...this.state, isFrozen });
    }

    public getCurrentStep(): Step {
        return this.state.step;
    }

    public prev(): void {
        this.performStepChange(this.stepperView.getCurrentStep().index - 1);

    }

    public next(): void {
        this.performStepChange(this.stepperView.getCurrentStep().index + 1);
    }

    public stepTo(index: number): void {
        this.performStepChange(index);
    }

    // #endregion

    private composeStepperViewOpts(opts: Options): StepperViewOpts {
        return {
            index: opts.startStep,
            progress: opts.progress,
            progressClickHandler: (n: number) => { this.performStepChange(n) }
        }
    }

    private handleStateChange(prev: State, next: State): void {
        this.stepperView.setStepActive(next.step.index);
    }

    private onStateChange(cb: () => any): void {
        this.eventListenters.change.push(cb);
    }

    private performStepChange(nextIndex: number): boolean {
        nextIndex = Number.parseInt(nextIndex as any);
        const prev = this.stepperView.getCurrentStep();
        const next = this.stepperView.getStep(nextIndex);

        if (!next) return;

        const ok = this.canPerformStepChange(prev, next);
        if (!ok) return;

        this.setState({...this.state, step: next });

        return ok;
    }

    /**
     * Custom validator
     */
    private canPerformStepChange(prev: Step, next: Step): boolean {
        if (this.state.isFrozen) {
            console.warn('[Stepper.js] is frozen');
            return;
        }

        if (!this.options.validateStepChange || 
            typeof this.options.validateStepChange !== 'function') return true;

        const ok = this.options.validateStepChange(prev, next);

        if (!ok) {
            console.warn('[Stepper.js]: step change did not pass validation. Check your validateStepChange()');
        }

        return ok;
    }

    private getInitialState(): State {
        // or get from localeStorage if options.cache: true
        return {
            isFrozen: false,
            step: null
        }
    }

    private setState(state: State): void {
        const prevState = this.state;

        this.eventListenters.change.forEach(cb => setTimeout(() => cb(prevState, state), 0));

        this.state = state;
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