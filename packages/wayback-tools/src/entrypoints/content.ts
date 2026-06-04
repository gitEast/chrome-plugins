import { defineContentScript } from 'wxt/utils/define-content-script'
import { downloadInterceptor } from '@/logic/dom/interceptor'

export default defineContentScript({
  matches: [
    // 匹配 web.achieve.org 下任意时间戳备份的 ao3/works/ 页面
    'https://web.archive.org/web/*/https://archiveofourown.org/works/*',
    'file:///F:/Rizzoli%20&%20Isles/*',
  ],
  async main() {
    downloadInterceptor()
  },
})
