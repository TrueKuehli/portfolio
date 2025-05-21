import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';


export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		ViteYaml(),
	],
	"define": {
		"PORTFOLIO_OWNER": JSON.stringify("Timon Scholz"),
	}
});
