import { env } from '$env/dynamic/private';
import { createApi } from '$lib/api/ollama/index.js';

export const api  = createApi({
    baseUrl: env.OLLAMA_BASE_URL,
    fetcher: fetch,
});
