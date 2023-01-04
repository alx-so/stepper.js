import { Options, DefOptions } from './options';
import EventName from './events';

import { Step } from './StepperBase';
import StepperView, { Opts as StepperViewOpts } from './StepperView';
import dispatchEvent from './utils/dispatch-event';

interface State {
    isFrozen: boolean,
    step?: Step
}

interface StepChangeCallback {
    (prev: State, next: State): void
}

interface EventListeners {
    change: StepChangeCallback[]
}

export default class Stepper {
    private cacheId: string = 'stepper_data';
    private eventListenters: EventListeners  = { 'change': [] };

    // assigned in setup()
    private stepperView!: StepperView;
    private options!: Options;
    private state!: State;

    constructor(container: HTMLElement, opts: Options) {
        this.setup(container, opts);
    }

    // #region Public API

    public prev(): void {
        this.performStepChange(this.stepperView.getCurrentStep().index - 1);
    }

    public next(): void {
        this.performStepChange(this.stepperView.getCurrentStep().index + 1);
    }

    public stepTo(index: number): void {
        this.performStepChange(index);
    }

    public getCurrentStep(): Step | undefined {
        return this.state.step;
    }

    public freeze(isFrozen: boolean): void {
        this.setState({ ...this.state, isFrozen });
    }

    public isFrozen(): boolean {
        return this.state.isFrozen;
    }

    public setup(container: HTMLElement, opts: Options): void {
        dispatchEvent(container, EventName.beforeSetup);

        this.options = { ...DefOptions, ...opts, 
            className: { ...DefOptions.className, ...opts.className }
        };
        this.state = this.getInitialState();
        this.stepperView = new StepperView(container,
            this.composeStepperViewOpts(container.children.length, this.options, this.state));

        this.state.step = this.stepperView.getCurrentStep();
        
        this.cacheId = opts.cacheId || 'stepper_data';

        this.onStateChange(this.handleStateChange.bind(this));

        this.dispatchStepperEvent(EventName.afterSetup);
    }

    public destroy(): void {
        this.dispatchStepperEvent(EventName.beforeDestroy);

        for (let key in this) {
            /** Don't delete external opts object */
            if (key === 'options') continue;
            delete this[key];
        }

        /** Clean prototype chain */
        let p = Object.getPrototypeOf(this);
        while (p) {
            for (let key in p) {
                delete p[key];
            }

            p = Object.getPrototypeOf(p);
        }

        this.dispatchStepperEvent(EventName.afterDestroy);
    }

    public reset(): void {
        this.dispatchStepperEvent(EventName.beforeReset);
        this.performStepChange(0, false);
        this.dispatchStepperEvent(EventName.afterReset);
    }

    // #endregion

    private handleStateChange(prev: State, next: State): void {
        if (next.step) this.stepperView.setStepActive(next.step.index);

        this.dispatchStepperEvent(EventName.afterChange, {
            currentStep: next.step
        });
    }

    private onStateChange(cb: (prev: State, next: State) => any): void {
        this.eventListenters.change.push(cb);
    }

    private performStepChange(nextIndex: number, shouldValidate: boolean = true): boolean {
        nextIndex = parseInt(nextIndex as any);
        const prev = this.stepperView.getCurrentStep();
        const next = this.stepperView.getStep(nextIndex);

        if (!next) return false;

        this.dispatchStepperEvent(EventName.beforeChange, {
            currentStep: prev,
            nextStep: next
        });

        let ok = true;
        if (shouldValidate) {
            ok = this.canPerformStepChange(prev, next);
        }

        if (!ok) return false;

        this.setState({ ...this.state, step: next });

        return ok;
    }

    private canPerformStepChange(prev: Step, next: Step): boolean {
        if (this.state.isFrozen) {
            console.warn('[Stepper.js] is frozen');

            return false;
        }

        if (!this.options.validateStepChange ||
            typeof this.options.validateStepChange !== 'function') return true;

        const ok = this.options.validateStepChange(prev, next);

        if (!ok) {
            console.warn('[Stepper.js]: step change did not pass validateStepChange()');
        }

        return ok;
    }

    private getInitialState(): State {
        if (this.options.cache && localStorage) {
            try {
                const s = localStorage.getItem(this.cacheId);

                if (s) {
                    const state = JSON.parse(s) as State;
                    if (state && this.isStateValid(state)) return state;
                }
            } catch (e) {
                console.warn('[Stepper.js] failed to parse cached state. Using default');
            }
        }

        return {
            isFrozen: false
        }
    }

    private composeStepperViewOpts(stepsCount: number, opts: Options, state: State): StepperViewOpts {
        const index = getInitialIndex();
        const progress = (() => {
            if (typeof opts.progress === 'object' && opts.progress.navEnabled) {
                return {
                    ...opts.progress,
                    clickHandler: (n: number) => { this.performStepChange(n) }
                }
            }

            return opts.progress;
        })();

        return {
            index,
            className: opts.className,
            progress
        }

        /**
         * Get index by priority: 1 is highest
         * 
         * 1. UrlParam
         * 2. Cache
         * 3. opts
         */
        function getInitialIndex(): number {
            let index = state.step ? state.step.index : opts.startIndex;

            if (opts.urlParam) {
                const k = typeof opts.urlParam === 'string' ? opts.urlParam : 'step';
                const v = (() => {
                    let pList = window.location.search.split('&');
                    let sParam = pList.filter(v => v.indexOf(`${k}=`) !== -1);

                    if (sParam.length === 1) {
                        let sVal = parseInt(sParam[0].split('=')[1]);

                        if (typeof sVal === 'number' && sVal >= 0) return sVal;
                    }
                })();

                if (typeof v !== 'number') {
                    console.warn(`[Stepper.js] supplied urlParam is not valid`);
                } else if (v > stepsCount - 1 || v < 0) {
                    console.warn(`[Stepper.js] supplied urlParam '${k}=' is not in range.`);
                } else {
                    index = v;
                }
            }

            return index;
        }
    }

    private setState(state: State): void {
        const prevState = this.state;

        this.eventListenters.change.forEach(cb => setTimeout(() => cb(prevState, state), 0));

        this.state = state;

        if (this.options.cache) {
            this.saveState(this.state);
        }
    }

    private saveState(s: State): void {
        if (!localStorage) return;

        /** Dont save html elem */
        const replacer = (k: string, v: any) => {
            if (k === 'elem') {
                return;
            }

            return v;
        };

        setTimeout(() => localStorage.setItem(this.cacheId, JSON.stringify(s, replacer)), 0);
    }

    private isStateValid(s: State): boolean {
        return typeof s.step === 'object' && isFinite(s.step.index);
    }

    private dispatchStepperEvent(event: EventName, detail?: any): void {
        dispatchEvent(this.stepperView.getHTML(), event, detail);
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
