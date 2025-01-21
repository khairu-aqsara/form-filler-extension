// Function to determine the type of data to generate based on field attributes
function getFieldType(input) {
  const name = input.name.toLowerCase();
  const type = input.type.toLowerCase();
  const id = input.id.toLowerCase();
  
  // Check for email fields
  if (type === 'email' || name.includes('email') || id.includes('email')) {
    return 'email';
  }
  
  // Check for phone fields
  if (type === 'tel' || name.includes('phone') || name.includes('mobile') || 
      id.includes('phone') || id.includes('mobile')) {
    return 'phone';
  }
  
  // Check for name fields
  if (name.includes('name') || id.includes('name')) {
    if (name.includes('first') || id.includes('first')) {
      return 'firstName';
    }
    if (name.includes('last') || id.includes('last')) {
      return 'lastName';
    }
    return 'fullName';
  }
  
  // Check for address fields
  if (name.includes('address') || id.includes('address')) {
    if (name.includes('street') || id.includes('street')) {
      return 'streetAddress';
    }
    return 'address';
  }
  
  // Check for city fields
  if (name.includes('city') || id.includes('city')) {
    return 'city';
  }
  
  // Check for state fields
  if (name.includes('state') || id.includes('state')) {
    return 'state';
  }
  
  // Check for zip/postal code fields
  if (name.includes('zip') || name.includes('postal') || 
      id.includes('zip') || id.includes('postal')) {
    return 'zipCode';
  }
  
  // Check for company fields
  if (name.includes('company') || name.includes('organization') || 
      id.includes('company') || id.includes('organization')) {
    return 'company';
  }
  
  // Default to generic text
  return 'generic';
}

// Ensure Faker is properly initialized
if (typeof faker === 'undefined' || !faker.name) {
  throw new Error('Faker.js not properly initialized. Please check if faker.js is loaded correctly.');
}

// Function to generate fake data based on field type
function generateFakeData(fieldType) {
  switch (fieldType) {
    case 'email':
      // Mailinator domains
      const mailinatorDomains = [
        'mailinator.com',
        'mailinator.net',
        'mailinator.org',
        'mailinator2.com',
        'mailinator2.net',
        'mailinator2.org'
      ];
      // Generate username using Faker
      const username = faker.internet.userName().toLowerCase().replace(/[^a-z0-9]/g, '');
      // Select random Mailinator domain
      const domain = faker.random.arrayElement(mailinatorDomains);
      return `${username}@${domain}`;
    case 'phone':
      return faker.phone.phoneNumber();
    case 'firstName':
      return faker.name.firstName();
    case 'lastName':
      return faker.name.lastName();
    case 'fullName':
      return faker.name.findName();
    case 'streetAddress':
      return faker.address.streetAddress();
    case 'address':
      return faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + 
             faker.address.stateAbbr() + ' ' + faker.address.zipCode();
    case 'city':
      return faker.address.city();
    case 'state':
      return faker.address.stateAbbr();
    case 'zipCode':
      return faker.address.zipCode();
    case 'company':
      return faker.company.companyName();
    default:
      return faker.lorem.word();
  }
}

// Function to fill all form fields
function fillFormFields() {
  // Handle text inputs and email
  const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  textInputs.forEach(input => {
    const fieldType = getFieldType(input);
    const fakeData = generateFakeData(fieldType);
    input.value = fakeData;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Handle textarea with longer content
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.value = faker.lorem.paragraph();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Handle radio buttons - select one option randomly from each radio group
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
    randomRadio.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Handle checkboxes - randomly check/uncheck each checkbox
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    // 70% chance of being checked
    checkbox.checked = faker.random.number(100) < 70;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Handle select dropdowns - select random option for each select
  document.querySelectorAll('select').forEach(select => {
    const options = Array.from(select.options).filter(option => option.value); // Filter out empty value options
    if (options.length) {
      const randomOption = faker.random.arrayElement(options);
      select.value = randomOption.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === "fillForm") {
      // Validate LOCALES exists
      if (!window.LOCALES) {
        throw new Error('LOCALES not loaded');
      }

      // Set locale if provided, default to 'en'
      if (request.locale && window.LOCALES.some(locale => locale.code === request.locale)) {
        faker.locale = request.locale;
      } else {
        faker.locale = 'en';
      }
      
      // Fill form fields and send success response
      fillFormFields();
      sendResponse({ success: true });
    }
  } catch (error) {
    console.error('Form fill error:', error);
    sendResponse({ 
      success: false,
      error: error.message 
    });
  }
  
  // Return true to keep message channel open for async response
  return true;
});
