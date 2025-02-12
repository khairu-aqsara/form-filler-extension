// Import locales.js
importScripts('locales.js');

// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  // Create parent menu
  chrome.contextMenus.create({
    id: "fillForm",
    title: "Fill Form with Faker Data",
    contexts: ["page", "editable"]
  });

  // Create locale submenu items
  LOCALES.forEach(locale => {
    chrome.contextMenus.create({
      id: `fillForm-${locale.code}`,
      parentId: "fillForm",
      title: locale.name,
      contexts: ["page", "editable"]
    });
  });
});

function showNotification(message, type = 'info') {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'slack.png',
    title: 'Form Filler',
    message: message
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) {
    showNotification('No active tab found', 'error');
    return;
  }

  const requestedLocale = info.menuItemId.split('-')[1] || 'en';
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['locales.js', 'faker.js', 'content.js']
  }).then(() => {
    return chrome.tabs.sendMessage(tab.id, {
      action: "fillForm",
      locale: requestedLocale
    });
  }).then(response => {
    if (!response?.success) {
      throw new Error(response?.error || 'Unknown error');
    }
    if (response.usedLocale !== requestedLocale) {
      showNotification(`Form filled using ${response.usedLocale} locale as fallback`);
    } else {
      showNotification('Form filled successfully');
    }
  }).catch(error => {
    console.error('Operation failed:', error);
    showNotification(`Error: ${error.message}`, 'error');
  });
});
