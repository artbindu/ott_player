#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create build directory
const buildDir = 'dist';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    console.log('✅ Created build directory');
}

// Copy favicon
try {
    fs.copyFileSync('favicon.ico', path.join(buildDir, 'favicon.ico'));
    console.log('✅ Copied favicon.ico');
} catch (error) {
    console.error('❌ Error copying favicon.ico:', error.message);
}

// Copy data directory
try {
    fs.cpSync('data', path.join(buildDir, 'data'), { recursive: true, force: true });
    console.log('✅ Copied data directory');
} catch (error) {
    console.error('❌ Error copying data directory:', error.message);
}

// Minify CSS
try {
    execSync('npx cleancss -o dist/style/media.min.css style/media.css', { stdio: 'inherit' });
    console.log('✅ Minified CSS');
} catch (error) {
    console.error('❌ Error minifying CSS:', error.message);
}

// Minify JavaScript
try {
    // Create script directory if it doesn't exist
    const scriptDir = path.join(buildDir, 'script');
    if (!fs.existsSync(scriptDir)) {
        fs.mkdirSync(scriptDir, { recursive: true });
    }
    execSync('npx uglifyjs script/media.js -o dist/script/media.min.js --compress --mangle', { stdio: 'inherit' });
    console.log('✅ Minified JavaScript');
    
    // Obfuscate the minified JavaScript
    execSync('npx javascript-obfuscator dist/script/media.min.js --output dist/script/media.min.js --compact true --control-flow-flattening true', { stdio: 'inherit' });
    console.log('✅ Obfuscated JavaScript');
} catch (error) {
    console.error('❌ Error minifying/obfuscating JavaScript:', error.message);
    // Fallback: copy original JS file if minification fails
    try {
        fs.copyFileSync('script/media.js', path.join(buildDir, 'script', 'media.js'));
        console.log('✅ Copied original JavaScript file as fallback');
    } catch (fallbackError) {
        console.error('❌ Error copying fallback JavaScript file:', fallbackError.message);
    }
}

// Update HTML to reference minified files
try {
    let htmlContent = fs.readFileSync('index.html', 'utf8');

    // Update CSS reference
    htmlContent = htmlContent.replace(
        'style/media.css',
        'style/media.min.css'
    );

    // Update JS reference
    htmlContent = htmlContent.replace(
        'script/media.js',
        'script/media.min.js'
    );

    fs.writeFileSync(path.join(buildDir, 'index.html'), htmlContent);
    console.log('✅ Created and updated index.html with minified references');
} catch (error) {
    console.error('❌ Error updating HTML references:', error.message);
}

console.log('\n🎉 Build completed successfully!');
console.log('📁 Build output available in: ./dist/');
