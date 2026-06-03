import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: [],
  manifest: {
    name: 'Wayback Tools',
    version: '1.0',
    description: 'A simple Chrome extension for ao3 copy',
    permissions: ['activeTab']
  }
});
