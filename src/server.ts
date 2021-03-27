import { Liquid } from 'liquidjs';
import fastify, { FastifyInstance } from 'fastify';
import pointOfView from 'point-of-view';
import { Logger } from 'pino';

export function buildServer(logger: Logger): FastifyInstance {
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
        reply.view('index.liquid', { text: 'Welcome to Duck Dox!' });
    });
    return server;
}
