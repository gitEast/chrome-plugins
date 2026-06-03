import { defineContentScript } from 'wxt/utils/define-content-script';

export default defineContentScript({
  matches: ['https://www.fanfiction.net/*'],
  main() {
    console.log(123);
  }
});
