import mysql, { FieldPacket } from 'mysql2';

export default class MysqlDatabaseConnection {
    private mysqlPool: mysql.Pool;

    constructor(host: string, user: string, password: string, database: string, port: number = 3006) {
        this.mysqlPool = mysql.createPool({
            host,
            user,
            password,
            database,
            port,
        });
    }

    async connect() {
        return await new Promise((resolve, reject) => {
            this.mysqlPool.getConnection((error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(`Connected to database`);
                    resolve(this);
                }
            });
        });
    }

    async close() {
        return await new Promise((resolve, reject) => {
            this.mysqlPool.end((error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(`Disconnected to database`);
                    resolve(this);
                }
            });
        });
    }

    public doQuery = async <R = any>(
        query: string,
        params?: any[],
    ): Promise<{ results: R; fields: FieldPacket[] | undefined }> => {
        return new Promise((resolve, reject) => {
            this.mysqlPool.query(query, params, (error, results, fields) => {
                console.log(`Query:`, query);

                if (error) reject(error);
                resolve({ results: results as any, fields });
            });
        });
    };

    doSelect = async <R = any>(query: string, params?: any[]) => {
        const result = await this.doQuery<R[]>(query, params);
        return result.results;
    };

    doSelectOne = async <R = any>(query: string, params?: any[]) => {
        const result = await this.doQuery<R[]>(query, params);
        return result.results[0] as R | null;
    };

    doCreate = async (query: string, params?: any[]): Promise<number | string> => {
        const result = await this.doQuery(query, params);
        return result.results.insertId;
    };

    doUpdate = async (query: string, params?: any[]): Promise<number> => {
        const result = await this.doQuery(query, params);
        return result.results.affectedRows;
    };

    doDelete = async (query: string, params?: any[]): Promise<number> => {
        const result = await this.doQuery(query, params);
        return result.results.affectedRows;
    };
}
