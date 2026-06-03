import { handleRange, injectDownloadButton } from './handlers';

function registerListeners(): void {
  document.addEventListener('mouseup', handleRange);
  injectDownloadButton();
}

function unregisterListeners(): void {
  document.removeEventListener('mouseup', handleRange);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerListeners);
} else {
  registerListeners();
}

window.addEventListener('beforeunload', unregisterListeners);
