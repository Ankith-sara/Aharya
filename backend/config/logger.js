import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const levels = { error: 0, warn: 1, info: 2, debug: 3 };

const logger = {
    error: (msg, meta) => console.error(`[ERROR] ${new Date().toISOString()} ${msg}`, meta || ''),
    warn: (msg) => console.warn(`[WARN]  ${new Date().toISOString()} ${msg}`),
    info: (msg) => console.log(`[INFO]  ${new Date().toISOString()} ${msg}`),
    debug: (msg) => process.env.NODE_ENV === 'development' && console.log(`[DEBUG] ${new Date().toISOString()} ${msg}`)
};

export default logger;
