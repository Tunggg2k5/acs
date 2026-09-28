const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

let usersPage = fs.readFileSync(path.join(srcDir, 'QuNLNgIDNg.tsx'), 'utf8');
let modalPage = fs.readFileSync(path.join(srcDir, 'ThMSANhNViNModal.tsx'), 'utf8');

const modalStart = modalPage.indexOf('<div style={{ display: activeModal ? "" : "none" }}  className="fixed inset-0 z-50');
const modalEnd = modalPage.indexOf('{/* Micro-Interactions Client Script */}');
let modalContent = modalPage.substring(modalStart, modalEnd);

modalContent = modalContent.replace(/style=\{\{ display: activeModal \? "" : "none" \}\}/g, 'style={{ display: activeModal === "add_user" || activeModal === "edit_user" ? "" : "none" }}');
modalContent = modalContent.replace(/<div className="flex justify-end gap-space-sm">/g, '<div className="flex justify-end gap-space-sm"><button type="submit" className="hidden" id="hidden-submit-btn"></button>');
modalContent = modalContent.replace(/<span[^>]*>Lưu thông tin<\/span>/g, '<span onClick={() => document.getElementById("hidden-submit-btn")?.click()}>Lưu thông tin</span>');

modalContent = modalContent.replace(/(<div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-xl">)/, '<form onSubmit={handleUserSubmit} className="flex-1 overflow-y-auto flex flex-col" id="userForm">\n$1');
modalContent = modalContent.replace(/(<div className="p-space-md bg-surface-container flex items-center justify-between">)/, '</form>\n$1');
modalContent = modalContent.replace(/<span[^>]*>Lưu thông tin<\/span>/g, '<button type="submit" form="userForm" className="flex items-center">Lưu thông tin</button>');

modalContent = modalContent.replace(/type="text" defaultValue="NV014"/, 'type="text" id="userInputId" required defaultValue="NV_NEW"');
modalContent = modalContent.replace(/type="text" defaultValue="Trần Hữu Kiên"/, 'type="text" id="userInputName" required defaultValue=""');
modalContent = modalContent.replace(/type="text" defaultValue="Phòng Kinh doanh"/, 'type="text" id="userInputDept" required defaultValue=""');

let stateHook = `
  const [users, setUsers] = useState([
    { id: 'NV001', username: 'an.nv', name: 'Nguyễn Văn An', dept: 'Ban Giám đốc', title: 'Giám đốc Điều hành', role: 'Admin', status: 'Hoạt động' },
    { id: 'NV002', username: 'binh.le', name: 'Lê Thanh Bình', dept: 'Phòng Kế toán', title: 'Kế toán trưởng', role: 'Nhân viên', status: 'Hoạt động' },
    { id: 'NV003', username: 'mai.tt', name: 'Trần Thị Mai', dept: 'Phòng IT', title: 'Chuyên viên', role: 'Nhân viên', status: 'Khóa' },
  ]);

  const [editUser, setEditUser] = useState(null);

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const id = e.target.elements.userInputId.value;
    const name = e.target.elements.userInputName.value;
    const dept = e.target.elements.userInputDept.value;
    if (activeModal === 'edit_user' && editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...u, id, name, dept } : u));
    } else {
      setUsers([...users, { id, username: 'user.new', name, dept, title: 'Nhân viên', role: 'Nhân viên', status: 'Hoạt động' }]);
    }
    setActiveModal(null);
    setEditUser(null);
  };
`;

usersPage = usersPage.replace('const [activeModal, setActiveModal] = useState<string | null>(null);', 'const [activeModal, setActiveModal] = useState<string | null>(null);\n' + stateHook);

let tbodyStart = usersPage.indexOf('<tbody');
let tbodyEnd = usersPage.indexOf('</tbody>') + '</tbody>'.length;

let newTbody = `
<tbody className="divide-y-0 text-on-surface">
  {users.map((u, i) => (
    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
      <td className="py-2 px-3 text-center font-label-xs text-label-xs text-on-surface-variant">0{i+1}</td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-1.5">
          <span className="font-label-md text-label-md font-semibold text-primary">{u.id}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">{u.username}</span>
        </div>
      </td>
      <td className="py-2 px-3 font-label-md text-label-md text-on-surface font-semibold">{u.name}</td>
      <td className="py-2 px-3 text-on-surface">{u.dept}</td>
      <td className="py-2 px-3 text-on-surface-variant">{u.title}</td>
      <td className="py-2 px-3">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-xs text-label-xs font-semibold">{u.role}</span>
      </td>
      <td className="py-2 px-3 text-center">
        <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${u.status === 'Hoạt động' ? 'bg-tertiary-container/15 text-tertiary' : 'bg-error-container/15 text-error'}\`}>
          <span className={\`w-1.5 h-1.5 rounded-full \${u.status === 'Hoạt động' ? 'bg-tertiary' : 'bg-error'}\`}></span>{u.status}
        </span>
      </td>
      <td className="py-2 px-3 text-center">
        <div className="inline-flex items-center justify-center gap-1 text-on-surface-variant">
          {role !== 'EMPLOYEE' && (
            <>
              <button type="button" title="Chỉnh sửa" onClick={() => { setEditUser(u); setActiveModal('edit_user'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button type="button" title="Xóa" onClick={() => setUsers(users.filter(user => user.id !== u.id))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container hover:text-error transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </>
          )}
          <button type="button" title="Xem chi tiết" onClick={() => setActiveModal('view')} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>
`;

usersPage = usersPage.substring(0, tbodyStart) + newTbody + usersPage.substring(tbodyEnd);
usersPage = usersPage.replace('</main>', '\n' + modalContent + '\n</main>');
usersPage = usersPage.replace(/<button[^>]*>\s*<span[^>]*>person_add<\/span>\s*<span[^>]*>\+ Thêm người dùng<\/span>\s*<\/button>/i, '<button className="inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary px-space-md h-9 rounded font-label-md text-label-md transition-colors shadow-sm" type="button" onClick={() => { setEditUser(null); setActiveModal("add_user"); }}><span className="material-symbols-outlined text-[18px]">person_add</span><span>+ Thêm người dùng</span></button>');

fs.writeFileSync(path.join(srcDir, 'QuNLNgIDNg.tsx'), usersPage, 'utf8');
console.log("CRUD added to QuNLNgIDNg.tsx");
