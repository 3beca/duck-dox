import { buildConfig } from './config';
import gracefulShutdown from './graceful-shutdown';
import 'make-promises-safe';
import { buildApp } from './app';
import pino from 'pino';

const mainLogger = pino({ level: 'info' });

async function main() {
    mainLogger.info('Starting Duck Dox');

    const config = buildConfig();
    const app = await buildApp(config);

    const { http } = config;
    await app.getServer().listen(http.port, http.host);

    process.on('SIGTERM', gracefulShutdown(app));
    process.on('SIGINT', gracefulShutdown(app));
}

main().catch(error => {
    mainLogger.error(`Error while starting up Duck Dox. ${error.message}`);
    process.exit(1);
});
