import { EntityObserver } from './utils/observer';
import { Kysely } from 'kysely';
import { BaseDatabase, BaseTable, ObserverData, Event } from './types';

export const TRUE = 1;
export const FALSE = 0;

export abstract class SQLiteDataProvider<TDatabase extends BaseDatabase = BaseDatabase> {
    protected static _instance: any;
    protected static _db: any;

    /**
     * Get the singleton instance of the provider
     */
    public static get shared(): SQLiteDataProvider {
        if (!this._instance) {
            this._instance = new (this as any)();
        }
        return this._instance;
    }

    /**
     * Get the database instance
     */
    public static get db(): Kysely<any> {
        if (!this._db) {
            throw new Error('Database not initialized');
        }
        return this._db;
    }

    /**
     * Initialize the database instance
     */
    public static initialize(db: Kysely<TDatabase>) {
        this._db = db;
    }

    /**
     * Reset the singleton instance and database connection
     */
    public static reset() {
        this._instance = undefined;
        this._db = undefined;
    }

    protected constructor() {
        // Protected constructor to enforce singleton pattern
        if (SQLiteDataProvider._instance) {
            throw new Error('Use shared to get the singleton instance');
        }
    }

    /**
     * Get the database instance for this provider
     */
    protected get db(): Kysely<TDatabase> {
        return (this.constructor as typeof SQLiteDataProvider).db;
    }
}

export class BaseSQLiteProvider {
    static entity: string;
    static observer: EntityObserver<ObserverData, Event> = new EntityObserver();
    static db: Kysely<any>;

    static dbSelect() {
        return this.db.selectFrom(this.entity).selectAll();
    }

    static dbDelete() {
        return this.db.deleteFrom(this.entity);
    }

    static dbInsert() {
        return this.db.insertInto(this.entity);
    }

    static dbUpdate() {
        return this.db.updateTable(this.entity);
    }

    static async selectOne(ulid: string) {
        return await this.dbSelect().where('ulid', '=', ulid).executeTakeFirst();
    }

    static async selectByParent(parentUlid: string) {
        return await this.dbSelect().where('parent_ulid', '=', parentUlid).execute();
    }

    static async selectByUlids(ulids: string[]) {
        return await this.dbSelect().where('ulid', 'in', ulids).execute();
    }

    static async selectAll() {
        return await this.dbSelect().execute();
    }

    static async countByParent(parentUlid: string) {
        return await this.db
            .selectFrom(this.entity)
            .select([(b) => b.fn.count('ulid').as('count')])
            .where('parent_ulid', '=', parentUlid)
            .executeTakeFirst();
    }

    static async selectDirty() {
        return await this.dbSelect()
            .where('is_dirty', '=', TRUE)
            .where('is_deleted', '=', FALSE)
            .where('last_synced_at', 'is not', null)
            .execute();
    }

    static async selectCreated() {
        return await this.dbSelect()
            .where('is_dirty', '=', TRUE)
            .where('is_deleted', '=', FALSE)
            .where('last_synced_at', 'is', null)
            .execute();
    }

    static async selectDeleted() {
        return await this.dbSelect().where('is_deleted', '=', TRUE).execute();
    }

    static async upsertSynced(ulid: string, data: any, parent_ulid: string = '') {
        const values = {
            parent_ulid,
            data: typeof data === 'string' ? data : JSON.stringify(data),
            timestamp: Date.now(),
            is_deleted: FALSE,
            is_dirty: FALSE,
            last_synced_at: Date.now(),
        };

        return await this.dbInsert()
            .values({ ulid, ...values })
            .onConflict((oc) => oc.column('ulid').doUpdateSet(values))
            .executeTakeFirst();
    }

    static async upsertDirty(ulid: string, data: any, parent_ulid: string = '') {
        const values = {
            parent_ulid,
            data: typeof data === 'string' ? data : JSON.stringify(data),
            timestamp: Date.now(),
            is_deleted: FALSE,
            is_dirty: TRUE,
            last_synced_at: Date.now(),
        };

        return await this.dbInsert()
            .values({ ulid, ...values })
            .onConflict((oc) => oc.column('ulid').doUpdateSet(values))
            .executeTakeFirst();
    }

