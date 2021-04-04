import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OpenAPI } from 'openapi-types';

function toKebabCase(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
        .replace(/[\s_]+/g, '-') // replace all spaces and low dash
        .toLowerCase();
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
                    reply.view('operation-group', {
                        title: openApi.info.title,
                        operationGroupName: tag.name,
                        operationGroupDescription: tag.description
                    });
                }
            );

            Object.keys(openApi.paths).forEach(path => {
                Object.keys(openApi.paths[path]).forEach(verb => {
                    const operation = openApi.paths[path][verb];
                    if ((operation.tags || []).includes(tag.name)) {
                        fastify.get(
                            `/operations/${toKebabCase(tag.name)}/${toKebabCase(
                                operation.operationId
                            )}`,
                            (
                                request: FastifyRequest,
                                reply: FastifyReply
                            ): void => {
                                reply.view('operation', {
                                    title: openApi.info.title,
                                    operationGroupName: tag.name,
                                    operationSummary: operation.summary,
                                    operationDescription: operation.description
                                });
                            }
                        );
                    }
                });
            });
        });
        next();
    };
}
