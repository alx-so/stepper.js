import { ClassNameOpts } from "./options";
import { tag } from "./utils";

export interface Opts {
    clickHandler?: (n: number) => void;
    container?: Element;
}

export default class ProgressView {
    private currentIndex?: number;
    private className: ClassNameOpts;
    private opts: Opts;
    private container: Element;
    private progressItems: Element[];

    constructor(stepsCount: number, className: ClassNameOpts, opts?: Opts) {
        this.className = className;
        this.opts = opts ?? {};
        this.container = this.setupContainer(this.opts.container);
        this.progressItems = this.setupItems(stepsCount, this.container);
    }

    public getHTML(): Element {
        return this.container;
    }

    public setActive(index: number): void {
        if (!this.progressItems[index]) return;

        let canSkipLoopAll = this.currentIndex !== undefined && 
            (this.currentIndex - 1 === index || this.currentIndex + 1 === index);

        /**
         * Assume that 'all' prev items is active and dont loop over all items. 
         * Begin from target index.
         */
        let i = index <= 0 || !canSkipLoopAll && !this.isPrevItemActive(index) ? 0 : index;
        while (i <= this.progressItems.length - 1) {
            let item = this.progressItems[i];

            if (i <= index) item.classList.add(this.className.progressActive);
            if (i > index) item.classList.remove(this.className.progressActive);

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
        return prev >= 0 && 
            this.progressItems[prev].classList.contains(this.className.progressActive);
    }

    private isNextItemActive(index: number) {
        let next = index + 1;
        return next <= this.progressItems.length - 1 && 
            this.progressItems[next].classList.contains(this.className.progressActive);
    }

    private setupContainer(container?: Element) {
        if (container) {
            container.classList.add(this.className.progressContainer);

            return container;
        }

        return tag('div', { attr: { class: this.className.progressContainer } });
    }

    private setupItems(stepsCount: number, container: Element): Element[] {
        const self = this;
        const containerChildCount = container.children.length;
        const containerHasChildren = !!containerChildCount;

        return containerHasChildren ? tryUseExistingElems() : insertSimpleNumProgress();

        function insertSimpleNumProgress(): Element[] {
            return Array.prototype.map.call([...Array(stepsCount)], (v, i) => {
                let el = addItemInfo(tag('div', {
                    attr: { 
                        class: self.className.progressItem 
                    } 
                }), i);

                el.textContent = (i + 1).toString();

                container.appendChild(el);

                return el;
            }) as Element[];
        }

        function tryUseExistingElems(): Element[] {
            if (containerChildCount !== stepsCount) {
                throw new Error('Progress container children count must be same as steps or 0!');
            }

            return Array.prototype.map.call(container.children, addItemInfo) as Element[];
        }

        function addItemInfo(el: Element, index: number): Element {
            if (self.opts.clickHandler) {
                let h = self.opts.clickHandler;
                el.addEventListener('click', ev => h(index));
            }

            el.classList.add(self.className.progressItem);

            return el;
        }
    }
}