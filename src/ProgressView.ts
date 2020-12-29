import StepperClassNames from "./StepperClassNames";
import { tag } from "./utils";

export default class ProgressView {
    private container: HTMLElement;
    private progressItems: HTMLElement[];

    constructor(stepsCount: number, container?: HTMLElement) {
        this.container = this.setupContainer(container);
        this.progressItems = this.setupItems(stepsCount, this.container);
    }

    public getHTML(): HTMLElement {
        return this.container;
    }

    public setActive(index: number): void {
        if (!this.progressItems[index]) return;

        /**
         * Assume that 'all' prev items is active and dont loop over all items. 
         * Begin from target index.
         */
        let i = (index <= 0 || !this.isPrevItemActive(index)) ? 0 : index;

        while(i <= this.progressItems.length - 1) {
            let item = this.progressItems[i];

            if (i <= index) item.classList.add('is-active');
            if (i > index) item.classList.remove('is-active');

            i++;
        }
    }

    private isPrevItemActive(index: number) {
        let prev = index - 1;
        return prev < 0 ? false : this.progressItems[prev].classList.contains('is-active');
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