import IaApiConnection from './IaApiConnection';

export class IaApiProvider {
    iaConnection?: IaApiConnection = undefined;

    public async setConnection(environmentVars: any) {
        this.iaConnection = new IaApiConnection(environmentVars.IA_API_BASE_URL);
    }

    public getConnection() {
        return this.iaConnection;
    }
}

const iaApiProvider = new IaApiProvider();
export default iaApiProvider;
