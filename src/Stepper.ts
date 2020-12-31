export interface Step {
    index: number;
    elem: Element;
}

export default class Stepper {
    private steps: HTMLCollection;
    private prevStep: Step;
    private currentStep: Step;

    constructor(steps: HTMLCollection) {
        this.steps = steps;
    }

    public getStepsCount(): number {
        return this.steps.length;
    }

    public getStepsHtml(): HTMLCollection {
        return this.steps;
    }

    public getCurrentStep(): Step {
        return this.currentStep;
    }

    public getStep(index: number): Step {
        if (!this.isStepIndexValid(index)) return;

        let elem = this.steps[index];

        if (!elem) return;

        return {
            index,
            elem
        }
    }

    protected setStep(index: number): Step[] {
        if (!this.isStepIndexValid(index) || !this.isStepInRange(index)) return [this.currentStep, null];
        
        this.prevStep = this.currentStep;

        this.currentStep = {
            index,
            elem: this.steps[index]
        };

        return [this.prevStep, this.currentStep];
    }

    private isStepIndexValid(index: number): boolean {
        /**
         * Make sure value is always a number
         */
        const ok = typeof index === 'number' && isFinite(index);

        if (!ok) {
            console.warn(`[Stepper.js] supplied step value is not a number`);
        }

        return ok;
    }

    private isStepInRange(index: number): boolean {
        /**
         * Make sure step is in steps range
         */
        const ok = index >= 0 && index <= this.getStepsCount() - 1;

        if (!ok) {
            console.warn(`[Stepper.js] cannot perform step change to index: ${index}`);
        }

        return ok; 
    }
}