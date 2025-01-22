export type ObserverCallback<T, E> = (data: T, event: E) => void;

export class EntityObserver<T, E> {
    private observers: Map<string, Map<E, Set<ObserverCallback<T, E>>>> = new Map();

    subscribe(entity: string, event: E, callback: ObserverCallback<T, E>): () => void {
        if (!this.observers.has(entity)) {
            this.observers.set(entity, new Map());
        }
        const entityObservers = this.observers.get(entity)!;

        if (!entityObservers.has(event)) {
            entityObservers.set(event, new Set());
        }
        const eventObservers = entityObservers.get(event)!;

        eventObservers.add(callback);
        return () => this.unsubscribe(entity, event, callback);
    }

    unsubscribe(entity: string, event: E, callback: ObserverCallback<T, E>): void {
        this.observers.get(entity)?.get(event)?.delete(callback);
    }

    notify(entity: string, event: E, data: T): void {
        this.observers.get(entity)?.get(event)?.forEach(callback => callback(data, event));
    }
}
