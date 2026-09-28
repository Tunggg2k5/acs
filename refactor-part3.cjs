const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');

const files = fs.readdirSync(pagesDir);
files.forEach(f => {
  if (f.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
    
    // Check if useRole is already imported
    if (!content.includes('useRole')) {
      content = content.replace("export default function", "import { useRole } from '../context/RoleContext';\n\nexport default function");
      
      // Inject const { role } = useRole();
      content = content.replace(/(export default function [^()]+\(\) {\n)/, "$1  const { role } = useRole();\n");
      
      // Now let's hide buttons with text "Thêm", "Chỉnh sửa", "Xóa", "Khóa", "Phê duyệt" for Employee
      // We will wrap them in {role !== 'EMPLOYEE' && (...)}
      // This is a bit risky with regex but we can do it for generic buttons
      
      // Replace buttons containing "Thêm"
      content = content.replace(/(<button[^>]*>[\s\S]*?(?:Thêm|Chỉnh sửa|Khóa|Duyệt|Phê duyệt)[\s\S]*?<\/button>)/gi, "{role !== 'EMPLOYEE' ? ($1) : null}");
      
      // Also hide edit/delete/lock icons
      // Only replacing buttons that don't have text, but have the icon span
      content = content.replace(/(<button[^>]*>\s*<span[^>]*>(?:edit|lock|delete|check_circle)<\/span>\s*<\/button>)/gi, "{role !== 'EMPLOYEE' ? ($1) : null}");

      fs.writeFileSync(path.join(pagesDir, f), content);
      console.log(`Updated ${f} for RBAC`);
    }
  }
});

// Update Layout to pass data-role to root for any CSS overrides
const layoutPath = path.join(srcDir, 'components', 'Layout.tsx');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
layoutContent = layoutContent.replace('<div className="w-full h-full min-h-screen">', '<div className="w-full h-full min-h-screen" data-role={role}>');
fs.writeFileSync(layoutPath, layoutContent);

