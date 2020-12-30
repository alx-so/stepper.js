import StepperClassNames from "./StepperClassNames";
import { tag } from "./utils";

export interface Opts {
    container?: HTMLElement,
    navEnabled?: boolean
}

export default class ProgressView {
    public onClick?: (n: number) => void;

    private currentIndex: number;
    private opts: Opts;
    private container: HTMLElement;
    private progressItems: HTMLElement[];

    constructor(stepsCount: number, opts: boolean | Opts) {
        this.opts = typeof opts === 'object' ? opts : {};

        this.container = this.setupContainer(this.opts.container);
        this.progressItems = this.setupItems(stepsCount, this.container);
    }

    public getHTML(): HTMLElement {
        return this.container;
    }

    public setActive(index: number): void {
        if (!this.progressItems[index]) return;

        let canSkipLoopAll = (this.currentIndex - 1 === index) || (this.currentIndex + 1 === index);

        /**
         * Assume that 'all' prev items is active and dont loop over all items. 
         * Begin from target index.
         */
        let i = index <= 0 || !canSkipLoopAll && !this.isPrevItemActive(index) ? 0 : index;
        while (i <= this.progressItems.length - 1) {
            let item = this.progressItems[i];

            if (i <= index) item.classList.add('is-active');
            if (i > index) item.classList.remove('is-active');

            /**
             * Assume that 'all' next items is not active so not necessary to loop over them.
             */
            if (canSkipLoopAll && !this.isNextItemActive(i)) break;

            i++;
        }

        this.currentIndex = index;
    }

    public getOpts(): Opts {
        return this.opts;
    }

    private isPrevItemActive(index: number) {
        let prev = index - 1;
        return prev >= 0 && this.progressItems[prev].classList.contains('is-active');
    }

    private isNextItemActive(index: number) {
        let next = index + 1;
        return next <= this.progressItems.length - 1 && this.progressItems[next].classList.contains('is-active');
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
            let el = tag('div', { attr: { class: StepperClassNames.progressItem } });
            let num = c.length + 1;

            el.textContent = num.toString();

            if (this.opts.navEnabled) {
                el.addEventListener('click', ev => {
                    if (this.onClick) this.onClick(num - 1);
                });
            }

            c.push(el);

            container.appendChild(el);
        }

        return c;
    }
}