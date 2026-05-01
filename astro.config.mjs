import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://avvera.studio',
  vite: {
    ssr: {
      noExternal: ['gsap', '@gsap/react'],
    },
  },
});
