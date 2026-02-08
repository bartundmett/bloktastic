import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bloktastic.com',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: '_assets'
  }
});
