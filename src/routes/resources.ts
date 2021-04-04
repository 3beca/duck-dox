import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OpenAPI, OpenAPIV2 } from 'openapi-types';

function toKebabCase(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, '$1-$2') // get all lowercase letters that are near to uppercase ones
        .replace(/[\s_]+/g, '-') // replace all spaces and low dash
        .toLowerCase();
}

export function buildResourcesRoutes(openApi: OpenAPI.Document) {
    return function (
        fastify: FastifyInstance,
        opts: Record<string, unknown>,
        next: () => void
    ): void {
        Object.keys((openApi as OpenAPIV2.Document).definitions || {}).forEach(
            definitionName => {
                fastify.get(
                    `/resources/${toKebabCase(definitionName)}`,
                    (request: FastifyRequest, reply: FastifyReply): void => {
                        reply.view('resource', {
                            title: openApi.info.title,
                            resourceName: definitionName
                        });
                    }
                );
            }
        );
        next();
    };
}
