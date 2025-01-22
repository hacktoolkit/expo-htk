import { Kysely, sql } from 'kysely';
import { ExpoDialect } from 'kysely-expo';
import { BaseTable } from './types';

export function createDatabase<T extends Record<string, BaseTable>>(config: {
    name: string;
    debug?: boolean;
    onError?: (error: any) => void;
}) {
    const dialect = new ExpoDialect({
        database: config.name,
        debug: config.debug ?? false,
        onError: config.onError,
    });

    return new Kysely<T>({
        dialect,
    });
}

export async function initializeTable(
    db: Kysely<any>,
    tableName: string
) {
    await db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn('parent_ulid', 'text')
        .addColumn('ulid', 'text', (col) => col.primaryKey())
        .addColumn('data', 'text')
        .addColumn('timestamp', 'integer', (col) =>
            col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
        )
        .addColumn('last_synced_at', 'integer')
        .addColumn('is_dirty', 'integer', (col) => col.notNull())
        .addColumn('is_deleted', 'integer', (col) => col.defaultTo(false).notNull())
        .execute();

    await db.schema
        .createIndex(`${tableName}_timestamp`)
        .ifNotExists()
        .on(tableName)
        .column('timestamp')
        .execute();

    await db.schema
        .createIndex(`${tableName}_parent_ulid`)
        .ifNotExists()
        .on(tableName)
        .column('parent_ulid')
        .execute();
}
