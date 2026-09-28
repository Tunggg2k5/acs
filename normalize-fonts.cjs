const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

// The design system uses these token classes:
// text-headline-lg (24px), text-headline-md (20px), text-headline-sm (16px)
// text-label-lg (14px), text-label-md (13px), text-label-sm (12px), text-label-xs (11px)
// text-body-lg (15px), text-body-md (14px), text-body-sm (13px)
// font-headline-*, font-label-*, font-body-* are font-family tokens

// We want to replace inline sizes and plain Tailwind sizes with design tokens:
const replacements = [
  // Inline px sizes → design tokens
  [/text-\[24px\]/g, 'text-headline-md'],
  [/text-\[22px\]/g, 'text-headline-md'],
  [/text-\[20px\]/g, 'text-headline-sm'],
  [/text-\[18px\]/g, 'text-headline-sm'],
  [/text-\[17px\]/g, 'text-headline-sm'],
  [/text-\[16px\]/g, 'text-headline-sm'],
  [/text-\[15px\]/g, 'text-body-lg'],
  [/text-\[14px\]/g, 'text-body-md'],
  [/text-\[13px\]/g, 'text-body-sm'],
  [/text-\[12px\]/g, 'text-label-sm'],
  [/text-\[11px\]/g, 'text-label-xs'],
  [/text-\[10px\]/g, 'text-label-xs'],
  // Plain Tailwind sizes → design tokens
  [/\btext-2xl\b/g, 'text-headline-lg'],
  [/\btext-xl\b/g, 'text-headline-md'],
  [/\btext-lg\b/g, 'text-headline-sm'],
  [/\btext-base\b/g, 'text-body-md'],
  [/\btext-sm\b/g, 'text-body-sm'],
  [/\btext-xs\b/g, 'text-label-xs'],
  // Also normalize font-weight shorthand to font tokens
  [/\bfont-semibold\b/g, 'font-semibold'],   // keep as-is, fine
  // Fix mixed "text-sm font-semibold" to label equivalents
];

// Also need to match patterns that mix raw "text" with class strings
// "text-sm" that appears as a standalone word in class strings

let totalReplaced = 0;
files.forEach(f => {
  const filePath = path.join(pagesDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  replacements.forEach(([pattern, replacement]) => {
    content = content.replace(pattern, replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalReplaced++;
    console.log(`✓ Normalized: ${f}`);
  }
});

console.log(`\nDone! Normalized ${totalReplaced} files.`);
