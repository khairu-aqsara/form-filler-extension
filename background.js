// Service worker initialization
const SCRIPTS_TO_INJECT = [
  'faker.js',
  'locales.js',
  'field-patterns.js',
  'field-detection.js',
  'data-generators.js',
  'form-filler.js',
  'content-script.js'
];

// Available locales
const LOCALES = [
  { id: 'en', title: 'English (US)' },
  { id: 'de', title: 'German (Deutsch)' },
  { id: 'fr', title: 'French (Français)' },
  { id: 'es', title: 'Spanish (Español)' },
  { id: 'it', title: 'Italian (Italiano)' },
  { id: 'ja', title: 'Japanese (日本語)' },
  { id: 'ko', title: 'Korean (한국어)' },
  { id: 'zh_CN', title: 'Chinese (中文)' }
];

// Track tabs where scripts are injected
const injectedTabs = new Set();

// Helper function to inject scripts
async function injectScripts(tabId) {
  if (injectedTabs.has(tabId)) {
    console.log('Scripts already injected in tab:', tabId);
    return;
  }

  console.log('Injecting scripts into tab:', tabId);
  try {
    for (const script of SCRIPTS_TO_INJECT) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: [script]
      });
      console.log(`Injected ${script}`);
    }
    injectedTabs.add(tabId);
  } catch (error) {
    console.error('Error injecting scripts:', error);
    throw error;
  }
}

// Create context menu when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  try {
    // Create parent menu
    chrome.contextMenus.create({
      id: 'fillFormParent',
      title: 'Fill Form with Faker Data',
      contexts: ['page', 'selection']
    });

    // Create locale sub-menus
    LOCALES.forEach(locale => {
      chrome.contextMenus.create({
        id: `fillForm_${locale.id}`,
        parentId: 'fillFormParent',
        title: locale.title,
        contexts: ['page', 'selection']
      });
    });
  } catch (error) {
    console.error('Error creating context menu:', error);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id) return;

  try {
    console.log('Menu clicked:', info.menuItemId);
    
    // Extract locale from menu item ID
    const menuLocale = info.menuItemId.replace('fillForm_', '');
    const localeConfig = LOCALES.find(l => l.id === menuLocale);
    
    if (!localeConfig) {
      console.error('Invalid locale:', menuLocale);
      return;
    }

    console.log('Using locale:', localeConfig.id);

    // Ensure scripts are injected
    await injectScripts(tab.id);

    // Wait a moment for scripts to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Send the fill form message with the selected locale
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'fillForm',
      locale: localeConfig.id
    });

    console.log('Form fill response:', response);
  } catch (error) {
    console.error('Error handling form fill:', error);
  }
});

// Listen for content script ready messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'contentScriptReady') {
    console.log('Content script ready in tab:', sender.tab?.id);
    if (sender.tab?.id) {
      injectedTabs.add(sender.tab.id);
    }
  }
  return false;
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    injectedTabs.delete(tabId);
  }
});

// Handle tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  injectedTabs.delete(tabId);
});

// Keep service worker alive
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
