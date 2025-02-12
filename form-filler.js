(function(window) {
  const { getFieldType, triggerFieldValidation } = window.FormFillerDetection || {};
  const { generateFakeData } = window.FormFillerGenerators || {};

  /**
   * Handles filling all form fields with fake data
   */
  class FormFiller {
    /**
     * Fill all form fields with appropriate fake data
     */
    fillAllFields() {
      if (!getFieldType || !generateFakeData || !triggerFieldValidation) {
        console.error('Required form filler dependencies not loaded');
        throw new Error('Required form filler dependencies not loaded');
      }

      // Store current locale
      const locale = faker.locale;
      console.log('FormFiller using locale:', locale);

      try {
        this.fillTextInputs(locale);
        this.fillTextareas(locale);
        this.fillRadioGroups(locale);
        this.fillCheckboxes(locale);
        this.fillSelects(locale);
      } catch (error) {
        console.error('Error filling form fields:', error);
        throw error;
      }
    }

    /**
     * Fill text-like input fields
     */
    fillTextInputs(locale) {
      const textInputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], ' +
        'input[type="number"], input[type="date"], input[type="color"], ' +
        'input[type="password"]'
      );

      textInputs.forEach(input => {
        const fieldType = getFieldType(input);
        console.log(`Field ${input.name || input.id}: detected as ${fieldType}, locale: ${locale}`);
        const fakeData = generateFakeData(fieldType);
        input.value = fakeData;
        triggerFieldValidation(input);
      });
    }

    /**
     * Fill textarea fields with paragraphs
     */
    fillTextareas(locale) {
      document.querySelectorAll('textarea').forEach(textarea => {
        faker.locale = locale;
        textarea.value = faker.lorem.paragraph();
        triggerFieldValidation(textarea);
      });
    }

    /**
     * Fill radio button groups
     */
    fillRadioGroups(locale) {
      const radioGroups = {};
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (!radioGroups[radio.name]) {
          radioGroups[radio.name] = [];
        }
        radioGroups[radio.name].push(radio);
      });

      faker.locale = locale;
      Object.values(radioGroups).forEach(group => {
        const randomRadio = faker.random.arrayElement(group);
        randomRadio.checked = true;
        triggerFieldValidation(randomRadio);
      });
    }

    /**
     * Fill checkbox fields
     */
    fillCheckboxes(locale) {
      faker.locale = locale;
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = faker.random.number(100) < 70; // 70% chance of being checked
        triggerFieldValidation(checkbox);
      });
    }

    /**
     * Fill select dropdowns
     */
    fillSelects(locale) {
      faker.locale = locale;
      document.querySelectorAll('select').forEach(select => {
        const options = Array.from(select.options).filter(option => option.value);
        if (options.length) {
          const randomOption = faker.random.arrayElement(options);
          select.value = randomOption.value;
          triggerFieldValidation(select);
        }
      });
    }
  }

  // Export to window object
  window.FormFiller = FormFiller;
})(window);
