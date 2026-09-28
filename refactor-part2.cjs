const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');

const files = fs.readdirSync(pagesDir);
files.forEach(f => {
  if (f.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
    
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) {
      let mainContent = mainMatch[1];
      
      const hasModalOrDrawer = mainContent.includes('<aside') || mainContent.includes('fixed inset-0');

      if (hasModalOrDrawer) {
        // Add onClick to Close buttons
        mainContent = mainContent.replace(/<button([^>]*)title="Đóng panel"([^>]*)>/g, '<button$1title="Đóng panel" onClick={() => setIsVisible(false)}$2>');
        
        mainContent = mainContent.replace(/(<button[^>]*class(?:Name)?="[^"]*")[^>]*>(?=\s*<span[^>]*>close<\/span>)/g, '$1 onClick={() => setIsVisible(false)}>');
        
        // Add style to hide/show the drawer/modal root
        mainContent = mainContent.replace(/(<aside)([^>]*xl:w-\[380px\][^>]*>)/g, '$1 style={{ display: isVisible ? "" : "none" }} $2');
        mainContent = mainContent.replace(/(<div)([^>]*class(?:Name)?="[^"]*fixed inset-0[^"]*"[^>]*>)/g, '$1 style={{ display: isVisible ? "" : "none" }} $2');
        
        // Add onClick to Open buttons
        mainContent = mainContent.replace(/(<button[^>]*title="Xem chi tiết"[^>]*)>/g, '$1 onClick={() => setIsVisible(true)}>');
        mainContent = mainContent.replace(/(<button[^>]*title="Chỉnh sửa"[^>]*)>/g, '$1 onClick={() => setIsVisible(true)}>');
        mainContent = mainContent.replace(/(<button[^>]*title="Thêm[^"]*"[^>]*)>/g, '$1 onClick={() => setIsVisible(true)}>');
        mainContent = mainContent.replace(/(<button[^>]*)(?=\s*>\s*<span[^>]*>\+ Thêm[^<]*<\/span>\s*<\/button>)/g, '$1 onClick={() => setIsVisible(true)}');
      }

      let newFileContent = `import React from 'react';\n`;
      if (hasModalOrDrawer) {
        newFileContent += `import { useState } from 'react';\n`;
      }
      newFileContent += `\nexport default function ${f.replace('.tsx', '')}() {\n`;
      if (hasModalOrDrawer) {
        newFileContent += `  const [isVisible, setIsVisible] = useState(false);\n`;
      }
      newFileContent += `  return (\n    <>\n      ${mainContent}\n    </>\n  );\n}\n`;
      
      fs.writeFileSync(path.join(pagesDir, f), newFileContent);
      console.log(`Updated ${f}`);
    }
  }
});
