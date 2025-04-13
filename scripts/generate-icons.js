const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputFile = path.join(__dirname, '../public/icon.png');
const outputDir = path.join(__dirname, '../public');

if (!fs.existsSync(inputFile)) {
    console.error('Please add an icon.png file to the public directory');
    process.exit(1);
}

sizes.forEach(size => {
    sharp(inputFile)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
        .then(() => console.log(`Generated icon-${size}x${size}.png`))
        .catch(err => console.error(`Error generating icon-${size}x${size}.png:`, err));
}); 