    static async insertDirty(ulid: string, data: any, parent_ulid: string = '') {
        return await this.dbInsert()
            .values({
                ulid,
                parent_ulid,
                data: typeof data === 'string' ? data : JSON.stringify(data),
                timestamp: Date.now(),
                is_dirty: TRUE,
                last_synced_at: null,
                is_deleted: FALSE,
            })
            .executeTakeFirst();
    }

    static async insertDirtyMultiple(
        rows: { ulid: string; data: any; parentUlid?: string }[]
    ) {
        const values = rows.map(({ ulid, data, parentUlid: parent_ulid = '' }) => ({
            ulid,
            parent_ulid,
            data: typeof data === 'string' ? data : JSON.stringify(data),
            timestamp: Date.now(),
            is_dirty: TRUE,
            last_synced_at: null,
            is_deleted: FALSE,
        }));

        return await this.dbInsert().values(values).executeTakeFirst();
    }

    static async insertSynced(ulid: string, data: any, parent_ulid: string = '') {
        return await this.dbInsert()
            .values({
                ulid,
                parent_ulid,
                data: typeof data === 'string' ? data : JSON.stringify(data),
                timestamp: Date.now(),
                is_dirty: FALSE,
                last_synced_at: Date.now(),
                is_deleted: FALSE,
            })
            .executeTakeFirst();
    }

    static async insertSyncedMultiple(
        rows: { ulid: string; data: any; parentUlid?: string }[]
    ) {
        const values = rows.map(({ ulid, data, parentUlid: parent_ulid = '' }) => ({
            ulid,
            parent_ulid,
            data: typeof data === 'string' ? data : JSON.stringify(data),
            timestamp: Date.now(),
            is_dirty: FALSE,
            last_synced_at: Date.now(),
            is_deleted: FALSE,
        }));
        return await this.dbInsert().values(values).executeTakeFirst();
    }

    static async updateDirty(ulid: string, data: any) {
        return await this.dbUpdate()
            .set({
                data: typeof data === 'string' ? data : JSON.stringify(data),
                is_dirty: TRUE,
                timestamp: Date.now(),
            })
            .where('ulid', '=', ulid)
            .executeTakeFirst();
    }

    static async updateSynced(ulid: string, data?: any) {
        return await this.dbUpdate()
            .set({
                ...(data
                    ? { data: typeof data === 'string' ? data : JSON.stringify(data) }
                    : {}),
                is_dirty: FALSE,
                last_synced_at: Date.now(),
                timestamp: Date.now(),
            })
            .where('ulid', '=', ulid)
            .executeTakeFirst();
    }

    static async markDeleted(ulid: string) {
        return await this.dbUpdate()
            .set({
                is_dirty: TRUE,
                is_deleted: TRUE,
                timestamp: Date.now(),
            })
            .where('ulid', '=', ulid)
            .executeTakeFirst();
    }

    static async markDeletedByParent(parentUlid: string) {
        return await this.dbUpdate()
            .set({
                is_dirty: TRUE,
                is_deleted: TRUE,
                timestamp: Date.now(),
            })
            .where('parent_ulid', '=', parentUlid)
            .execute();
    }

    static async purgeDeleted() {
        return await this.dbDelete().where('is_deleted', '=', TRUE).execute();
    }

    static async purgeAll() {
        await this.dbDelete().execute();
    }

    static async purge(ulid: string) {
        return await this.dbDelete().where('ulid', '=', ulid).execute();
    }

    static async purgeByParent(parentUlid: string) {
        return await this.dbDelete().where('parent_ulid', '=', parentUlid).execute();
    }

    static async purgeUlids(ulids: string[]) {
        return await this.dbDelete().where('ulid', 'in', ulids).execute();
    }

    static subscribe(
        event: Event,
        observer: ObserverCallback<ObserverData, Event>
    ): () => void {
        return this.observer.subscribe(String(this.entity), event, observer);
    }

    static unsubscribe(
        event: Event,
        observer: ObserverCallback<ObserverData, Event>
    ): void {
        this.observer.unsubscribe(String(this.entity), event, observer);
    }

    protected static notify(event: Event, data: ObserverData) {
        this.observer.notify(String(this.entity), event, data);
    }
}
