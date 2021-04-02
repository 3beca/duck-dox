import { Liquid } from 'liquidjs';
import fastify, { FastifyInstance } from 'fastify';
import pointOfView from 'point-of-view';
import { Logger } from 'pino';
import { OpenAPI } from 'openapi-types';
import { buildOperationsRoutes } from './routes/operations';

export function buildServer(
    logger: Logger,
    openApi: OpenAPI.Document
): FastifyInstance {
    const liquid = new Liquid({
        extname: '.liquid'
    });
    const server = fastify({ logger });
    server.register(pointOfView, {
        engine: {
            liquid
        },
        root: 'templates'
    });
    server.get('/', (req, reply) => {
        reply.view('index.liquid', {
            text: 'Welcome to Duck Dox!',
            title: openApi.info.title
        });
    });
    server.register(buildOperationsRoutes(openApi));
    return server;
}
