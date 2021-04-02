import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OpenAPI } from 'openapi-types';

export function buildIndexRoute(openApi: OpenAPI.Document) {
    return function (
        fastify: FastifyInstance,
        opts: Record<string, unknown>,
        next: () => void
    ): void {
        fastify.get(
            '/',
            (request: FastifyRequest, reply: FastifyReply): void => {
                reply.view('index.liquid', {
                    text: 'Welcome to Duck Dox!',
                    title: openApi.info.title
                });
            }
        );
        next();
    };
}
