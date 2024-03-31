type CreateApiParams = {
    baseUrl: string;
    fetcher: typeof fetch
}

import type { ModelsList, ModelInfo } from "../ollama";

type GenerateCompletionParams = {
    modelName: string;
    prompt: string;
    system?: string;
    options?: Record<string, any>;
};

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

        generateCompletion: async function* generateCompletion({ modelName, system, prompt, options, signal }: GenerateCompletionParams) {
            const decoder = new TextDecoder();

            const response = await fetcher(`${baseUrl}/api/v1/models/${encodeURIComponent(modelName)}/completion`, {
                method: 'POST', 
                signal,
                body: JSON.stringify({
                    prompt,
                    system,
                    options,
                }),
            });

            for await (const chunk of response.body) {
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