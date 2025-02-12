# Form Auto Fill Chrome Extension v1.4

A Chrome/Edge extension that automatically fills forms with realistic fake data using Faker.js.

<p align="center">
   <img src="chrome.png" alt="Chrome Extension" width="400"/>
   <img src="edge.png" alt="Edge Extension" width="400"/>
</p>

## Features

- Right-click context menu to trigger form filling
- Generates realistic fake data for common form fields
- Supports various field types (name, email, phone, address, etc.)
- Intelligent field type detection based on input attributes

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select this directory
7. The extension should now appear in your Chrome toolbar

The extension uses a custom icon in the Chrome toolbar.

## Usage

1. Navigate to any webpage with a form
2. Right-click anywhere on the page
3. Select "Fill Form with Faker Data" from the context menu
4. Watch as the form fields are automatically filled with realistic data

## Test the Extension

1. Open the included `test.html` file in Chrome
2. Right-click anywhere on the page
3. Select "Fill Form with Faker Data" from the context menu
4. All form fields should be filled with realistic fake data

## Supported Field Types

- First Name
- Last Name
- Email
- Phone Number
- Company Name
- Street Address
- City
- State
- Zip Code
- Generic Text (for unrecognized fields)

## Building the Extension

1. Install Terser for JavaScript minification:
   ```bash
   npm install -g terser
   ```

2. Run the build script:
   ```bash
   ./build.sh
   ```

3. The built files will be in the `dist/` directory
4. A production zip file `form-auto-fill.zip` will be created

## Development

To modify and test the extension:

1. Make your changes to the source files:
   - `background.js` - Background service worker
   - `content.js` - Content script logic
   - `faker.js` - Faker library
   - `locales.js` - Localization data

2. Rebuild the extension:
   ```bash
   ./build.sh
   ```

3. Reload the extension in Chrome:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the Form Auto Fill extension

4. Test your changes using the included `test.html` file

The extension consists of the following files:

- `manifest.json` - Extension configuration
- `background.js` - Handles context menu creation and click events
- `content.js` - Contains form filling logic
- `faker.js` - The Faker.js library for generating fake data
- `test.html` - A test form to demonstrate the extension
- v1.1: Fixed message passing issue and added scripting permission

## Changelog

### v1.4
- Added support for number, date, color and password input fields
- Implemented dynamic module loading
- Enhanced form filling capabilities
- Added additional language support
- Improved locale configurations

### v1.3
- Initial release with basic form filling capabilities
