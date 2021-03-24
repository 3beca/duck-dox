import { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import logger from './logger';

export type App = {
    close(): Promise<void>;
    getServer(): FastifyInstance;
}

export async function buildApp(): Promise<App> {
    const server = fastify({ logger });
    return {
        async close(): Promise<void> {
            await server.close()
        },
        getServer(): FastifyInstance {
            return server;
        }
    };
}
