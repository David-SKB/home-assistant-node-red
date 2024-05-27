const fs = require('fs');
const path = require('path');

function createFileSync(file_path, content, options = 'utf8') {

  const dir = path.dirname(file_path);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(file_path, content, options);
  
  return {file: file_path, data: content};

}

module.exports = createFileSync;
