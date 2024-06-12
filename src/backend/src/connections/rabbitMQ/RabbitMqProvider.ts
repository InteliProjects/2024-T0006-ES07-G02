import RabbitMQConnection from './RabbitMqConnection';

export class RabbitMqProvider {
    rabbitMqConnection: RabbitMQConnection;

    public async setConnection(environmentVars: any) {
        this.rabbitMqConnection = new RabbitMQConnection(
            environmentVars.RABBIT_MQ_HOST,
            environmentVars.RABBIT_MQ_USER,
            environmentVars.RABBIT_MQ_PASSWORD,
            environmentVars.RABBIT_MQ_PORT,
        );

        return await this.rabbitMqConnection.connect();
    }

    public async keepTryingConnect(environmentVars: any, ms: number = 5000) {
        try {
            return await this.setConnection(environmentVars);
        } catch (error) {
            console.log(`[${new Date().toISOString()}] Error trying to connect with RabbitMQ. Retry soon`);
            return await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(this.keepTryingConnect(environmentVars, ms))
                }, ms)
            })
        }
    }

    public getConnection() {
        return this.rabbitMqConnection;
    }
}

const rabbitMqProvider = new RabbitMqProvider();
export default rabbitMqProvider;
