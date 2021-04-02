import { App, buildApp } from '../src/app';
import { buildConfig } from '../src/config';
import cheerio from 'cheerio';

describe('App', () => {
    let app: App;

    beforeEach(async () => {
        const config = buildConfig();
        app = await buildApp({
            ...config,
            specFile: './test/open-api-specs/simple.json',
            log: {
                ...config.log,
                enabled: false
            }
        });
    });
    afterEach(async () => {
        await app.close();
    });

    test('should return 404 not page found when route not found', async () => {
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

    it('should return 500 internal server error page when unhandled errors happened', async () => {
        app.getServer().register(
            function (fastify, opts: Record<string, unknown>, next) {
                fastify.get('/', opts, async () => {
                    throw new Error('Oops, an error here');
                });
                next();
            },
            { prefix: '/error' }
        );

        const response = await app.getServer().inject({
            method: 'GET',
            url: '/error'
        });

        expect(response.statusCode).toBe(500);
        const page = cheerio.load(response.body);
        expect(page('head title').text()).toEqual(
            'Simple API - Oops, an error ocurred'
        );
        expect(page('body h1').text()).toEqual('Oops, an error ocurred');
    });

    test('should return 200 with basic homepage when route is /', async () => {
        const response = await app
            .getServer()
            .inject({ method: 'GET', url: '/' });

        expect(response.statusCode).toBe(200);
        const page = cheerio.load(response.body);
        expect(page('head title').text()).toEqual('Simple API');
        expect(page('body h1').text()).toEqual('Simple API');
    });

    test('should return 200 with operation group page based', async () => {
        const response = await app
            .getServer()
            .inject({ method: 'GET', url: '/operations/simple-name' });

        expect(response.statusCode).toBe(200);
        const page = cheerio.load(response.body);
        expect(page('head title').text()).toEqual('Simple API - Simple name');
        expect(page('body h1').text()).toEqual('Simple name');
        expect(page('body h2').text()).toEqual('Simple description');
    });
});
