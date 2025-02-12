// Field detection patterns for form auto-fill
(function(window) {
  const fieldPatterns = {
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

  // Fields that should always use English locale
  const forceEnglishFields = ['email', 'username', 'password', 'url'];

  // Fields that should use the requested locale
  const useLocaleFields = [
    'firstName', 'lastName', 'fullName', 'company',
    'streetAddress', 'address2', 'city', 'state', 'zipCode'
  ];

  // Export to window object
  window.FormFillerPatterns = {
    fieldPatterns,
    forceEnglishFields,
    useLocaleFields
  };
})(window);
