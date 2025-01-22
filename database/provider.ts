import { Kysely } from 'kysely';
import { QueryClient } from '@tanstack/react-query';
import { BaseEndpoint, BaseRecord, BaseTable, CreateParams, DataWithSyncStatus, Event, ObserverData, UpdateParams } from './types';
import { EntityObserver } from '../utils/observer';
import { RecordID } from './types';

// Create a shared queryClient instance
export const queryClient = new QueryClient();

// Constants with proper type assertions
export const TRUE = 1 as const;
export const FALSE = 0 as const;

export class SQLiteDataProvider<T extends BaseRecord, DB extends Record<string, BaseTable>> {
    protected db: Kysely<DB>;
    public entity: keyof DB;
    protected endpoint: BaseEndpoint<T>;
    protected queryKey: string;
    static observer: EntityObserver<ObserverData, Event> = new EntityObserver();

    constructor(
        db: Kysely<DB>,
        entity: keyof DB,
        endpoint: BaseEndpoint<T>,
        queryKey: string
    ) {
        this.db = db;
        this.entity = entity;
        this.endpoint = endpoint;
        this.queryKey = queryKey;
    }

    async list(): Promise<DataWithSyncStatus<T>[]> {
        const records = await this.db
            .selectFrom(this.entity as string)
            .selectAll()
            .where('is_deleted', '=', FALSE)
            .orderBy('timestamp', 'desc')
            .execute() as unknown as BaseTable[];

        return records.map((record) => ({
            ...(JSON.parse(record.data) as T),
            isDirty: record.is_dirty === TRUE,
            isCreatedOnServer: record.last_synced_at !== null,
        }));
    }

    async listAll(): Promise<DataWithSyncStatus<T>[]> {
        const records = await this.db
            .selectFrom(this.entity as string)
            .selectAll()
            .orderBy('timestamp', 'desc')
            .execute() as unknown as BaseTable[];

        return records.map((record) => ({
            ...(JSON.parse(record.data) as T),
            isDirty: record.is_dirty === TRUE,
            isCreatedOnServer: record.last_synced_at !== null,
        }));
    }

    async getOne(ulid: RecordID): Promise<DataWithSyncStatus<T>> {
        const record = await this.db
            .selectFrom(this.entity as string)
            .selectAll()
            .where('ulid', '=', ulid as any)
            .where('is_deleted', '=', FALSE as any)
            .executeTakeFirst() as unknown as BaseTable;

        if (!record) {
            throw new Error(`Record with ulid ${ulid} not found in ${String(this.entity)}`);
        }

        return {
            ...(JSON.parse(record.data) as T),
            isDirty: record.is_dirty === TRUE,
            isCreatedOnServer: record.last_synced_at !== null,
        };
    }

    async create(params: CreateParams<T>): Promise<DataWithSyncStatus<T>> {
        const { data, isDirty = true, parentUlid = '' } = params;
        const now = Date.now();

        const result = await this.db
            .insertInto(this.entity as string)
            .values({
                ulid: data.ulid,
                data: JSON.stringify(data),
                parent_ulid: parentUlid,
                timestamp: now,
                is_dirty: isDirty ? TRUE : FALSE,
                is_deleted: FALSE,
                last_synced_at: isDirty ? null : now,
            } as any)
            .executeTakeFirst();

        if (!result || result.numInsertedOrUpdatedRows === 0n) {
            throw new Error(`Failed to insert record into ${String(this.entity)}`);
        }

        return {
            ...data,
            isDirty: true,
            isCreatedOnServer: false,
        };
    }

    async update(params: UpdateParams<T>): Promise<DataWithSyncStatus<T>> {
        const { ulid, data, isDirty = true } = params;
        const now = Date.now();
        const preparedData = {
            ...data,
            updatedAt: now,
        } as T;

        const result = await this.db
            .updateTable(this.entity as string)
            .set({
                data: JSON.stringify(preparedData),
                timestamp: now,
                is_dirty: isDirty ? TRUE : FALSE,
            } as any)
            .where('ulid', '=', ulid as any)
            .executeTakeFirst();

        if (!result || result.numUpdatedRows === 0n) {
            throw new Error(`Failed to update record in ${String(this.entity)}`);
        }

        return {
            ...preparedData,
            isDirty: true,
            isCreatedOnServer: false,
        };
    }

