const fs = require('fs');
const path = require('path');

const dir = './collection';
const output = './collection/images.json';

const files = fs
  .readdirSync(dir)
  .filter(file => /\.(png|jpe?g|gif|webp|svg)$/i.test(file) && file !== 'images.json');

fs.writeFileSync(output, JSON.stringify(files, null, 2));
console.log('✅ images.json created with', files.length, 'files');