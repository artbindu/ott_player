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

// Copy HTML file
try {
    fs.copyFileSync('index.html', path.join(buildDir, 'index.html'));
    console.log('✅ Copied index.html');
} catch (error) {
    console.error('❌ Error copying index.html:', error.message);
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
    execSync('npx uglifyjs script/utils.js script/media.js -o dist/script/media.min.js --compress --mangle', { stdio: 'inherit' });
    console.log('✅ Minified JavaScript');
} catch (error) {
    console.error('❌ Error minifying JavaScript:', error.message);
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
    let htmlContent = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

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
    console.log('✅ Updated HTML references');
} catch (error) {
    console.error('❌ Error updating HTML references:', error.message);
}

console.log('\n🎉 Build completed successfully!');
console.log('📁 Build output available in: ./dist/');