    async upsert(
        data: T,
        dirty: boolean = true,
        updateIfDirty: boolean = true
    ): Promise<DataWithSyncStatus<T>> {
        const baseValues = {
            parent_ulid: '',
            data: JSON.stringify(data),
            timestamp: Date.now(),
            is_deleted: FALSE,
            is_dirty: dirty ? TRUE : FALSE,
        };

        const createValues = {
            ...baseValues,
            ulid: data.ulid,
            last_synced_at: dirty ? null : Date.now(),
        };

        const updateValues = {
            ...baseValues,
            ...(!dirty ? { last_synced_at: Date.now() } : {}),
        };

        await this.db
            .insertInto(this.entity as string)
            .values(createValues as any)
            .onConflict((oc) => {
                const set = oc.column('ulid').doUpdateSet(updateValues as any);
                if (!dirty && !updateIfDirty) {
                    return set.where('is_dirty' as any, '=', FALSE);
                }
                return set;
            })
            .executeTakeFirstOrThrow();

        return {
            ...data,
            isDirty: dirty,
            isCreatedOnServer: false,
        };
    }

    async delete(ulid: RecordID): Promise<RecordID> {
        const result = await this.db
            .updateTable(this.entity as string)
            .set({
                is_deleted: TRUE,
            } as any)
            .where('ulid', '=', ulid as any)
            .executeTakeFirst();

        if (!result || result.numUpdatedRows === 0n) {
            throw new Error(`Failed to delete record in ${String(this.entity)}`);
        }

        return ulid;
    }

    async purge(ulid: RecordID) {
        await this.db
            .deleteFrom(this.entity as string)
            .where('ulid', '=', ulid as any )
            .execute();
    }

    async purgeByUlids(ulids: RecordID[]) {
        await this.db
            .deleteFrom(this.entity as string)
            .where('ulid', 'in', ulids as any)
            .execute();
    }

    async purgeOtherThanUlids(ulids: RecordID[]) {
        await this.db
            .deleteFrom(this.entity as string)
            .where('ulid', 'not in', ulids as any)
            .execute();
    }

    async purgeAll() {
        await this.db.deleteFrom(this.entity as string).execute();
    }

    protected async listDirty(): Promise<T[]> {
        const records = await this.db
            .selectFrom(this.entity as string)
            .selectAll()
            .where('is_dirty', '=', TRUE as any)
            .execute() as unknown as BaseTable[];

        return records.map((record) => JSON.parse(record.data) as T);
    }

    protected async listDeleted(): Promise<T[]> {
        const records = await this.db
            .selectFrom(this.entity as string)
            .selectAll()
            .where('is_deleted', '=', TRUE as any)
            .execute() as unknown as BaseTable[];

        return records.map((record) => JSON.parse(record.data) as T);
    }

    async sync(all: boolean = false): Promise<boolean> {
        const count = (await this.list()).length;
        let isSynced = false;

        const isDirtySynced = await this.syncDirty(true);

        if (count === 0 || all) {
            await this._fetchAll();
            isSynced = true;
        }

        isSynced = isSynced || isDirtySynced;
        return isSynced;
    }

    async syncDirty(invalidateCache: boolean = false) {
        const dirtyEntries = await this.listDirty();
        const deletedEntries = await this.listDeleted();

        if (dirtyEntries.length === 0 && deletedEntries.length === 0) {
            return false;
        }

        const response = await this.endpoint.sync({
            entries: dirtyEntries.map((x) => this.prepareDataForSync(x)),
            removed: deletedEntries.map((x) => x.ulid),
        });

        await this.purgeByUlids(response.data.removed);

        for (const entry of response.data.entries) {
            await this.upsert(entry, false);
        }

        if (invalidateCache) {
            this.invalidateCache(response.data.entries);
        }

        return true;
    }

    invalidateCache(entries: T[]) {
        queryClient.invalidateQueries({ queryKey: [this.queryKey] });

        for (const entry of entries) {
            queryClient.invalidateQueries({ queryKey: [this.queryKey, entry.ulid] });
        }
    }

    protected async _fetchAll() {
        const response = await this.endpoint.list();
        for (const entry of response.data.list) {
            await this.upsert(entry, false, false);
        }

        await this.purgeOtherThanUlids(response.data.list.map((x) => x.ulid));
    }

    prepareDataForSync(data: T) {
        return data;
    }
}
