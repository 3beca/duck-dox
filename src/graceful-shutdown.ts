import { App } from './app';
import pino from 'pino';

const logger = pino({ level: 'info' });

export default function gracefulShutdown(app: App): () => Promise<void> {
    return async (): Promise<void> => {
        try {
            logger.info('Shutting down Duck Dox.');
            await app.close();
            logger.info('Shutdown complete. Exit now.');
            process.exit(0);
        } catch (error) {
            logger.error('error while shutting down.', error);
            process.exit(1);
        }
    };
}
