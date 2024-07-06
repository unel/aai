type CreateApiParams = {
    baseUrl: string;
    fetcher: typeof fetch
}

import type { ErrorDescription, ModelInfo } from "../../../routes/api/v[apiVersion]/models/+server";

export type ModelsListResponse = {
    data: ModelInfo[];
    
    errors: ErrorDescription[];
};


type GenerateCompletionParams = {
    provider: string;
    modelId: string;
    prompt: string;
    system?: string;
    signal: AbortSignal;
    options?: Record<string, unknown>;
};

export function createApi({ baseUrl = '', fetcher }: CreateApiParams) {    
    return {
        async getModels(): Promise<ModelsListResponse> {
            const response = await fetcher(`${baseUrl}/api/v1/models`);
            return (await response.json());
        },

        async getModelInfo({ modelId }: { modelId: string }): Promise<ModelInfo> {
            const response = await fetcher(`${baseUrl}/api/v1/models/${encodeURIComponent(modelId)}`);
            return (await response.json()).info;
        },

        generateCompletion: async function* generateCompletion({ provider, modelId, system, prompt, options, signal }: GenerateCompletionParams) {
            const decoder = new TextDecoder();

            const response = await fetcher(`${baseUrl}/api/v1/models/${provider}/${encodeURIComponent(btoa(modelId))}/completion`, {
                method: 'POST', 
                signal,
                body: JSON.stringify({
                    prompt,
                    system,
                    options,
                }),
            });
            const body = response.body;
            if (!body) return;

            for await (const chunk of ((body as unknown) as AsyncIterable<Uint8Array>)) {
                const data = JSON.parse(decoder.decode(chunk));
                console.log(data);
                yield data;
            } 
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