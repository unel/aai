
import { json } from '@sveltejs/kit';
import { api } from '../ollama';

export async function GET({ params }) {
    const info = await api.getModelInfo({ modelName: params.modelName }); 

    return json({
        apiVersion: params.apiVersion,
        info,
    });
}