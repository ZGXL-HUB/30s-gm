const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Function to convert WebP to PNG
async function convertWebpToPng(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .png()
      .toFile(outputPath);
    console.log(`Converted: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
  }
}

// Function to find all WebP files recursively
function findWebpFiles(dir) {
  const webpFiles = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (path.extname(item).toLowerCase() === '.webp') {
        webpFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return webpFiles;
}

// Main function
async function main() {
  const currentDir = process.cwd();
  const webpFiles = findWebpFiles(currentDir);
  
  console.log(`Found ${webpFiles.length} WebP files to convert`);
  
  for (const webpFile of webpFiles) {
    const pngFile = webpFile.replace(/\.webp$/i, '.png');
    await convertWebpToPng(webpFile, pngFile);
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
