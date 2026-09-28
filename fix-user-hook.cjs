const fs = require('fs');

let c = fs.readFileSync('src/pages/QuNLNgIDNg.tsx', 'utf8');

const stateHook = `
  const { role } = useRole();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [users, setUsers] = useState([
    { id: 'NV001', username: 'an.nv', name: 'Nguyễn Văn An', dept: 'Ban Giám đốc', title: 'Giám đốc Điều hành', role: 'Admin', status: 'Hoạt động' },
    { id: 'NV002', username: 'binh.le', name: 'Lê Thanh Bình', dept: 'Phòng Kế toán', title: 'Kế toán trưởng', role: 'Nhân viên', status: 'Hoạt động' },
    { id: 'NV003', username: 'mai.tt', name: 'Trần Thị Mai', dept: 'Phòng IT', title: 'Chuyên viên', role: 'Nhân viên', status: 'Khóa' },
  ]);
  const [editUser, setEditUser] = useState<any>(null);

  const handleUserSubmit = (e: any) => {
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

c = c.replace('const [activeModal, setActiveModal] = useState<boolean>(false);', stateHook);
// In case it was already replaced partially or had useRole added before:
c = c.replace(/const { role } = useRole\(\);\s*const { role } = useRole\(\);/g, 'const { role } = useRole();');

fs.writeFileSync('src/pages/QuNLNgIDNg.tsx', c, 'utf8');
