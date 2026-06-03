import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: [],
  manifest: {
    name: 'FanFiction Tools',
    version: '1.0',
    description: 'A simple Chrome extension for FanFiction.net',
    permissions: ['activeTab'],
  },
})
