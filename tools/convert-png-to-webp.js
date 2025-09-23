const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Function to convert PNG to WebP
async function convertPngToWebp(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85, lossless: true })
      .toFile(outputPath);
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
  }
}

// Function to find all PNG files recursively
function findPngFiles(dir) {
  const pngFiles = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (path.extname(item).toLowerCase() === '.png') {
        pngFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return pngFiles;
}

// Main function
async function main() {
  const currentDir = process.cwd();
  const pngFiles = findPngFiles(currentDir);
  
  console.log(`Found ${pngFiles.length} PNG files to convert`);
  
  for (const pngFile of pngFiles) {
    const webpFile = pngFile.replace(/\.png$/i, '.webp');
    await convertPngToWebp(pngFile, webpFile);
  }
  
  console.log('Conversion completed!');
}

// Check if sharp is installed
try {
  require('sharp');
  main().catch(console.error);
} catch (error) {
  console.log('Sharp library not found. Installing...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install sharp', { stdio: 'inherit' });
    console.log('Sharp installed successfully. Running conversion...');
    main().catch(console.error);
  } catch (installError) {
    console.error('Failed to install sharp:', installError.message);
    console.log('Please run: npm install sharp');
  }
}
