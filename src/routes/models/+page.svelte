<script lang="ts" context="module">
	import { createApi } from '$lib/api/aai';
	import type { Model, ModelInfo } from '$lib/api/ollama';

	const api = createApi({
		baseUrl: '',
		fetcher: fetch
	});
</script>

<script lang="ts">
	const { data } = $props();

	let chatText = $state('');
	let chatResponse: string = $state('');
	let chatMessages: Array<{ author: string; message: string }> = $state([]);
	let abortController: AbortController | undefined = $state();

	let models: Model[] = $state(data.models);
	let highlightedModel: string | undefined = $state();
	let selectedModel: string | undefined = $state();

	let modelsInfo: Record<string, ModelInfo> = $state({});

	let activeModelName = $derived(highlightedModel || selectedModel);
	let modelInfo = $derived(activeModelName ? modelsInfo[activeModelName] : undefined);

	async function refreshModels() {
		models = await api.getModels();
	}

	async function loadModelInfo(modelName: string) {
		if (modelsInfo[modelName]) return;

		try {
			const info = await api.getModelInfo({ modelName });

			if (info) {
				modelsInfo[modelName] = info;
			}
		} catch {}
	}

	function selectModel(modelName: string) {
		selectedModel = modelName;

		loadModelInfo(modelName);
	}

	function unselectModel() {
		highlightedModel = undefined;
	}

	function highlightModel(modelName: string) {
		highlightedModel = modelName;

		loadModelInfo(modelName);
	}

	function unhighlightModel(modelName?: string) {
		if (modelName && modelName !== highlightedModel) return;

		highlightedModel = undefined;
	}

	async function onChatSubmit(e: SubmitEvent, modelName?: string) {
		e.preventDefault();
		if (!modelName) {
			return;
		}
		const userMessage = String(chatText);
		chatText = '';

		chatMessages.push({ author: 'user', message: userMessage });

		console.log(`sending ${chatText} to ${modelName}`);
		chatResponse = '';
		abortController = new AbortController();
		const signal = abortController.signal;
		const messages = api.generateCompletion({ modelName, prompt: userMessage, signal });

		for await (const message of messages) {
			console.log('response with', message);
			chatResponse += message.text;
		}

		chatMessages.push({ author: 'ai', message: chatResponse });
		chatResponse = '';
		e.preventDefault();
	}

	function abortChatResponse() {
		if (!abortController) return;
		abortController.abort();

		chatMessages.push({ author: 'ai', message: chatResponse });
		chatResponse = '';
		abortController = undefined;
	}
</script>

<h1>Models list</h1>

<section class="models-block">
	<ul class="models-list">
		{#each models as model}
			<li
				class={`model-item${model.name === activeModelName ? ' model-item_ac' : ''}`}
				onclick={() => selectModel(model.name)}
				onmouseenter={() => highlightModel(model.name)}
				onmouseleave={() => unhighlightModel(model.name)}
			>
				<b>{model.name}</b>
			</li>
		{/each}
	</ul>

	<section class="model-info">
		{#if modelInfo}
			<table class="table" style={`width: 100%;`}>
				<tbody>
					<tr><td>template</td><td>{modelInfo.template}</td></tr>
					<tr><td>parameters</td><td> {modelInfo.parameters}</td></tr>
				</tbody>
			</table>
			<pre>{JSON.stringify(modelInfo.details, undefined, 4)}</pre>
		{/if}

		{#if activeModelName}
			<form class="chact-section" onsubmit={(e) => onChatSubmit(e, activeModelName)}>
				<div class="chat-messages w-full">
					{#each chatMessages as message}
						<div class={`chat ${message.author === 'ai' ? 'chat-end' : 'chat-start'}`}>
							<div class="chat-header">
								{message.author}:
							</div>

							<div class="chat-bubble">
								{message.message}
							</div>
						</div>
					{/each}

					{#if chatResponse}
						<div class="chat chat-end">
							<div class="chat-header">
								ai:
							</div>

							<div class="chat-bubble">
								{chatResponse}
							</div>

                            <div class="chat-footer">
                                <button class="btn btn-xs btn-link" type="button" onclick={abortChatResponse}>abort</button>
                            </div>
						</div>
					{/if}
				</div>

                <div class="chat-footer flex justify-items-stretch gap-x-4">
                    <input type="text" class="input input-bordered grow" bind:value={chatText} />
                    <button class="btn" type="submit" disabled={!!chatResponse}>{`>>`}</button>
                </div>
			</form>
		{/if}
	</section>
</section>

<button class="btn btn-sm" onclick={refreshModels}>refresh models</button>

<style lan>
	.models-block {
		display: flex;
		flex-direction: row;
		column-gap: 16px;
	}

	.models-list {
		display: block;
		padding: 8px;
		border: 1px solid silver;
	}

	.models-list .model-item {
		cursor: pointer;
	}

	.models-list .model-item:hover,
	.models-list .model-item_ac {
		background-color: cornflowerblue;
	}

	.model-info {
		flex-grow: 1;
		display: block;
		padding: 8px;
	}

	.chat-section {
		display: block;
	}
</style>
