const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const pagesDir = path.join(srcDir, 'pages');
const componentsDir = path.join(srcDir, 'components');
const contextDir = path.join(srcDir, 'context');

if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);
if (!fs.existsSync(contextDir)) fs.mkdirSync(contextDir);

// 1. Create RoleContext
const roleContextCode = `import React, { createContext, useContext, useState } from 'react';

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>('ADMIN');
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within a RoleProvider");
  return context;
};
`;
fs.writeFileSync(path.join(contextDir, 'RoleContext.tsx'), roleContextCode);
console.log('RoleContext created.');

// 2. Extract Sidebar & Header into Layout.tsx
const samplePage = fs.readFileSync(path.join(pagesDir, 'QuNLNgIDNg.tsx'), 'utf8');

const asideMatch = samplePage.match(/<aside[\s\S]*?<\/aside>/i);
const headerMatch = samplePage.match(/<header[\s\S]*?<\/header>/i);

let asideHtml = asideMatch ? asideMatch[0] : '';
let headerHtml = headerMatch ? headerMatch[0] : '';

// Process aside: add RBAC rendering logic and Link imports
// Paths matching admin only:
const adminPaths = ['/qu-n-l-ng-i-d-ng', '/qu-n-l-t-ch-c', '/role-workflow', '/c-u-h-nh-audit-log', '/dieu-chinh-cong'];
const managerPaths = ['/danh-m-c-ca-ph-n-ca', '/gi-m-s-t-ch-m-c-ng'];

let layoutCode = `import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { role, setRole } = useRole();
  const location = useLocation();

  const isVisible = (path: string) => {
    if (role === 'EMPLOYEE') {
      if (['/qu-n-l-ng-i-d-ng', '/qu-n-l-t-ch-c', '/role-workflow', '/c-u-h-nh-audit-log', '/danh-m-c-ca-ph-n-ca', '/gi-m-s-t-ch-m-c-ng', '/i-u-ch-nh-c-ng'].includes(path)) return false;
    }
    if (role === 'MANAGER') {
      if (['/qu-n-l-ng-i-d-ng', '/qu-n-l-t-ch-c', '/role-workflow', '/c-u-h-nh-audit-log', '/i-u-ch-nh-c-ng'].includes(path)) return false;
    }
    return true;
  };

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    if (isActive) return "flex items-center gap-space-sm px-space-sm py-space-xs rounded transition-colors bg-primary-container text-on-primary font-bold";
    return "flex items-center gap-space-sm px-space-sm py-space-xs rounded text-primary-fixed hover:bg-primary-container hover:text-on-primary transition-colors font-body-sm text-body-sm";
  };
`;

// Replace <a> tags in asideHtml with <Link> + conditional rendering
asideHtml = asideHtml.replace(/<a([^>]*)data-path="([^"]*)"([^>]*)href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/gi, (match, p1, dataPath, p3, href, p5, inner) => {
  return `{isVisible('${href}') && (
    <Link to="${href}" className={getLinkClasses('${href}')}>${inner}</Link>
  )}`;
});

