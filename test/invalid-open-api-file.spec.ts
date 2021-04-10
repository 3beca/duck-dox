import { buildApp } from '../src/app';
import { buildConfig } from '../src/config';

describe('App', () => {
    test('should throw an error if open api json file is not specified', async () => {
        expect.assertions(1);
        try {
            const config = buildConfig();
            await buildApp({
                ...config,
                log: {
                    ...config.log,
                    enabled: false
                }
            });
        } catch (error) {
            expect(error.message).toBe(
                'OpenApi specification file is required'
            );
        }
    });

    test('should throw an error if open api json file does not exist', async () => {
        expect.assertions(1);
        try {
            const config = buildConfig();
            await buildApp({
                ...config,
                specFile: '/non-existing-file.json',
                log: {
                    ...config.log,
                    enabled: false
                }
            });
        } catch (error) {
            expect(error.message).toBe(
                'Error opening file "/non-existing-file.json"'
            );
        }
    });

    test('should throw an error if open api json file is not valid', async () => {
        expect.assertions(1);
        try {
            const config = buildConfig();
            await buildApp({
                ...config,
                specFile: './test/open-api-specs/invalid.json',
                log: {
                    ...config.log,
                    enabled: false
                }
            });
        } catch (error) {
            expect(error.message).toBe(
                './test/open-api-specs/invalid.json is not a valid Openapi API definition'
            );
        }
    });

    test('should throw an error if open api json file has got validation errors', async () => {
        expect.assertions(1);
        try {
            const config = buildConfig();
            await buildApp({
                ...config,
                specFile: './test/open-api-specs/invalid-cep-admin.json',
                log: {
                    ...config.log,
                    enabled: false
                }
            });
        } catch (error) {
            expect(error.message).toBe(`Swagger schema validation failed. 
  Data does not match any schemas from 'oneOf' at #/paths//rules-executions//get/parameters/3
    Data does not match any schemas from 'oneOf' at #/paths//rules-executions//get/parameters/3
      Missing required property: schema at #/
      Data does not match any schemas from 'oneOf' at #/
        Additional properties not allowed: errorMessage at #/
        Additional properties not allowed: errorMessage at #/
        Additional properties not allowed: errorMessage at #/
        Additional properties not allowed: errorMessage at #/
    Missing required property: $ref at #/paths//rules-executions//get/parameters/3
  Data does not match any schemas from 'oneOf' at #/paths//rules-executions//get/parameters/2
    Data does not match any schemas from 'oneOf' at #/paths//rules-executions//get/parameters/2
      Missing required property: schema at #/
      Data does not match any schemas from 'oneOf' at #/
        Additional properties not allowed: errorMessage at #/
        Additional properties not allowed: errorMessage at #/
        Additional properties not allowed: errorMessage at #/
        Additional properties not allowed: errorMessage at #/
    Missing required property: $ref at #/paths//rules-executions//get/parameters/2
 
JSON_OBJECT_VALIDATION_FAILED`);
        }
    });
});
