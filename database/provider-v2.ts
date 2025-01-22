import { BaseEndpoint, BaseRecord, BaseTable } from './types';
import { SQLiteDataProvider } from './provider';
import { Database } from './db';

// Add type intersection to ensure Database has string index signature
type DatabaseWithIndex = Database & Record<string, BaseTable>;

export class SQLiteDataProviderV2<T extends BaseRecord> extends SQLiteDataProvider<T, DatabaseWithIndex> {
    constructor(
        entity: keyof Database,
        endpoint: BaseEndpoint<T>,
        queryKey: string
    ) {
        const { db } = require('../db');
        super(db, entity, endpoint, queryKey);
    }
}
