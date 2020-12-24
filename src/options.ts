export interface Options {
    window: Window | null;
    progress?: boolean;
    progressContainer?: HTMLElement;
}

export const DefOptions: Options = {
    window: typeof window !== 'undefined' ? window : null
}