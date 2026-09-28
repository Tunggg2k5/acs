const fs = require('fs');
const path = require('path');

const srcDirs = [
  '../design1/stitch_acs_internal_management_system',
  '../design2/stitch_acs_internal_management_system'
];

const outDir = path.join(__dirname, 'src/pages');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function toPascalCase(str) {
  return str.replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

let routes = [];

function convertHtmlToJsx(html) {
  let bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return null;
  let body = bodyMatch[1];

  // Remove script and style tags completely
  body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  body = body.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove event handlers like onclick, onchange
  body = body.replace(/ on[a-z]+="[^"]*"/gi, '');

  // Convert classes
  body = body.replace(/class="/g, 'className="');
  body = body.replace(/for="/g, 'htmlFor="');
  
  // Self closing tags
  body = body.replace(/<(input|img|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  // Fix attributes without values (like disabled, checked, selected)
  body = body.replace(/ disabled=""/g, ' disabled');
  body = body.replace(/ checked=""/g, ' checked');
  body = body.replace(/ selected=""/g, ' defaultValue="selected"'); // Quick hack for select options
  body = body.replace(/ required=""/g, ' required');
  body = body.replace(/ readonly=""/g, ' readOnly');

  // Fix SVG attributes
  body = body.replace(/stroke-width/g, 'strokeWidth');
  body = body.replace(/stroke-linecap/g, 'strokeLinecap');
  body = body.replace(/stroke-linejoin/g, 'strokeLinejoin');
  body = body.replace(/fill-rule/g, 'fillRule');
  body = body.replace(/clip-rule/g, 'clipRule');

  // Fix comments
  body = body.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  // Fix unescaped < and > in text nodes (basic heuristic)
  // we just escape < if it is followed by space
  body = body.replace(/< /g, '&lt; ');

  return `<div className="w-full h-full min-h-screen">
      ${body}
    </div>`;
}

srcDirs.forEach(srcDir => {
  if (!fs.existsSync(srcDir)) return;
  const folders = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());
  
  folders.forEach(folder => {
    if (folder === 'acs_core_portal') return;

    const htmlPath = path.join(srcDir, folder, 'code.html');
    if (!fs.existsSync(htmlPath)) return;

    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const jsxContent = convertHtmlToJsx(htmlContent);
    if (!jsxContent) return;

    const componentName = toPascalCase(folder.replace(/^\d+_/, ''));
    const routePath = '/' + folder.replace(/^\d+_/, '').replace(/_/g, '-');
    routes.push({ name: componentName, path: routePath });

    const fileContent = `export default function ${componentName}() {\n  return (\n    ${jsxContent}\n  );\n}\n`;
    fs.writeFileSync(path.join(outDir, `${componentName}.tsx`), fileContent);
    console.log(`Generated ${componentName}.tsx`);
  });
});

let appTsx = `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';\n${routes.map(r => `import ${r.name} from './pages/${r.name}';`).join('\n')}\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path="/" element={<Navigate to="${routes[0]?.path || '/'}" />} />\n${routes.map(r => `        <Route path="${r.path}" element={<${r.name} />} />`).join('\n')}\n      </Routes>\n    </BrowserRouter>\n  );\n}\n`;
fs.writeFileSync(path.join(__dirname, 'src/App.tsx'), appTsx);
console.log('Generated src/App.tsx');

