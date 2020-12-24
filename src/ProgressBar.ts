export default class ProgressBar {
    public container: HTMLElement;

    constructor(container: HTMLElement, stepsCount: number) {
        this.container = container;

        this.container.innerHTML = stepsCount.toString();
    }

    public setStep(step: number) {
        console.log('Set progress step: ' + step);
    }
    
    public render() {

    }
}