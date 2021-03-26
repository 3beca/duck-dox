import { App, buildApp } from '../src/app';
import { buildConfig } from '../src/config';

describe('App', () => {
    let app: App;

    beforeEach(async () => {
        const config = buildConfig();
        app = await buildApp({
            ...config,
            log: {
                ...config.log,
                enabled: false
            }
        });
    });
    afterEach(async () => {
        await app.close();
    });

    test('should return 404 when route not found', async () => {
        const response = await app
            .getServer()
            .inject({ method: 'GET', url: '/not-found-route' });

        expect(response.statusCode).toBe(404);
        const body = JSON.parse(response.body);
        expect(body).toEqual({
            error: 'Not Found',
            message: 'Route GET:/not-found-route not found',
            statusCode: 404
        });
    });

    test('should return 200 with basic homepage when route is /', async () => {
        const response = await app
            .getServer()
            .inject({ method: 'GET', url: '/' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            '<html><body><h1>Welcome to Duck Dox!</h1></body></html>'
        );
    });
});
