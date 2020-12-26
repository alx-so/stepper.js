import StepperClassNames from "../StepperClassNames";
import { tag } from "../utils";

export default class StepperView {
    private stepElems: Element[] = [];
    private container: HTMLElement;

    constructor(steps: HTMLCollection, isProgress?: boolean) {
        this.container = this.setup(steps, isProgress);
    }

    public setStep(prevStep: number, nextStep: number) {
        if (prevStep) {
            this.stepElems[prevStep - 1].classList.remove(StepperClassNames.itemActive);
        }

        if (nextStep) {
            this.stepElems[nextStep - 1].classList.add(StepperClassNames.itemActive);
        }
    }

    public getHTML(): HTMLElement {
        return this.container;
    }
    
    private setup(steps: HTMLCollection, isProgress: boolean) {
        if (!isProgress) return this.stepper(steps);

        return this.progress(steps)
    }

    private stepper(steps: HTMLCollection): HTMLElement {
        const c = tag('div', { attr: { class: StepperClassNames.inner } });

        Array.prototype.forEach.call(steps, (el: HTMLElement) => {
            c.appendChild(el.cloneNode(true));

            const s = c.children[c.childElementCount - 1];

            this.stepElems.push(s);

            s.classList.add(StepperClassNames.item);
        });

        return c;
    }

    private progress(steps: HTMLCollection): HTMLElement {
        const c = tag('div', { attr: { class: StepperClassNames.progress } });

        Array.prototype.forEach.call(steps, (el: HTMLElement, i: number) => {
            var el = tag('div', { attr: { class: StepperClassNames.progressItem } });
            el.textContent = (i + 1).toString();

            this.stepElems.push(el);
            c.appendChild(el);
        });

        return c;
    }
}