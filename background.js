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

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  try {
    // Validate tab exists
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    // Extract locale from menu item ID
    const locale = info.menuItemId.split('-')[1] || 'en';

    // Execute the content script first to ensure it's loaded
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['faker.js', 'content.js']
    }).then(() => {
      // Then send the message with locale
      chrome.tabs.sendMessage(tab.id, {
        action: "fillForm",
        locale: locale
      }, (response) => {
        // Handle response from content script
        if (chrome.runtime.lastError) {
          console.error('Message failed:', chrome.runtime.lastError);
          return;
        }
        if (!response?.success) {
          console.error('Form fill failed:', response?.error || 'Unknown error');
        }
      });
    }).catch(err => {
      console.error('Failed to execute content script:', err);
      throw err;
    });
  } catch (error) {
    console.error('Context menu handler error:', error);
  }
});
