import { OpenAPI } from 'openapi-types';
import { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { Server } from 'http';

export function buildNotFoundHandler(openApi: OpenAPI.Document) {
    return (request: FastifyRequest, reply: FastifyReply<Server>): void => {
        reply.code(404).view('not-found.liquid', {
            title: openApi.info.title
        });
    };
}
