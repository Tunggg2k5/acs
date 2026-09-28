const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src', 'components', 'Layout.tsx');
let layoutCode = fs.readFileSync(layoutPath, 'utf8');

// The layoutCode currently has a hardcoded <select> without React bindings and a hardcoded user profile block.
// Let's replace the entire <header> element properly.

const headerStart = layoutCode.indexOf('<header');
const headerEnd = layoutCode.indexOf('</header>') + '</header>'.length;

const newHeader = `
<header className="fixed top-0 left-64 right-0 h-12 bg-surface-container-lowest z-40 flex items-center justify-between px-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
  <div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
    <span className="material-symbols-outlined text-primary text-[18px]">home</span>
    <span>/</span>
    <span className="font-label-md text-label-md text-on-surface font-semibold">Hệ thống ACS</span>
  </div>
  <div className="flex items-center gap-space-lg">
    <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded">
      <span className="font-label-xs text-label-xs text-on-surface-variant uppercase font-semibold">Vai trò:</span>
      <select 
        className="bg-surface-container-lowest text-on-surface font-label-xs text-label-xs px-space-xs py-0.5 rounded outline-none cursor-pointer"
        value={role}
        onChange={(e) => {
          setRole(e.target.value as any);
          if (e.target.value === 'EMPLOYEE' && ['/qu-n-l-ng-i-d-ng', '/qu-n-l-t-ch-c', '/role-workflow', '/c-u-h-nh-audit-log', '/danh-m-c-ca-ph-n-ca', '/gi-m-s-t-ch-m-c-ng', '/i-u-ch-nh-c-ng'].includes(location.pathname)) {
            window.location.href = '/l-ch-l-m-vi-c';
          }
          if (e.target.value === 'MANAGER' && ['/qu-n-l-ng-i-d-ng', '/qu-n-l-t-ch-c', '/role-workflow', '/c-u-h-nh-audit-log', '/i-u-ch-nh-c-ng'].includes(location.pathname)) {
            window.location.href = '/l-ch-l-m-vi-c';
          }
        }}
      >
        <option value="ADMIN">Admin / HR</option>
        <option value="MANAGER">Quản lý (Manager)</option>
        <option value="EMPLOYEE">Nhân viên (Employee)</option>
      </select>
    </div>
    <button className="relative flex items-center justify-center text-on-surface-variant hover:text-on-surface" type="button">
      <span className="material-symbols-outlined text-[20px]">notifications</span>
      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error"></span>
    </button>
    <div className="flex items-center gap-space-sm pl-space-sm">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
      </div>
      <div className="flex flex-col">
        <span className="font-label-sm text-label-sm text-on-surface font-semibold leading-tight">
          {role === 'ADMIN' ? 'Nguyễn Văn An' : role === 'MANAGER' ? 'Lê Hoàng Dương' : 'Trần Thị Mai'}
        </span>
        <span className="font-label-xs text-label-xs text-on-surface-variant leading-none">
          {role === 'ADMIN' ? 'Admin / HR' : role === 'MANAGER' ? 'Trưởng phòng IT' : 'Nhân viên'}
        </span>
      </div>
    </div>
  </div>
</header>
`;

layoutCode = layoutCode.substring(0, headerStart) + newHeader + layoutCode.substring(headerEnd);

// Also need to use navigate instead of window.location.href to be clean SPA, 
// so let's import useNavigate from react-router-dom
if (!layoutCode.includes('useNavigate')) {
  layoutCode = layoutCode.replace('import { Link, useLocation } from \'react-router-dom\';', 'import { Link, useLocation, useNavigate } from \'react-router-dom\';');
  layoutCode = layoutCode.replace('const location = useLocation();', 'const location = useLocation();\n  const navigate = useNavigate();');
  layoutCode = layoutCode.replace(/window\.location\.href = '([^']+)';/g, "navigate('$1');");
}

fs.writeFileSync(layoutPath, layoutCode, 'utf8');
console.log('Layout header fixed!');
