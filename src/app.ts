import { FastifyInstance } from 'fastify';
import { Config } from './config';
import { buildLogger } from './logger';
import { buildServer } from './server';
import { loadOpenApiFromSpecFile } from './open-api';

export type App = {
    close(): Promise<void>;
    getServer(): FastifyInstance;
};

export async function buildApp(config: Config): Promise<App> {
    const { specFile, log } = config;
    const openApi = await loadOpenApiFromSpecFile(specFile);
    const logger = buildLogger(log);
    const server = buildServer(logger, openApi);
    return {
        async close(): Promise<void> {
            await server.close();
        },
        getServer(): FastifyInstance {
            return server;
        }
    };
}
