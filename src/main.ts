import { buildConfig } from './config';
import gracefulShutdown from './graceful-shutdown';
import 'make-promises-safe';
import logger from './logger';
import { buildApp } from './app';

async function main() {
    logger.info('Starting Duck Dox');

    const config = buildConfig();
    const { http } = config;
    const app = await buildApp();

    await app.getServer().listen(http.port, http.host);

    process.on('SIGTERM', gracefulShutdown(app));
    process.on('SIGINT', gracefulShutdown(app));
}

main().catch(error => {
    logger.error(`Error while starting up Duck Dox. ${error.message}`);
    process.exit(1);
});