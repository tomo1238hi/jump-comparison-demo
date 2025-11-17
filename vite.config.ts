import { defineConfig } from 'vite';

const repoBase = process.env.GITHUB_ACTIONS === 'true' ? '/jump-comparison-demo/' : '/';

export default defineConfig({
  base: repoBase,
});
