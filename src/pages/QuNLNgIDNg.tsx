import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

type User = {
  id: string; username: string; name: string; dept: string;
  title: string; role: string; email: string; phone: string; status: string;
};

export default function QuNLNgIDNg() {
  const { role } = useRole();
  const [activeModal, setActiveModal] = useState<string|null>(null);
  const [drawerUser, setDrawerUser] = useState<User|null>(null);
  const [selectedUser, setSelectedUser] = useState<User|null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User|null>(null);
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: 'NV001', username: 'an.nv', name: 'Nguyễn Văn An', dept: 'Ban Giám đốc', title: 'Giám đốc', role: 'Admin', email: 'an.nv@company.com', phone: '0912 345 678', status: 'Hoạt động' },
    { id: 'NV002', username: 'binh.le', name: 'Lê Thanh Bình', dept: 'Phòng IT', title: 'Trưởng phòng IT', role: 'Manager', email: 'binh.le@company.com', phone: '0923 456 789', status: 'Hoạt động' },
    { id: 'NV003', username: 'mai.tt', name: 'Trần Thị Mai', dept: 'Phòng Kế toán', title: 'Kế toán trưởng', role: 'Manager', email: 'mai.tt@company.com', phone: '0934 567 890', status: 'Hoạt động' },
    { id: 'NV004', username: 'hung.nv', name: 'Nguyễn Văn Hùng', dept: 'Phòng IT', title: 'Chuyên viên', role: 'Employee', email: 'hung.nv@company.com', phone: '0945 678 901', status: 'Hoạt động' },
    { id: 'NV005', username: 'lan.pt', name: 'Phạm Thị Lan', dept: 'Phòng HR', title: 'Nhân viên HR', role: 'Employee', email: 'lan.pt@company.com', phone: '0956 789 012', status: 'Khóa' },
  ]);

  const visibleUsers = users.filter(u =>
    (filterRole === 'ALL' || u.role === filterRole) &&
    (filterStatus === 'ALL' || u.status === filterStatus) &&
    (search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    if (activeModal === 'edit' && selectedUser) {
      setUsers(users.map(u => u.id === selectedUser.id ? {
        ...u,
        name: f.uName.value, dept: f.uDept.value,
        title: f.uTitle.value, email: f.uEmail.value, phone: f.uPhone.value,
        role: f.uRole.value, status: f.uStatus.value,
      } : u));
    } else {
      const newUser: User = {
        id: f.uId.value, username: f.uUsername.value,
        name: f.uName.value, dept: f.uDept.value,
        title: f.uTitle.value, email: f.uEmail.value,
        phone: f.uPhone.value, role: f.uRole.value, status: 'Hoạt động',
      };
      setUsers([...users, newUser]);
    }
    setActiveModal(null); setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      setUsers(users.filter(x => x.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const roleBadge = (r: string) => {
    const map: Record<string, string> = { 'Admin': 'bg-primary text-white', 'Manager': 'bg-indigo-50 text-indigo-700 border border-indigo-200', 'Employee': 'bg-slate-100 text-slate-600 border border-slate-200' };
    return map[r] || 'bg-slate-100 text-slate-600 border border-slate-200';
  };

  return (
    <div className="flex flex-col w-full gap-6 p-6 bg-[#F8FAFC] min-h-screen">

      {/* Page Header */}
      <div className="mb-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý người dùng</h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-semibold text-blue-700">{users.length} người dùng</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Quản lý tài khoản và phân quyền người dùng trong hệ thống</p>
        </div>
        {role === 'ADMIN' && (
          <button
            onClick={() => { setSelectedUser(null); setActiveModal('add'); }}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Thêm người dùng
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã nhân viên..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        >
          <option value="ALL">Tất cả vai trò</option>
          <option>Admin</option>
          <option>Manager</option>
          <option>Employee</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option>Hoạt động</option>
          <option>Khóa</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã / Tài khoản</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và tên</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phòng ban</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Chức vụ</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <span className="material-symbols-outlined text-slate-300 text-4xl block mb-2">person_off</span>
                    <span className="text-sm text-slate-400">Không tìm thấy người dùng nào</span>
                  </td>
                </tr>
              )}
              {visibleUsers.map(u => (
                <tr key={u.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-blue-600">{u.id}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{u.username}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{u.dept}</td>
                  <td className="px-4 py-3.5 text-slate-600">{u.title}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${u.status === 'Hoạt động' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Hoạt động' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        onClick={() => setDrawerUser(u)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      {role === 'ADMIN' && (
                        <>
                          <button
                            type="button"
                            title="Chỉnh sửa"
                            onClick={() => { setSelectedUser(u); setActiveModal('edit'); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            title={u.status === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                            onClick={() => setUsers(users.map(x => x.id === u.id ? { ...x, status: x.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động' } : x))}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${u.status === 'Hoạt động' ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{u.status === 'Hoạt động' ? 'lock' : 'lock_open'}</span>
                          </button>
                          <button
                            type="button"
                            title="Xóa"
                            onClick={() => setConfirmDelete(u)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Table footer */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Hiển thị {visibleUsers.length} / {users.length} người dùng</span>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in text-center p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-[24px]">delete_forever</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Xác nhận xóa người dùng</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc chắn muốn xóa <strong className="text-slate-700">{confirmDelete.name}</strong>? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmDelete(null)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add / Edit User */}
      {(activeModal === 'add' || activeModal === 'edit') && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setSelectedUser(null); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in pointer-events-auto">
              <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">{activeModal === 'edit' ? 'edit' : 'person_add'}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{activeModal === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
                </div>
                <button
                  onClick={() => { setActiveModal(null); setSelectedUser(null); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </header>
              <form onSubmit={handleSubmit}>
                <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã NV <span className="text-red-500">*</span></label>
                    <input name="uId" required defaultValue={selectedUser?.id || ''} placeholder="VD: NV010" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tài khoản <span className="text-red-500">*</span></label>
                    <input name="uUsername" required defaultValue={selectedUser?.username || ''} placeholder="ten.nv" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                    <input name="uName" required defaultValue={selectedUser?.name || ''} placeholder="Nhập đầy đủ họ và tên" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phòng ban <span className="text-red-500">*</span></label>
                    <input name="uDept" required defaultValue={selectedUser?.dept || ''} placeholder="Phòng ban" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chức vụ <span className="text-red-500">*</span></label>
                    <input name="uTitle" required defaultValue={selectedUser?.title || ''} placeholder="Chức vụ" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                    <input name="uEmail" type="email" required defaultValue={selectedUser?.email || ''} placeholder="email@company.com" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại</label>
                    <input name="uPhone" defaultValue={selectedUser?.phone || ''} placeholder="09xx xxx xxx" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vai trò <span className="text-red-500">*</span></label>
                    <select name="uRole" required defaultValue={selectedUser?.role || 'Employee'} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Employee</option>
                    </select>
                  </div>
                  {activeModal === 'edit' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                      <select name="uStatus" defaultValue={selectedUser?.status || 'Hoạt động'} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                        <option>Hoạt động</option>
                        <option>Khóa</option>
                      </select>
                    </div>
                  )}
                </div>
                <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => { setActiveModal(null); setSelectedUser(null); }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                  >
                    <span className="material-symbols-outlined text-[16px]">save</span>
                    Lưu thay đổi
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Side Drawer: View Detail */}
      {drawerUser && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => setDrawerUser(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Chi tiết nhân sự</h2>
              <button onClick={() => setDrawerUser(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {/* Avatar section */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xl font-bold shrink-0">
                  {drawerUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{drawerUser.name}</h3>
                  <p className="text-sm text-slate-500">{drawerUser.title}</p>
                  <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge(drawerUser.role)}`}>{drawerUser.role}</span>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-0 divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                {[
                  { label: 'Mã nhân viên', value: drawerUser.id, icon: 'badge' },
                  { label: 'Tài khoản', value: drawerUser.username, icon: 'account_circle' },
                  { label: 'Phòng ban', value: drawerUser.dept, icon: 'corporate_fare' },
                  { label: 'Email', value: drawerUser.email, icon: 'mail' },
                  { label: 'Số điện thoại', value: drawerUser.phone, icon: 'phone' },
                  { label: 'Trạng thái', value: drawerUser.status, icon: 'info' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">{item.icon}</span>
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-sm font-medium text-slate-900">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
