export interface TagOptions {
    children?: HTMLElement[];
    attr?: { [key: string]: any };
}

export default function tag(tagName: string | HTMLElement, options: TagOptions = {}): HTMLElement {
    const isElement: boolean = tagName instanceof Element;

    if (!isElement && typeof tagName !== 'string')
        throw new Error(`${tagName} is invalid value of tag`);

    const el = (
        isElement ? tagName : document.createElement(tagName as string)
    ) as HTMLElement;

    if (options['children'] && Array.isArray(options['children'])) {
        const l = options.children.reverse();

        while (l.length) {
            let a = l.pop();

            if (!(a instanceof Element)) continue;

            el.appendChild(a);
        }
    }

    if (options['attr'] && typeof options['attr'] === 'object') {
        for (let k in options['attr']) {
            el.setAttribute(k, options['attr'][k]);
        }
    }

    return el;
}