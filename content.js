(function() {
  let initializeAttempts = 0;
  const maxAttempts = 3;

  function ensureDependencies() {
    return new Promise((resolve, reject) => {
      function checkDependencies() {
        if (typeof faker !== 'undefined' && window.LOCALES) {
          resolve();
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

  // Function to determine the type of data to generate based on field attributes
  function getFieldType(input) {
    const attrs = {
      name: input.name.toLowerCase(),
      type: input.type.toLowerCase(),
      id: input.id.toLowerCase(),
      placeholder: (input.placeholder || '').toLowerCase(),
      'data-type': (input.dataset.type || '').toLowerCase(),
      label: input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : ''
    };

    // First check data-type attribute for explicit type hints
    if (attrs['data-type']) {
      return attrs['data-type'];
    }

    // Check common patterns
    const patterns = {
      firstName: ['firstname', 'first-name', 'first_name', 'first name', 'given name', 'givenname'],
      lastName: ['lastname', 'last-name', 'last_name', 'last name', 'surname', 'family name'],
      fullName: ['fullname', 'full-name', 'full_name', 'full name', 'name'],
      company: ['company', 'organization', 'organisation', 'business', 'employer', 'company-name', 'company_name'],
      streetAddress: [
        'street', 'address', 'addr', 'address1', 'street-address', 'street_address',
        'address-line1', 'address_line1', 'street-line', 'street_line'
      ],
      address2: [
        'address2', 'address-line2', 'address_line2', 'apartment', 'apt', 'suite', 'unit',
        'building', 'floor'
      ],
      city: ['city', 'town', 'municipality', 'suburb', 'district', 'city-name', 'city_name'],
      state: [
        'state', 'province', 'region', 'territory', 'prefecture',
        'state-name', 'state_name', 'province-name', 'province_name'
      ],
      zipCode: [
        'zip', 'zipcode', 'zip-code', 'zip_code', 'postal', 'postal-code',
        'postal_code', 'postcode', 'post-code', 'post_code'
      ],
      number: ['number', 'quantity', 'amount', 'price'],
      date: ['date', 'dob', 'birthday'],
      color: ['color', 'colour'],
      password: ['password', 'pwd', 'pass'],
      email: ['email', 'e-mail'],
      phone: ['phone', 'mobile', 'tel', 'cellular', 'telephone'],
      username: ['username', 'user', 'login', 'userid', 'user-id', 'user_id'],
      url: ['url', 'website', 'web', 'site'],
      creditCard: ['card', 'credit', 'cc-number', 'card-number', 'card_number']
    };

    // Check all attributes against patterns
    for (const [type, keywords] of Object.entries(patterns)) {
      if (keywords.some(keyword => 
        Object.values(attrs).some(attr => attr.includes(keyword)))) {
        return type;
      }
    }

    // Default to generic text
    return 'generic';
  }

  // Ensure Faker is properly initialized
  if (typeof faker === 'undefined' || !faker.name) {
    throw new Error('Faker.js not properly initialized. Please check if faker.js is loaded correctly.');
  }

  function getLocaleWithFallback(locale) {
    const exactLocale = faker.locales[locale] ? locale : null;
    if (exactLocale) return exactLocale;

    const baseLocale = locale.split('_')[0];
    if (faker.locales[baseLocale]) return baseLocale;

    console.warn(`Locale ${locale} not supported, falling back to English`);
    return 'en';
  }

  function withLocale(targetLocale, callback) {
    const originalLocale = faker.locale;
    faker.locale = targetLocale;
    try {
      return callback();
    } finally {
      faker.locale = originalLocale;
    }
  }

  function generateFakeData(fieldType) {
    try {
      const requestedLocale = faker.locale;
      const effectiveLocale = getLocaleWithFallback(requestedLocale);
      faker.locale = effectiveLocale;
      const formats = window.LOCALE_FORMATS || {};

      const prevLocale = faker.locale;
      const latinOnlyFields = ['email', 'username', 'password', 'url'];
      if (latinOnlyFields.includes(fieldType)) {
        faker.locale = 'en';
      }

      const result = generateFakeDataForType(fieldType, formats, effectiveLocale);
      faker.locale = prevLocale;
      return result;
    } catch (error) {
      console.error(`Error generating ${fieldType}:`, error);
      return '';
    }
  }

  function generateFakeDataForType(fieldType, formats, locale) {
    const forceEnglishFields = ['email', 'username', 'password', 'url'];
    const useLocaleFields = [
      'firstName', 'lastName', 'fullName', 'company',
      'streetAddress', 'address2', 'city', 'state', 'zipCode'
    ];

    if (forceEnglishFields.includes(fieldType)) {
      return withLocale('en', () => generateFieldData(fieldType, formats, 'en'));
    }

    if (useLocaleFields.includes(fieldType)) {
      return withLocale(locale, () => generateFieldData(fieldType, formats, locale));
    }

    return generateFieldData(fieldType, formats, locale);
  }

  function generateFieldData(fieldType, formats, locale) {
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
        const input = document.activeElement;
        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 1000;
        return faker.random.number({ min, max });
      case 'date':
        const today = new Date();
        if (input.min || input.max) {
          const minDate = input.min ? new Date(input.min) : new Date(1970, 0, 1);
          const maxDate = input.max ? new Date(input.max) : today;
          return faker.date.between(minDate, maxDate).toISOString().split('T')[0];
        }
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

  function triggerFieldValidation(field) {
    const events = ['input', 'change', 'blur', 'keyup'];
    events.forEach(eventType => {
      field.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
  }

  function fillFormFields() {
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], input[type="color"], input[type="password"]');
    textInputs.forEach(input => {
      const fieldType = getFieldType(input);
      console.log(`Field ${input.name || input.id}: detected as ${fieldType}`);
      const fakeData = generateFakeData(fieldType);
      input.value = fakeData;
      triggerFieldValidation(input);
    });

    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.value = faker.lorem.paragraph();
      triggerFieldValidation(textarea);
    });

    const radioGroups = {};
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      if (!radioGroups[radio.name]) {
        radioGroups[radio.name] = [];
      }
      radioGroups[radio.name].push(radio);
    });

    Object.values(radioGroups).forEach(group => {
      const randomRadio = faker.random.arrayElement(group);
      randomRadio.checked = true;
      triggerFieldValidation(randomRadio);
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = faker.random.number(100) < 70;
      triggerFieldValidation(checkbox);
    });

    document.querySelectorAll('select').forEach(select => {
      const options = Array.from(select.options).filter(option => option.value);
      if (options.length) {
        const randomOption = faker.random.arrayElement(options);
        select.value = randomOption.value;
        triggerFieldValidation(select);
      }
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    ensureDependencies()
      .then(() => {
        if (request.action === "fillForm") {
          const requestedLocale = request.locale || 'en';
          const effectiveLocale = getLocaleWithFallback(requestedLocale);
          
          if (effectiveLocale !== requestedLocale) {
            console.warn(`Using ${effectiveLocale} as fallback for ${requestedLocale}`);
          }

          faker.locale = effectiveLocale;
          fillFormFields();
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
    
    return true;
  });

})();
