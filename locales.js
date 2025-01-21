// Shared locales configuration
(function(global) {
  const LOCALES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh_CN', name: 'Chinese' },
    { code: 'pt_BR', name: 'Portuguese (Brazil)' },
    { code: 'ru', name: 'Russian' }
  ];

  // Expose LOCALES to the appropriate global object
  if (typeof window !== 'undefined') {
    // Content script context (has window)
    window.LOCALES = LOCALES;
  } else if (typeof self !== 'undefined') {
    // Service worker context (has self)
    self.LOCALES = LOCALES;
  } else {
    // Fallback
    global.LOCALES = LOCALES;
  }
})(this);
