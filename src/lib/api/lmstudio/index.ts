type CreateApiParams = {
    baseUrl: string;
    fetcher: typeof fetch
}

type ModelDetails = {
    parent_model: string;
    format: string; // or enum? // gguf | ??
    family: string;
    familes: null | string[];
    parameter_size: string;
    quantization_level: string;
};

export type Model = {
    id: string;
};

export type ModelsList = {
    data: Model[];
};

export type ModelInfo = {
    licence: string;
    modelFile: string;
    parameters: string;
    template: string;
    details: ModelDetails;
};


type PullModelParams = {
    modelName: string;
};

type GenerateCompletionParams = {
    modelName: string;
    prompt: string;
    system?: string;
    options?: Record<string, any>;
    signal?: AbortSignal;
}

export function createApi({ baseUrl, fetcher }: CreateApiParams) {    
    return {
        async getModels(): Promise<ModelsList> {
            return (await fetcher(`${baseUrl}/v1/models`)).json();
        },

        async getModelInfo({ modelName }: { modelName: string }): Promise<ModelInfo> {
            return (await fetcher(`${baseUrl}/api/show`, {
                method: 'POST',
                body: JSON.stringify({ name: modelName })
            })).json();
        },

        generateCompletion: async function* generateCompletion ({ modelName, prompt, system, options, signal }: GenerateCompletionParams) {
            const decoder = new TextDecoder();
            const response = await fetcher(`${baseUrl}/v1/chat/completions`, { 
                method: 'POST',
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        {"role": "system", content: system},
                        {"role": "user", content: prompt},
                    ],
                    ...options,
                }),
                signal
            });

            for await (const chunk of response.body) {
                const data = JSON.parse(decoder.decode(chunk));
                if (signal?.aborted) {
                    return;
                }
                
                yield {
                    text: data.response,
                    done: data.done,
                };
            } 
        },

        async pullModel({ modelName }: PullModelParams) {
            const response = await fetcher(`${baseUrl}/api/pull`, { 
                method: 'POST',
                body: JSON.stringify({
                    name: modelName,
                    insecure: true,
                }),
            });

            return response.json();
        }
    };
}