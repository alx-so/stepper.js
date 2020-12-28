export default class StepperViewBase {
    private steps: HTMLCollection;
    private prevStep: Element;
    private currentStep: Element;
    private currentStepIndex: number;

    constructor(steps: HTMLCollection) {
        this.steps = steps;
    }

    public getStepsCount(): number {
        return this.steps.length;
    }

    public getCurrentStepIndex(): number {
        return this.currentStepIndex;
    }

    public getSteps(): HTMLCollection {
        return this.steps;
    }

    protected setStep(index: number) {
        if (!this.isStepValid(index)) return [];

        this.prevStep = this.currentStep;
        this.currentStep = this.steps[this.currentStepIndex = index];

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