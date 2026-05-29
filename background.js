// ── Badge counter ────────────────────────────────────────────
function updateBadge(steps) {
  const count = steps?.length || 0;
  chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#a78bfa' });
}

// Sync badge whenever storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes['acState']) {
    updateBadge(changes['acState'].newValue?.steps);
  }
});

// Init badge on service worker startup
chrome.storage.local.get('acState', data => updateBadge(data['acState']?.steps));

// ── Auto-inject content script on every page load ────────────
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] })
      .catch(() => {});
  }
});
