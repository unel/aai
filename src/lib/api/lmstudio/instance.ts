import { env } from '$env/dynamic/private';
import { createApi } from '$lib/api/lmstudio/index.js';

export const api  = createApi({
    baseUrl: env.LMSTUDIO_BASE_URL,
    fetcher: fetch,
});
