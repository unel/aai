
import { json } from '@sveltejs/kit';
import { api } from '$lib/api/ollama/instance';

export async function GET({ params }) {
    const modelsBody = await api.getModels(); 

    return json({
        apiVersion: params.apiVersion,
        ...modelsBody,
    });
}