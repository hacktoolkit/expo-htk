export type ObserverCallback<Data extends Record<string, any>, Event extends string> = (
    data: Data,
    event: Event
) => void;

type Observers<
    Data extends Record<string, any>,
    Event extends string,
    Callback extends ObserverCallback<Data, Event>,
> = Record<string, Callback[]> & { all?: Callback[] };

/**
 * Observer Pattern
 *
 * @example
 * ```ts
 * const observer = new Observer();
 * observer.subscribe('event', (data) => console.log(data));
 * observer.notify('event', { message: 'Hello, World!' });
 * ```
 */
export class Observer<
    Data extends Record<string, any>,
    Event extends string = string,
    Callback extends ObserverCallback<Data, Event> = ObserverCallback<Data, Event>,
> {
    observers: Observers<Data, Event, Callback>;

    constructor(observers: Observers<Data, Event, Callback> = {}) {
        this.observers = observers;
    }

    subscribe(event: Event, observer: Callback) {
        if (this.observers[event] === undefined) {
            this.observers[event] = [];
        }

        this.observers[event].push(observer);

        return () => this.unsubscribe(event, observer);
    }

    unsubscribe(event: Event, observer: Callback) {
        if (!(event in this.observers)) {
            return;
        }

        this.observers[event] = this.observers[event].filter((x) => x !== observer);
    }

    notify(event: Event, data: Data) {
        if (this.observers[event]) {
            this.observers[event].forEach((x) => x(data, event));
        }

        if (this.observers.all) {
            this.observers.all.forEach((x) => x(data, event));
        }
    }
}
