
import { env } from '$env/dynamic/private';
import { createApi } from "$lib/api/aai";

const api = createApi({
    baseUrl: env.AAI_BASE_URL, 
    fetcher: fetch,
});

export async function load() {
    return {
        models: await api.getModels(),
    };
}