export type RecordID = string;

export interface BaseTable {
    parent_ulid: string;
    ulid: RecordID;
    data: string;
    timestamp: number;
    last_synced_at: number | null;
    is_dirty: number;
    is_deleted: number;
}

export interface BaseRecord {
    ulid: string;
    createdAt: number;
    updatedAt: number;
}

export interface BaseEndpoint<T> {
    list(): Promise<{ data: { list: T[] } }>;
    fetch(id: string): Promise<{ data: { entry: T } }>;
    sync(data: { entries: any[]; removed: string[] }): Promise<{
        data: {
            entries: T[];
            removed: string[];
        };
    }>;
}

export interface CreateParams<T> {
    data: T;
    isDirty?: boolean;
    parentUlid?: string;
}

export interface UpdateParams<T> {
    ulid: string;
    data: T;
    isDirty?: boolean;
}

export type DataWithSyncStatus<T extends object> = T & {
    isDirty: boolean;
    isCreatedOnServer: boolean;
};

export type ObserverData = {
    ulids: string[];
};

export type Event =
    | 'all'
    | 'createLocal'
    | 'updateLocal'
    | 'deleteLocal'
    | 'synced'
    | 'deletedSynced';
