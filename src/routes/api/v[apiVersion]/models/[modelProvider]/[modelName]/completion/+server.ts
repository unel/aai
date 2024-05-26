import { error } from '@sveltejs/kit';

import { api as ollamaApi } from '$lib/api/ollama/instance';
import { api as lmstudioApi} from '$lib/api/lmstudio/instance';
import type { LLMAPI } from '$lib/api/types';

const apiByProvider: Record<string, LLMAPI> = {
    ollama: ollamaApi,
    lmstudio: lmstudioApi,
};

async function* stringifyGenerator(asyncGen: AsyncGenerator) {
    for await (const data of asyncGen) {
        yield JSON.stringify(data);
    }
}

async function* abortableGenerator(asyncGen: AsyncGenerator, { signal, controller }: { signal: AbortSignal, controller: AbortController }) {
    for await (const data of asyncGen) {
        console.log('checking signal', signal, signal.aborted);
        if (signal.aborted) {
            controller.abort();
            return;
        }

        yield data;
    }
}

export async function POST({ params, request }) {
    const body = await request.json();

    const abortController = new AbortController();
    const abortSignal = abortController.signal;

    request.signal.addEventListener('abort', (e) => {
        console.log('aborting connection', e);
    });

    const api = apiByProvider[params.modelProvider];
    if (!api) {
        return error(500, `Unknown model provider: ${params.modelProvider}`);
    }

    const modelName = atob(params.modelName);

    const messages = api.generateCompletion({
        modelName,
        system: body.system,
        prompt: body.prompt,
        options: body.options,
        signal: abortSignal,
    });

    return new Response(
        ReadableStream.from(
            abortableGenerator(
                stringifyGenerator(messages),
                { signal: request.signal, controller: abortController }
            )
        ),
        {
            headers: {
                'content-type': 'text/event-stream',
            }
        }
    );
}