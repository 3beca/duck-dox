import { App, buildApp } from '../src/app';
import { buildConfig } from '../src/config';
import cheerio from 'cheerio';
import { sel } from './test-utils';

describe('App', () => {
    let app: App;

    beforeEach(async () => {
        const config = buildConfig();
        app = await buildApp({
            ...config,
            specFile: './test/open-api-specs/cep-admin.json',
            log: {
                ...config.log,
                enabled: false
            }
        });
    });
    afterEach(async () => {
        await app.close();
    });

    test('should return list of http endpoints that belong to the operation group', async () => {
        const response = await app
            .getServer()
            .inject({ method: 'GET', url: '/operations/event-types' });

        expect(response.statusCode).toBe(200);
        const page = cheerio.load(response.body);
        expect(page('head title').text()).toEqual('Tribeca-cep - Event types');
        expect(page('body h1').text()).toEqual('Event types');
        expect(page(sel('operation-id')).length).toEqual(5);
        expect(
            page(sel('operation-id') + ':first')
                .text()
                .trim()
        ).toEqual('list event types');
    });
});
