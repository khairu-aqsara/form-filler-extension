(function() {
  let initializeAttempts = 0;
  const maxAttempts = 10;

  function ensureDependencies() {
    return new Promise((resolve, reject) => {
      function checkDependencies() {
        if (typeof faker !== 'undefined' && 
            window.FormFillerPatterns &&
            window.FormFillerDetection &&
            window.FormFillerGenerators &&
            window.FormFiller) {
          resolve({
            FormFiller: window.FormFiller,
            generators: window.FormFillerGenerators
          });
        } else if (initializeAttempts < maxAttempts) {
          initializeAttempts++;
          setTimeout(checkDependencies, 100);
        } else {
          reject(new Error('Dependencies failed to load'));
        }
      }
      checkDependencies();
    });
  }

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    ensureDependencies()
      .then(({ FormFiller, generators }) => {
        if (request.action === "fillForm") {
          const requestedLocale = request.locale || 'en';
          const effectiveLocale = generators.getLocaleWithFallback(requestedLocale);
          
          if (effectiveLocale !== requestedLocale) {
            console.warn(`Using ${effectiveLocale} as fallback for ${requestedLocale}`);
          }

          faker.locale = effectiveLocale;
          console.log('Initializing form filler...');
          const formFiller = new FormFiller();
          formFiller.fillAllFields();
          
          sendResponse({ 
            success: true, 
            usedLocale: effectiveLocale 
          });
        }
      })
      .catch(error => {
        console.error('Initialization error:', error);
        sendResponse({ 
          success: false,
          error: error.message 
        });
      });
    
    // Required for async response
    return true;
  });

  // Log ready state
  ensureDependencies()
    .then(() => console.log('Form Filler ready'))
    .catch(error => console.error('Form Filler initialization failed:', error));

})();
