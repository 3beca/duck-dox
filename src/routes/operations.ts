import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OpenAPI } from 'openapi-types';

export function buildOperationsRoutes(openApi: OpenAPI.Document) {
    return function (
        fastify: FastifyInstance,
        opts: Record<string, unknown>,
        next: () => void
    ): void {
        (openApi.tags || []).forEach(tag => {
            fastify.get(
                `/operations/${tag.name.toLowerCase()}`,
                (req: FastifyRequest, reply: FastifyReply) => {
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
