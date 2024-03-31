type CreateApiParams = {
    baseUrl: string;
    fetcher: typeof fetch
}

import type { ModelsList, ModelInfo } from "../ollama";

export function createApi({ baseUrl = '', fetcher }: CreateApiParams) {    
    return {
        async getModels(): Promise<ModelsList['models']> {
            const response = await fetcher(`${baseUrl}/api/v1/models`);
            return (await response.json()).models;
        },

        async getModelInfo({ modelName }: { modelName: string }): Promise<ModelInfo> {
            const response = await fetcher(`${baseUrl}/api/v1/models/${encodeURIComponent(modelName)}`);
            return (await response.json()).info;
        },

        async pullModel({ modelName }: { modelName: string }) {
            const response = await fetcher(`${baseUrl}/api/v1/models`, { 
                method: 'POST',
                body: JSON.stringify({ modelName }),
            });

            return response.json();
        }
    };
}