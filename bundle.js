// Load modules dynamically
(async function() {
  try {
    // Helper function to load script
    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(src);
        script.type = 'text/javascript';
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        (document.head || document.documentElement).appendChild(script);
      });
    }

    // Load dependencies in order
    await loadScript('faker.js');
    await loadScript('locales.js');
    await loadScript('field-patterns.js');
    await loadScript('field-detection.js');
    await loadScript('data-generators.js');
    await loadScript('form-filler.js');
    await loadScript('content-script.js');

    console.log('Form Filler modules loaded successfully');
  } catch (error) {
    console.error('Error loading Form Filler modules:', error);
  }
})();
