import App from './app/App';

const app = new App(`${__dirname}/../.env`);

(async () => {
    await app.config();
    app.start();
})();
