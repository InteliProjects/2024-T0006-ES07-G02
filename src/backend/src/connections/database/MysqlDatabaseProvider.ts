import MysqlDatabaseConnection from './MysqlDatabaseConnection';

export class MysqlDatabaseProvider {
    mysqlConnection: MysqlDatabaseConnection;

    public async setConnection(environmentVars: any) {
        this.mysqlConnection = new MysqlDatabaseConnection(
            environmentVars.DB_HOST,
            environmentVars.DB_USER,
            environmentVars.DB_PASSWORD,
            environmentVars.DB_DATABASE,
            environmentVars.DB_PORT,
        );

        return await this.mysqlConnection.connect();
    }

    public getConnection() {
        return this.mysqlConnection;
    }
}

const mysqlDatabaseProvider = new MysqlDatabaseProvider();
export default mysqlDatabaseProvider;
