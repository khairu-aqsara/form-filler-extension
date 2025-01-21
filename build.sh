#!/bin/bash

# Create dist directory
mkdir -p dist

# Minify JavaScript files
terser background.js -o dist/background.min.js
terser content.js -o dist/content.min.js
terser locales.js -o dist/locales.min.js
terser faker.js -o dist/faker.min.js

# Copy other required files
cp manifest.json dist/
cp slack.png dist/
cp README.md dist/

# Create production zip
cd dist
zip -r ../form-auto-fill.zip *
cd ..

echo "Production build complete: form-auto-fill.zip"
