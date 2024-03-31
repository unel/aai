<script context="module">
    const refs = [
        {url: "https://kit.svelte.dev", title: "svelte kit", description: ""},
        {url: "https://svelte.dev/docs/introduction", title: "svelte docs", description: ""},
        {url: "https://svelte-5-preview.vercel.app/docs/introduction", title: "svelte 5 docs", description: ""},
    ];
</script>

<h1>Welcome to SvelteKit-based application!</h1>

<p>Visit this links to read the documentation:</p> 
<ul>
    {#each refs as ref}
        <li>
            <a href={ref.url}>{ref.title}</a>
            {#if ref.description}
                ({ref.description})
            {/if}
        </li>
    {/each}
</ul>