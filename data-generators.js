(function(window) {
  const { forceEnglishFields, useLocaleFields } = window.FormFillerPatterns || {};

  /**
   * Gets locale with fallback to base locale or English
   * @param {string} locale 
   * @returns {string} effective locale
   */
  function getLocaleWithFallback(locale) {
    console.log('Checking locale:', locale);
    
    // Remove any region suffix for compatibility
    const baseLocale = locale.split('_')[0].toLowerCase();
    console.log('Base locale:', baseLocale);

    // Check if locale is supported
    if (faker.locales[locale]) {
      console.log('Using exact locale:', locale);
      return locale;
    }

    if (faker.locales[baseLocale]) {
      console.log('Using base locale:', baseLocale);
      return baseLocale;
    }

    console.warn(`Locale ${locale} not supported, falling back to English`);
    return 'en';
  }

  /**
   * Executes a callback with temporary locale
   * @param {string} targetLocale 
   * @param {Function} callback 
   * @returns {*} callback result
   */
  function withLocale(targetLocale, callback) {
    console.log('Setting temporary locale:', targetLocale);
    const originalLocale = faker.locale;
    faker.locale = targetLocale;
    try {
      return callback();
    } finally {
      faker.locale = originalLocale;
    }
  }

  /**
   * Generates fake data based on field type and locale
   * @param {string} fieldType 
   * @param {Object} formats 
   * @param {string} locale 
   * @returns {string} generated data
   */
  function generateFieldData(fieldType, formats, locale) {
    console.log(`Generating ${fieldType} data with locale:`, locale);
    
    switch (fieldType) {
      case 'firstName':
        return faker.name.firstName();
      case 'lastName':
        return faker.name.lastName();
      case 'fullName':
        return `${faker.name.firstName()} ${faker.name.lastName()}`;
      case 'company':
        return faker.company.companyName();
      case 'email':
        const emailUser = faker.internet.userName().toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .substring(0, 12);
        const emailProviders = ['gmail.com', 'yahoo.com', 'outlook.com'];
        return `${emailUser}${faker.random.number(999)}@${faker.random.arrayElement(emailProviders)}`;
      case 'phone':
        if (formats.phone?.[locale]) {
          return faker.phone.phoneNumber(formats.phone[locale]);
        }
        switch (locale) {
          case 'en':
            return faker.phone.phoneNumber('(###) ###-####');
          case 'de':
            return faker.phone.phoneNumber('+49 ### #######');
          default:
            return faker.phone.phoneNumber('### ### ####');
        }
      case 'streetAddress':
        return `${faker.address.streetAddress()} ${faker.address.streetName()}`;
      case 'address2':
        return faker.address.secondaryAddress();
      case 'address':
        const zip = locale === 'de' ? faker.address.zipCode('#####') : faker.address.zipCode();
        return `${faker.address.streetAddress()} ${faker.address.streetName()}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${zip}`;
      case 'city':
        return faker.address.city();
      case 'state':
        return locale === 'en' ? faker.address.state() : faker.address.state();
      case 'zipCode':
        switch (locale) {
          case 'de':
            return faker.address.zipCode('#####');
          case 'fr':
            return faker.address.zipCode('#####');
          case 'uk':
            return faker.address.zipCode('??# #??').toUpperCase();
          case 'ca':
            return faker.address.zipCode('?#? #?#').toUpperCase();
          default:
            return faker.address.zipCode('#####');
        }
      case 'number':
        return faker.random.number({ min: 1, max: 1000 }).toString();
      case 'date':
        return faker.date.past(20).toISOString().split('T')[0];
      case 'creditCard':
        const ccTypes = ['visa', 'mastercard', 'amex'];
        return faker.finance.creditCardNumber(faker.random.arrayElement(ccTypes));
      case 'username':
        return faker.internet.userName().toLowerCase()
          .replace(/[^a-z0-9_]/g, '') + 
          faker.random.number({ min: 1, max: 999 });
      case 'password':
        const special = '!@#$%^&*';
        return faker.internet.password(12, true) + 
               special[faker.random.number(special.length - 1)] +
               faker.random.number(99);
      case 'url':
        return faker.internet.url();
      default:
        return faker.lorem.word();
    }
  }

  /**
   * Generates fake data with proper locale handling
   * @param {string} fieldType 
   * @returns {string} generated data
   */
  function generateFakeData(fieldType) {
    try {
      const requestedLocale = faker.locale;
      const effectiveLocale = getLocaleWithFallback(requestedLocale);
      console.log(`Generating ${fieldType} with locale:`, effectiveLocale);

      if (forceEnglishFields && forceEnglishFields.includes(fieldType)) {
        console.log(`Forcing English for ${fieldType}`);
        return withLocale('en', () => generateFieldData(fieldType, {}, 'en'));
      }

      return generateFakeDataForType(fieldType, {}, effectiveLocale);
    } catch (error) {
      console.error(`Error generating ${fieldType}:`, error);
      return '';
    }
  }

  /**
   * Generates fake data with locale handling
   * @param {string} fieldType 
   * @param {Object} formats 
   * @param {string} locale 
   * @returns {string} generated data
   */
  function generateFakeDataForType(fieldType, formats, locale) {
    console.log(`Generating ${fieldType} with locale:`, locale);

    if (forceEnglishFields && forceEnglishFields.includes(fieldType)) {
      return withLocale('en', () => generateFieldData(fieldType, formats, 'en'));
    }

    if (useLocaleFields && useLocaleFields.includes(fieldType)) {
      return withLocale(locale, () => generateFieldData(fieldType, formats, locale));
    }

    return generateFieldData(fieldType, formats, locale);
  }

  // Export to window object
  window.FormFillerGenerators = {
    generateFakeData,
    generateFakeDataForType,
    generateFieldData,
    getLocaleWithFallback,
    withLocale
  };
})(window);
