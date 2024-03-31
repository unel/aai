
# AAI

Anoter attempt to build ui for dev chat bots focused on multiple agents execution

references: 
 - LangChain https://js.langchain.com
 - TestContainers https://testcontainers.com
 - ollama https://ollama.com
 - openwebui https://openwebui.com
 - huggingface https://huggingface.co


## ENV
.env should include these keys:
```env
AAI_BASE_URL = 'http://localhost:5173'
OLLAMA_BASE_URL = 'http://localhost:11434'
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
pnpm run dev
```
```sh
# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.





