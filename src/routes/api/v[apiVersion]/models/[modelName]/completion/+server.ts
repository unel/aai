import { json } from '@sveltejs/kit';
import { api } from '$lib/api/ollama/instance';

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

    const messages = api.generateCompletion({
        modelName: params.modelName,
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