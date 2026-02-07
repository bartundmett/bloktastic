import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bloktastic.dev',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: '_assets'
  }
});
