import { App, buildApp } from '../src/app';

describe('App', () => {
    let app: App;

    beforeEach(async () => {
        app = await buildApp();
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
});
