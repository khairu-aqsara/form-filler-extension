// Shared locales configuration
(function(global) {
  const LOCALES = [
    { code: 'de', name: 'German' },
    { code: 'de_AT', name: 'German (Austria)' },
    { code: 'de_CH', name: 'German (Switzerland)' },
    { code: 'en', name: 'English' },
    { code: 'en_AU', name: 'English (Australia)' },
    { code: 'en_BORK', name: 'English (Bork)' },
    { code: 'en_CA', name: 'English (Canada)' },
    { code: 'en_GB', name: 'English (Great Britain)' },
    { code: 'en_IE', name: 'English (Ireland)' },
    { code: 'en_IND', name: 'English (India)' },
    { code: 'en_US', name: 'English (United States)' },
    { code: 'en_au_ocker', name: 'English (Ocker)' },
    { code: 'es', name: 'Spanish' },
    { code: 'es_MX', name: 'Spanish (Mexico)' },
    { code: 'fa', name: 'Farsi' },
    { code: 'fr', name: 'French' },
    { code: 'fr_CA', name: 'French (Canada)' },
    { code: 'ge', name: 'Georgian' },
    { code: 'id_ID', name: 'Indonesian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'nb_NO', name: 'Norwegian Bokmål' },
    { code: 'nep', name: 'Nepali' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt_BR', name: 'Portuguese (Brazil)' },
    { code: 'ru', name: 'Russian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sv', name: 'Swedish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'zh_CN', name: 'Chinese (China)' },
    { code: 'zh_TW', name: 'Chinese (Taiwan)' }
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
