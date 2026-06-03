import { defineContentScript } from 'wxt/utils/define-content-script'
import { handleRange, injectDownloadButton } from '../handlers'

export default defineContentScript({
  matches: ['https://www.fanfiction.net/*'],
  main() {
    function registerListeners(): void {
      document.addEventListener('mouseup', handleRange)
      injectDownloadButton()
    }

    function unregisterListeners(): void {
      document.removeEventListener('mouseup', handleRange)
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', registerListeners)
    } else {
      registerListeners()
    }

    window.addEventListener('beforeunload', unregisterListeners)
  },
})
