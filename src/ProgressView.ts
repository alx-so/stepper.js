import StepperClassNames from "./StepperClassNames";
import { tag } from "./utils";

export default class ProgressView {
    private container: HTMLElement;
    private steps: HTMLElement[];

    constructor(stepsCount: number, container?: HTMLElement) {
        this.container = this.setupContainer(container);
        this.steps = this.setupItems(stepsCount, this.container);
    }

    public getHTML(): HTMLElement {
        return this.container;
    }

    public setActive(index: number): void {
        const el = this.steps[index];

        if (el) {
            el.classList.add('is-active');
        }
    }

    private setupContainer(container?: HTMLElement) {
        if (container) {
            container.classList.add(StepperClassNames.progress);

            return container;
        }

        return tag('div', { attr: { class: StepperClassNames.progress } });
    }

    private setupItems(stepsCount: number, container: HTMLElement): HTMLElement[] {
        const c: HTMLElement[] = [];

        while (c.length !== stepsCount) {
            var el = tag('div', { attr: { class: StepperClassNames.progressItem } });

            el.textContent = (c.length + 1).toString();

            c.push(el);

            container.appendChild(el);
        }

        return c;
    }
}