import amqplib, { Channel, Connection } from 'amqplib';

import AppError from '../../app/AppError/AppError';

export default class RabbitMQConnection {
    private baseUrl: string;
    private user: string;
    private password: string;
    private port: number;
    private channel: Channel;
    private connection: Connection;

    constructor(baseUrl: string, user: string, password: string, port: number) {
        this.baseUrl = baseUrl;
        this.user = user;
        this.password = password;
        this.port = port;
    }

    async connect() {
        this.connection = await amqplib.connect({
            hostname: this.baseUrl,
            username: this.user,
            password: this.password,
            port: this.port,
        });
        this.channel = await this.connection.createChannel();

        console.log(`Connected to rabbitMQ`);
    }

    async publish(queue: string, message: any, queueOptions?: amqplib.Options.AssertQueue): Promise<boolean> {
        await this.channel.assertQueue(queue, queueOptions);

        if (typeof message != 'string' && !(message instanceof Buffer)) {
            message = JSON.stringify(message);
        }

        return this.channel.sendToQueue(queue, Buffer.from(message));
    }

    async consume(queue: string, callback: CallableFunction, queueOptions?: amqplib.Options.AssertQueue) {
        await this.channel.assertQueue(queue, queueOptions);
        return this.channel.consume(queue, (msg) => callback(msg));
    }
}
