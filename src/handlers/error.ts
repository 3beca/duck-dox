import { OpenAPI } from 'openapi-types';
import { FastifyRequest, FastifyError } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
import { Server } from 'http';

export function buildErrorHandler(openApi: OpenAPI.Document) {
    return (
        error: FastifyError,
        request: FastifyRequest,
        reply: FastifyReply<Server>
    ): void => {
        request.log.error(error.message);
        reply.code(500).view('error.liquid', {
            title: openApi.info.title
        });
    };
}
