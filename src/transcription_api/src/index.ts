import { app } from './app';
import conectarRabbitMQ from './config/rabbitMQ';
import transcriptionRoutes from './routes/transcriptionRoutes';

app.use('/api', transcriptionRoutes);

const port = process.env.PORT || 3008;

conectarRabbitMQ()
    .then(() => {
        console.log('Consumidor RabbitMQ inicializado.');
    })
    .catch(console.error);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
