import pino, { Logger } from 'pino';
import { Config } from './config';

export function buildLogger(options: Config['log']): Logger {
    const { level, enabled } = options;
    return pino({ level, enabled });
}
