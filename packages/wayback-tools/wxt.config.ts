import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  modules: [],
  manifest: {
    name: 'Wayback Tools',
    version: '1.0',
    description: 'A simple Chrome extension for ao3 copy',
    permissions: ['activeTab'],
    host_permissions: [
      'file:///*' // 允许插件访问本地文件系统（仍需在浏览器中手动勾选开关）
    ]
  }
});
