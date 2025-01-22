import { Kysely, sql } from 'kysely';
import { ExpoDialect } from 'kysely-expo';

export const LOCAL_STORAGE_DB_NAME = 'app-database';

export interface Table {
    parent_ulid: string;
    ulid: string;
    data: string;
    timestamp: number;
    last_synced_at: number | null;
    is_dirty: number;
    is_deleted: number;
}

export interface Database {
    exercises: Table;
    activities: Table;
    activity_exercises: Table;
    activity_segments: Table;
    programmed_workouts: Table;
    user_feed: Table;
    workout_routines: Table;
    training_programs: Table;
}

const tables: Array<keyof Database> = [
    'exercises',
    'activities',
    'activity_exercises',
    'activity_segments',
    'programmed_workouts',
    'user_feed',
    'workout_routines',
    'training_programs',
];

const dialect = new ExpoDialect({
    database: LOCAL_STORAGE_DB_NAME,
    // debug: __DEV__,
    debug: false,
    onError: (error) => {
        console.log(`SQLite Error: ${error}`);
    },
});

const db = new Kysely<Database>({
    dialect,
});

tables.forEach(async (table) => {
    await db.schema
        .createTable(table)
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
        .createIndex(`${table}_timestamp`)
        .ifNotExists()
        .on(table)
        .column('timestamp')
        .execute();
    await db.schema
        .createIndex(`${table}_parent_ulid`)
        .ifNotExists()
        .on(table)
        .column('parent_ulid')
        .execute();

    try {
        await db.schema.alterTable(table).addColumn('parent_ulid', 'text').execute();
    } catch (error) {
        // Silent the error. The column already exists.
    }
});

export interface UserTable {
    id: string;
    email: string;
    name: string;
    created_at: number;
    updated_at: number;
}

export interface PostTable {
    id: string;
    user_id: string;
    title: string;
    content: string;
    created_at: number;
    updated_at: number;
}

export interface CommentTable {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: number;
    updated_at: number;
}

export interface SampleDatabase {
    users: UserTable;
    posts: PostTable;
    comments: CommentTable;
}

export { db, sql };
