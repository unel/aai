<script>
	import '../app.css';

	const themes = [
		{ label: 'Default', value: 'default' },
		{ label: 'Light', value: 'light' },
		{ label: 'Dark', value: 'dark' },
		{ label: 'Cupcake', value: 'cupcake' },
		{ label: 'Pastel', value: 'pastel' },
		{ label: 'CMYK', value: 'cmyk' }
	];
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</div>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a href="/docs">Some "documentation"</a></li>
				<li><a href="/models">Work with models</a></li>
			</ul>
		</div>

		<a class="btn btn-ghost text-xl" href="/">AAI</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/docs">Some "documentation"</a></li>
			<li><a href="/models">Work with models</a></li>
		</ul>
	</div>

	<div class="navbar-end">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn m-1">
				Theme
				<svg
					width="12px"
					height="12px"
					class="h-2 w-2 fill-current opacity-60 inline-block"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 2048 2048"
					><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg
				>
			</div>

			<ul tabindex="0" class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
				{#each themes as theme}
					<li>
						<input
							type="radio"
							name="theme-dropdown"
							class="theme-controller btn btn-sm btn-block btn-ghost justify-start"
							aria-label={theme.label}
							value={theme.value}
						/>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<main class="prose max-w-none">
    <slot />
</main>
