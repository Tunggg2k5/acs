const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.endsWith('.tsx')) {
    let c = fs.readFileSync(path.join(dir, f), 'utf8');
    c = c.replace(/<input([^>]*?)value="([^"]*)"/gi, '<input$1defaultValue="$2"');
    c = c.replace(/<textarea([^>]*?)value="([^"]*)"/gi, '<textarea$1defaultValue="$2"');
    fs.writeFileSync(path.join(dir, f), c, 'utf8');
  }
});
console.log('Fixed inputs');
