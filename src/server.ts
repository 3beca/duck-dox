import { Liquid } from 'liquidjs';
import fastify, { FastifyInstance } from 'fastify';
import pointOfView from 'point-of-view';
import { Logger } from 'pino';
import { OpenAPI } from 'openapi-types';
import { buildOperationsRoutes } from './routes/operations';
import { buildIndexRoute } from './routes';
import { buildNotFoundHandler } from './handlers/not-found';
import { buildErrorHandler } from './handlers/error';
import { buildResourcesRoutes } from './routes/resources';

export function buildServer(
    logger: Logger,
    openApi: OpenAPI.Document
): FastifyInstance {
    const liquid = new Liquid({
        cache: true,
        extname: '.liquid'
    });
    const server = fastify({ logger });
    server.register(pointOfView, {
        engine: {
            liquid
        },
        root: 'templates'
    });
    server.setNotFoundHandler(buildNotFoundHandler(openApi));
    server.setErrorHandler(buildErrorHandler(openApi));
    server.register(buildIndexRoute(openApi));
    server.register(buildOperationsRoutes(openApi));
    server.register(buildResourcesRoutes(openApi));
    return server;
}
