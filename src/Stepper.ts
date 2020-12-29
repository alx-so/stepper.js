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

    public getStep(index: number): Step | null {
        if (!this.isStepValid(index)) return null

        let elem = this.steps[index];

        return {
            index,
            elem
        }
    }

    protected setStep(index: number) {
        if (!this.isStepValid(index)) return [];

        this.prevStep = this.currentStep;
        
        this.currentStep = {
            index,
            elem: this.steps[index]
        };

        return [this.prevStep, this.currentStep];
    }

    private isStepValid(index: number): boolean {
        /**
         * Make sure value is always a number
         */
        if (typeof index !== 'number' || !Number.isFinite(index)) {
            console.warn(`[Stepper.js] supplied step value is not a number`);

            return;
        }

        /**
         * Make sure step is in steps range
         */
        return index >= 0 && index <= this.getStepsCount() - 1;
    }
}