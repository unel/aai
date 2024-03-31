import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";


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
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details: ModelDetails;
};

export type ModelsList = {
    models: Model[];
}

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

export function createApi({ baseUrl, fetcher }: CreateApiParams) {    
    const model = new ChatOllama({
        baseUrl,
    });

    return {
        async getModels(): Promise<ModelsList> {
            return (await fetcher(`${baseUrl}/api/tags`)).json();
        },

        async getModelInfo({ modelName }: { modelName: string }): Promise<ModelInfo> {
            return (await fetcher(`${baseUrl}/api/show`, {
                method: 'POST',
                body: JSON.stringify({ name: modelName })
            })).json();
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