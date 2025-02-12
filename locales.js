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

  const LOCALE_FORMATS = {
    date: {
      'en': 'MM/DD/YYYY',
      'de': 'DD.MM.YYYY',
      'fr': 'DD/MM/YYYY',
      'es': 'DD/MM/YYYY',
      'it': 'DD/MM/YYYY',
      'ja': 'YYYY/MM/DD',
      'zh_CN': 'YYYY-MM-DD'
    },
    phone: {
      'en': '(###) ###-####',
      'de': '+49 ### #######',
      'fr': '+33 # ## ## ## ##',
      'es': '+34 ### ### ###',
      'it': '+39 ### ### ####',
      'ja': '0#-####-####',
      'zh_CN': '1## #### ####'
    },
    postal: {
      'en': '#####-####',
      'de': '#####',
      'fr': '#####',
      'es': '#####',
      'it': '#####',
      'ja': '###-####',
      'zh_CN': '######'
    }
  };

  const exports = { LOCALES, LOCALE_FORMATS };
  
  if (typeof window !== 'undefined') {
    Object.assign(window, exports);
  } else if (typeof self !== 'undefined') {
    Object.assign(self, exports);
  } else {
    Object.assign(global, exports);
  }
})(this);
