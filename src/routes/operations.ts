import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OpenAPI } from 'openapi-types';

function toKebabCase(value: string): string {
    return value.replace(/\s/g, '-').toLowerCase();
}

export function buildOperationsRoutes(openApi: OpenAPI.Document) {
    return function (
        fastify: FastifyInstance,
        opts: Record<string, unknown>,
        next: () => void
    ): void {
        (openApi.tags || []).forEach(tag => {
            fastify.get(
                `/operations/${toKebabCase(tag.name)}`,
                (request: FastifyRequest, reply: FastifyReply): void => {
                    reply.view('operation-group.liquid', {
                        title: openApi.info.title,
                        operationGroupName: tag.name,
                        operationGroupDescription: tag.description
                    });
                }
            );
        });
        next();
    };
}
