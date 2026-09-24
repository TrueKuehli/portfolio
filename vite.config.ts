import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

const gitCommit = execSync('git rev-parse --short HEAD').toString().trim();


export default defineConfig({
	plugins: [
		tailwindcss(),
		enhancedImages(), // must come before the SvelteKit plugin
		sveltekit(),
		ViteYaml(),
	],
	"define": {
		"PORTFOLIO_OWNER": JSON.stringify("Timon Scholz"),
		"PORTFOLIO_GIT_COMMIT": JSON.stringify(gitCommit),
	}
});
