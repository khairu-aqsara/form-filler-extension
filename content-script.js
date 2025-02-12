// Content script initialization
console.log('Content script loaded');

// Set up message listener immediately
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === "fillForm") {
    try {
      // Set faker locale before initializing form filler
      const locale = request.locale || 'en';
      console.log('Setting faker locale to:', locale);
      
      // Set the locale directly on faker object
      faker.locale = locale;
      console.log('Current faker locale:', faker.locale);
      
      // Initialize form filler and fill fields
      const formFiller = new window.FormFiller();
      formFiller.fillAllFields();
      
      sendResponse({ 
        success: true,
        message: `Form filled successfully using locale: ${locale}`,
        usedLocale: faker.locale
      });
    } catch (error) {
      console.error('Error filling form:', error);
      sendResponse({ 
        success: false, 
        error: error.message,
        stack: error.stack
      });
    }
  }
  
  return true; // Keep channel open for async response
});

// Send ready message to background script
chrome.runtime.sendMessage({
  action: 'contentScriptReady'
}).catch(error => {
  console.error('Error sending ready message:', error);
});

// Log any errors
window.addEventListener('error', (event) => {
  console.error('Content script error:', event.error);
});
