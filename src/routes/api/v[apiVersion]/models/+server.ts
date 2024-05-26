
import { json } from '@sveltejs/kit';
import { api as ollamaApi } from '$lib/api/ollama/instance';
import { api as lmstudioApi } from '$lib/api/lmstudio/instance';


export type ErrorDescription = {
    provider: string;
    message: string;
    trace: string;
};

export type ModelInfo = {
    id: string;
    name: string;
    provider: string;
};

export async function GET({ params }) {
    const [ollamaR, lmstudioR] = await Promise.allSettled([
        ollamaApi.getModels(),
        lmstudioApi.getModels(),
    ]);

    const models: Array<ModelInfo> = [];
    const errors: Array<ErrorDescription> = [];

    if (ollamaR.status === 'fulfilled') {
        for (const model of ollamaR.value.models) {
            models.push({
                id: model.name,
                name: model.name,
                provider: 'ollama',
            });
        }
    } else {
        errors.push({
            provider: 'ollama',
            message: ollamaR.reason.message,
            trace: ollamaR.reason.stack,
        });
    }

    if (lmstudioR.status === 'fulfilled') {
        for (const model of lmstudioR.value.data) {
            models.push({
                id: model.id,
                name: model.id,
                provider: 'lmstudio'
            })
        }
    } else {
        errors.push({
            provider: 'lmstudio',
            message: lmstudioR.reason.message,
            trace: lmstudioR.reason.stack,
        });
    }

    return json({
        apiVersion: params.apiVersion,
        data: models,
        errors: errors,
    });
}