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
    options?: Record<string, unknown>;
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
            const body = JSON.stringify({
                model: modelName,
                messages: [
                    {"role": "system", content: system},
                    {"role": "user", content: prompt},
                ].filter(m => m.content),
                stream: true,
                ...options,
            });
            const url = `${baseUrl}/v1/chat/completions`;
            const fetchOptions = {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                method: 'POST',
                body,
                signal
            };
            console.log('lmstudio generate completion', body);

            console.log(`fetch("${url}", ${JSON.stringify(fetchOptions)})`);
            const response = await fetcher(url, fetchOptions);
            console.log('response', response);

            try {
                for await (const chunk of response.body) {
                    console.log('response chunk::', chunk);
                    const str = decoder.decode(chunk);
                    const jsonStr = str.slice(6);
                    console.log('response string::', str, jsonStr);
                    const data = JSON.parse(jsonStr);
                    console.log('rd', data);
                    if (signal?.aborted) {
                        return;
                    }

                    console.log('text', data.choices[0].delta.content);
                    
                    yield {
                        text: data.choices[0].delta.content,
                        done: !!data.finish_reason,
                    };
                } 
            } catch (e) {
                console.log('error', e);
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