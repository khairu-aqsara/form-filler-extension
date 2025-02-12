(function(window) {
  const { fieldPatterns } = window.FormFillerPatterns || {};

  /**
   * Extracts field attributes from an input element
   * @param {HTMLInputElement} input
   * @returns {Object} normalized field attributes
   */
  function getFieldAttributes(input) {
    return {
      name: input.name.toLowerCase(),
      type: input.type.toLowerCase(),
      id: input.id.toLowerCase(),
      placeholder: (input.placeholder || '').toLowerCase(),
      'data-type': (input.dataset.type || '').toLowerCase(),
      label: input.labels && input.labels[0] ? input.labels[0].textContent.toLowerCase() : ''
    };
  }

  /**
   * Determines the type of data to generate based on field attributes
   * @param {HTMLInputElement} input
   * @returns {string} field type
   */
  function getFieldType(input) {
    if (!fieldPatterns) {
      console.error('Field patterns not loaded');
      return 'generic';
    }

    const attrs = getFieldAttributes(input);

    // First check data-type attribute for explicit type hints
    if (attrs['data-type']) {
      return attrs['data-type'];
    }

    // Check all attributes against patterns
    for (const [type, keywords] of Object.entries(fieldPatterns)) {
      if (keywords.some(keyword => 
        Object.values(attrs).some(attr => attr.includes(keyword)))) {
        return type;
      }
    }

    // Default to generic text
    return 'generic';
  }

  /**
   * Triggers validation events on a field
   * @param {HTMLElement} field 
   */
  function triggerFieldValidation(field) {
    const events = ['input', 'change', 'blur', 'keyup'];
    events.forEach(eventType => {
      field.dispatchEvent(new Event(eventType, { bubbles: true }));
    });
  }

  // Export to window object
  window.FormFillerDetection = {
    getFieldType,
    getFieldAttributes,
    triggerFieldValidation
  };
})(window);
