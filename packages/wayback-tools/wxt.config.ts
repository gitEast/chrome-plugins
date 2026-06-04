import { defineConfig } from 'wxt'

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
      'file:///*', // 允许插件访问本地文件系统（仍需在浏览器中手动勾选开关）
    ],
    // 确保扩展有权限访问本地开发服务器进行热更新通信
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    },
  },
  // 浏览器运行配置
  runner: {
    // 在开发时，希望一启动就自动打开目标 Wayback Machine 页面
    startUrls: [
      'https://web.archive.org/web/20140930140356/https://archiveofourown.org/works/951994?view_full_work=true',
    ],
  },
})