// Replace <select> in headerHtml with dynamic Role select
headerHtml = headerHtml.replace(/<select class="bg-surface-container-lowest[^>]*>[\s\S]*?<\/select>/i, `
<select 
  className="bg-surface-container-lowest text-on-surface font-label-xs text-label-xs px-space-xs py-0.5 rounded outline-none cursor-pointer"
  value={role}
  onChange={(e) => setRole(e.target.value as any)}
>
  <option value="ADMIN">Admin / HR</option>
  <option value="MANAGER">Quản lý đơn vị (Manager)</option>
  <option value="EMPLOYEE">Nhân viên (Employee)</option>
</select>
`);

layoutCode += `
  return (
    <div className="w-full h-full min-h-screen">
      ${asideHtml}
      <div className="pl-64">
        ${headerHtml}
        <main className="relative pt-12 min-h-screen bg-surface px-margin py-margin">
          {children}
        </main>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(componentsDir, 'Layout.tsx'), layoutCode);
console.log('Layout created.');

// 3. Update App.tsx
const appTsx = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf8');
let newAppTsx = appTsx.replace("import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';", "import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';\nimport { RoleProvider } from './context/RoleContext';\nimport Layout from './components/Layout';");
newAppTsx = newAppTsx.replace('<BrowserRouter>', '<BrowserRouter>\n      <RoleProvider>\n        <Layout>');
newAppTsx = newAppTsx.replace('</BrowserRouter>', '        </Layout>\n      </RoleProvider>\n    </BrowserRouter>');
fs.writeFileSync(path.join(srcDir, 'App.tsx'), newAppTsx);
console.log('App.tsx updated.');

// 4. Update Pages
const files = fs.readdirSync(pagesDir);
files.forEach(f => {
  if (f.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
    
    // Extract everything between <main> and </main>
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) {
      let mainContent = mainMatch[1];

      // Fix Drawer / Modal close logic
      // Find buttons with 'close' icon or 'Đóng' or 'Hủy' or similar
      // We wrap the whole component with useState for the modal/drawer
      // But multiple modals? Generally there's 1 drawer or modal
      // We look for `<aside ` or `<div className="fixed inset-0`
      
      const hasModalOrDrawer = mainContent.includes('<aside') || mainContent.includes('fixed inset-0');
      
      if (hasModalOrDrawer) {
        // Add useState import if not present
        if (!content.includes('useState')) {
          content = content.replace("export default function", "import { useState } from 'react';\n\nexport default function");
        }
        
        mainContent = mainContent.replace(/<button([^>]*)title="Đóng panel"([^>]*)>/g, '<button$1title="Đóng panel" onClick={() => setIsVisible(false)}$2>');
        mainContent = mainContent.replace(/<button([^>]*)>([\s\S]*?Đóng[\s\S]*?)<\/button>/gi, '<button$1 onClick={() => setIsVisible(false)}>$2</button>');
        mainContent = mainContent.replace(/<button([^>]*)>([\s\S]*?Hủy[\s\S]*?)<\/button>/gi, '<button$1 onClick={() => setIsVisible(false)}>$2</button>');
        // Also look for close icons
        mainContent = mainContent.replace(/<button([^>]*)>([\s\S]*?close[\s\S]*?)<\/button>/gi, '<button$1 onClick={() => setIsVisible(false)}>$2</button>');

        // Need to wrap the <aside> or fixed div
        mainContent = mainContent.replace(/(<aside[^>]*xl:w-\[380px\][\s\S]*?<\/aside>)/g, "{isVisible && ($1)}");
        mainContent = mainContent.replace(/(<div className="[^"]*fixed inset-0[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/g, "{isVisible && ($1)}"); // Rough guess for modal end

        // Also add logic to table row buttons like "Xem chi tiết" or "Chỉnh sửa" to set isVisible(true)
        mainContent = mainContent.replace(/<button([^>]*)title="Xem chi tiết"([^>]*)>/g, '<button$1title="Xem chi tiết" onClick={() => setIsVisible(true)}$2>');
        mainContent = mainContent.replace(/<button([^>]*)title="Chỉnh sửa"([^>]*)>/g, '<button$1title="Chỉnh sửa" onClick={() => setIsVisible(true)}$2>');
        mainContent = mainContent.replace(/<button([^>]*)title="Thêm[^"]*"([^>]*)>/g, '<button$1title="Thêm" onClick={() => setIsVisible(true)}$2>');
        mainContent = mainContent.replace(/<button([^>]*)>\s*<span[^>]*>\+ Thêm[^<]*<\/span>\s*<\/button>/g, '<button$1 onClick={() => setIsVisible(true)}><span className="material-symbols-outlined text-[18px]">person_add</span><span>+ Thêm</span></button>');
      }

      let newFileContent = `import React from 'react';\n`;
      if (hasModalOrDrawer) {
        newFileContent += `import { useState } from 'react';\n`;
      }
      newFileContent += `\nexport default function ${f.replace('.tsx', '')}() {\n`;
      if (hasModalOrDrawer) {
        newFileContent += `  const [isVisible, setIsVisible] = useState(true);\n`;
      }
      newFileContent += `  return (\n    <>\n      ${mainContent}\n    </>\n  );\n}\n`;
      
      fs.writeFileSync(path.join(pagesDir, f), newFileContent);
      console.log(`Updated ${f}`);
    }
  }
});
