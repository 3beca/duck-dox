import { App, buildApp } from '../src/app';
import { buildConfig } from '../src/config';
import cheerio from 'cheerio';

describe('App', () => {
    let app: App;

    beforeEach(async () => {
        const config = buildConfig();
        app = await buildApp({
            ...config,
            specFile: './test/open-api-specs/simple-no-tags.json',
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
        const page = cheerio.load(response.body);
        expect(page('head title').text()).toEqual(
            'Simple API - Page Not Found'
        );
        expect(page('body h1').text()).toEqual('Page Not Found');
    });
});
