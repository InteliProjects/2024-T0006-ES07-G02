import mysqlDatabaseProvider, { MysqlDatabaseProvider } from '../connections/database/MysqlDatabaseProvider';

export default abstract class Repository {
    private dbConnectionProvider: MysqlDatabaseProvider;

    constructor() {
        this.dbConnectionProvider = mysqlDatabaseProvider;
    }

    protected async doSelect(query: string, params?: any[]) {
        return this.dbConnectionProvider.mysqlConnection?.doSelect(query, params);
    }

    protected async doSelectOne(query: string, params?: any[]) {
        return this.dbConnectionProvider.mysqlConnection?.doSelectOne(query, params);
    }

    protected async doCreate(query: string, params?: any[]) {
        return this.dbConnectionProvider.mysqlConnection?.doCreate(query, params);
    }

    protected async doUpdate(query: string, params?: any[]) {
        return this.dbConnectionProvider.mysqlConnection?.doUpdate(query, params);
    }

    protected async doDelete(query: string, params?: any[]) {
        return this.dbConnectionProvider.mysqlConnection?.doDelete(query, params);
    }
}
