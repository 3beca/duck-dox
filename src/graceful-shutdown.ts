import logger from './logger';
import { App } from './app';

export default function gracefulShutdown(app: App): () => Promise<void> {
    return async (): Promise<void> => {
        try {
            logger.info('Shutting down Duck Dox.');
            await app.close();
            process.exit(0);
        } catch (error) {
            logger.error('error while shutting down.', error);
            process.exit(1);
        }
    };
}
