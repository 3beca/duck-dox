import { OpenAPI } from 'openapi-types';
import SwaggerParser from '@apidevtools/swagger-parser';

export async function loadOpenApiFromSpecFile(
    specFile: string
): Promise<OpenAPI.Document> {
    if (!specFile) {
        throw new Error('OpenApi specification file is required');
    }
    return await SwaggerParser.validate(specFile);
}
