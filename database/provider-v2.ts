import { BaseEndpoint, BaseRecord, BaseTable } from './types';
import { SQLiteDataProvider } from './provider';

// Generic database type that extends BaseTable
export interface GenericDatabase {
    [key: string]: BaseTable;
}

export class SQLiteDataProviderV2<T extends BaseRecord, DB extends GenericDatabase = GenericDatabase> extends SQLiteDataProvider<T, DB> {
    constructor(
        entity: keyof DB,
        endpoint: BaseEndpoint<T>,
        queryKey: string,
        db: any  // The actual database instance will be passed in
    ) {
        super(db, entity, endpoint, queryKey);
    }
}
