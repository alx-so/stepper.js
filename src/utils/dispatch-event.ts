(function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event: string, params: any) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    window.CustomEvent = CustomEvent as any;
})();

export default function dispatchEvent(target: Element, type: string, detail?: any) {
    let event = new CustomEvent(
        type,
        {
            bubbles: true,
            cancelable: true,
            detail: detail
        }
    );

    target.dispatchEvent(event);
}