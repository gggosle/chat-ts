export class EventEmitter<T extends Record<keyof T, unknown>> {
    private listeners: { [K in keyof T]?: Array<(data: T[K]) => void> } = {};

    on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(handler);
    }

    off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void {
        const handlers = this.listeners[event];
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    emit<K extends keyof T>(event: K, data: T[K]): void {
        const handlers = this.listeners[event];
        if (handlers) {
            [...handlers].forEach(handler => handler(data));
        }
    }
}