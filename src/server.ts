import { Liquid } from 'liquidjs';
import fastify, { FastifyInstance, FastifyReply, FastifyError } from 'fastify';
import pointOfView from 'point-of-view';
import { Logger } from 'pino';
import { OpenAPI } from 'openapi-types';
import { buildOperationsRoutes } from './routes/operations';
import { Server } from 'http';

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
    server.setNotFoundHandler(function (request, reply: FastifyReply<Server>) {
        reply.code(404).view('not-found.liquid', {
            title: openApi.info.title
        });
    });
    server.setErrorHandler(function (
        error: FastifyError,
        request,
        reply: FastifyReply<Server>
    ) {
        logger.error(error.message);
        reply.code(500).view('error.liquid', {
            title: openApi.info.title
        });
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
