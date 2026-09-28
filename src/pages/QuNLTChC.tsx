import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

type Department = { id: string; code: string; name: string; manager: string; count: number; status: string };
type Position = { id: string; code: string; name: string; dept: string; level: string };
type Device = { id: string; name: string; ip: string; location: string; lastSync: string; status: string };

const INIT_DEPTS: Department[] = [
  { id: '1', code: 'IT', name: 'Phòng Công nghệ', manager: 'Trần Văn Nam', count: 24, status: 'Hoạt động' },
  { id: '2', code: 'HR', name: 'Phòng Nhân sự', manager: 'Nguyễn Văn An', count: 5, status: 'Hoạt động' },
  { id: '3', code: 'SALES', name: 'Phòng Kinh doanh', manager: 'Phạm Hoàng Nam', count: 42, status: 'Hoạt động' },
];

const INIT_POS: Position[] = [
  { id: '1', code: 'DEV_SR', name: 'Senior Developer', dept: 'Phòng Công nghệ', level: 'Chuyên viên' },
  { id: '2', code: 'HR_MGR', name: 'Trưởng phòng HR', dept: 'Phòng Nhân sự', level: 'Quản lý' },
  { id: '3', code: 'SALES_EX', name: 'Sales Executive', dept: 'Phòng Kinh doanh', level: 'Nhân viên' },
];

const INIT_DEVS: Device[] = [
  { id: '1', name: 'Máy chấm công Tầng 1 (Cửa chính)', ip: '192.168.1.101', location: 'Sảnh chính Tầng 1', lastSync: '10 phút trước', status: 'Online' },
  { id: '2', name: 'Máy chấm công Tầng 2', ip: '192.168.1.102', location: 'Cửa phòng IT Tầng 2', lastSync: '12 phút trước', status: 'Online' },
  { id: '3', name: 'Máy vân tay kho', ip: '192.168.1.105', location: 'Kho hàng B', lastSync: '2 ngày trước', status: 'Offline' },
];

export default function QuNLTChC() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<'DEPT' | 'POS' | 'DEV'>('DEPT');
  const [search, setSearch] = useState('');
  
  const [depts, setDepts] = useState(INIT_DEPTS);
  const [positions, setPositions] = useState(INIT_POS);
  const [devices, setDevices] = useState(INIT_DEVS);

  const [activeModal, setActiveModal] = useState<'ADD_DEPT' | 'EDIT_DEPT' | 'ADD_POS' | 'EDIT_POS' | 'ADD_DEV' | 'EDIT_DEV' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{type: 'DEPT'|'POS'|'DEV', id: string} | null>(null);

  if (role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-500 text-[32px]">lock</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không có quyền truy cập</h2>
        <p className="text-sm text-slate-500 max-w-sm">Tài khoản của bạn không có quyền truy cập chức năng này. Chỉ Admin mới có quyền quản lý tổ chức.</p>
      </div>
    );
  }

  const handleSaveDept = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    if (activeModal === 'ADD_DEPT') {
      setDepts([...depts, { id: Date.now().toString(), code: f.code.value, name: f.name.value, manager: f.manager.value, count: 0, status: 'Hoạt động' }]);
    } else {
      setDepts(depts.map(d => d.id === selected.id ? { ...d, code: f.code.value, name: f.name.value, manager: f.manager.value } : d));
    }
    setActiveModal(null);
  };

  const handleSavePos = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    if (activeModal === 'ADD_POS') {
      setPositions([...positions, { id: Date.now().toString(), code: f.code.value, name: f.name.value, dept: f.dept.value, level: f.level.value }]);
    } else {
      setPositions(positions.map(p => p.id === selected.id ? { ...p, code: f.code.value, name: f.name.value, dept: f.dept.value, level: f.level.value } : p));
    }
    setActiveModal(null);
  };

  const handleSaveDev = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    if (activeModal === 'ADD_DEV') {
      setDevices([...devices, { id: Date.now().toString(), name: f.name.value, ip: f.ip.value, location: f.location.value, lastSync: 'Vừa xong', status: 'Online' }]);
    } else {
      setDevices(devices.map(d => d.id === selected.id ? { ...d, name: f.name.value, ip: f.ip.value, location: f.location.value } : d));
    }
    setActiveModal(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      if (confirmDelete.type === 'DEPT') setDepts(depts.filter(d => d.id !== confirmDelete.id));
      else if (confirmDelete.type === 'POS') setPositions(positions.filter(p => p.id !== confirmDelete.id));
      else if (confirmDelete.type === 'DEV') setDevices(devices.filter(d => d.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const tabs = [
    { id: 'DEPT', label: 'Cơ cấu phòng ban', icon: 'corporate_fare' },
    { id: 'POS', label: 'Danh mục chức vụ', icon: 'badge' },
    { id: 'DEV', label: 'Máy chấm công', icon: 'memory' },
  ];

  return (
    <div className="flex flex-col w-full gap-6 p-6 bg-[#F8FAFC] min-h-screen">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý tổ chức &amp; Hệ thống</h1>
          <p className="mt-1 text-sm text-slate-500">Thiết lập cơ cấu phòng ban, chức vụ và điểm máy chấm công</p>
        </div>
        <div>
          {activeTab === 'DEPT' && (
            <button onClick={() => { setSelected(null); setActiveModal('ADD_DEPT'); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm phòng ban
            </button>
          )}
          {activeTab === 'POS' && (
            <button onClick={() => { setSelected(null); setActiveModal('ADD_POS'); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm chức vụ
            </button>
          )}
          {activeTab === 'DEV' && (
            <button onClick={() => { setSelected(null); setActiveModal('ADD_DEV'); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm máy chấm công
            </button>
          )}
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id as any); setSearch(''); }}
              className={`h-12 px-5 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="relative w-full max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo mã, tên..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Tables */}
        <div className="overflow-x-auto min-h-[400px]">

          {/* Dept table */}
          {activeTab === 'DEPT' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã PB</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên phòng ban</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trưởng phòng</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Số NV</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {depts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase())).map(d => (
                  <tr key={d.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{d.code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{d.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{d.manager}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">{d.count}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setSelected(d); setActiveModal('EDIT_DEPT'); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => setConfirmDelete({type: 'DEPT', id: d.id})} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Position table */}
          {activeTab === 'POS' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã CV</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên chức vụ</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Phòng ban</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cấp bậc</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {positions.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <tr key={p.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">{p.code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-4 py-3.5 text-slate-600">{p.dept}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">{p.level}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setSelected(p); setActiveModal('EDIT_POS'); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => setConfirmDelete({type: 'POS', id: p.id})} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Device table */}
          {activeTab === 'DEV' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tên thiết bị</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vị trí lắp đặt</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Đồng bộ cuối</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {devices.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
                  <tr key={d.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-slate-500 text-[16px]">memory</span>
                        </div>
                        <span className="font-semibold text-slate-900">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500 text-xs">{d.ip}</td>
                    <td className="px-4 py-3.5 text-slate-600">{d.location}</td>
                    <td className="px-4 py-3.5 text-slate-500">{d.lastSync}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${d.status === 'Online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${d.status === 'Online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setSelected(d); setActiveModal('EDIT_DEV'); }} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => setConfirmDelete({type: 'DEV', id: d.id})} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in text-center p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-[24px]">delete_forever</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Xác nhận xóa</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
              <button onClick={handleConfirmDelete} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100">
                <span className="material-symbols-outlined text-[16px]">delete</span>Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeModal && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => setActiveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">

            {/* Dept Modal */}
            {(activeModal === 'ADD_DEPT' || activeModal === 'EDIT_DEPT') && (
              <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in pointer-events-auto">
                <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">{activeModal === 'ADD_DEPT' ? 'Thêm phòng ban' : 'Chỉnh sửa phòng ban'}</h2>
                  <button onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </header>
                <form onSubmit={handleSaveDept}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã phòng ban <span className="text-red-500">*</span></label>
                      <input name="code" defaultValue={selected?.code} required placeholder="VD: IT, HR, SALES" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên phòng ban <span className="text-red-500">*</span></label>
                      <input name="name" defaultValue={selected?.name} required placeholder="Tên phòng ban" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trưởng phòng <span className="text-red-500">*</span></label>
                      <input name="manager" defaultValue={selected?.manager} required placeholder="Họ tên trưởng phòng" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                  </div>
                  <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                    <button type="button" onClick={() => setActiveModal(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                      <span className="material-symbols-outlined text-[16px]">save</span>Lưu
                    </button>
                  </footer>
                </form>
              </div>
            )}

            {/* Position Modal */}
            {(activeModal === 'ADD_POS' || activeModal === 'EDIT_POS') && (
              <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in pointer-events-auto">
                <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">{activeModal === 'ADD_POS' ? 'Thêm chức vụ' : 'Chỉnh sửa chức vụ'}</h2>
                  <button onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </header>
                <form onSubmit={handleSavePos}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã chức vụ <span className="text-red-500">*</span></label>
                      <input name="code" defaultValue={selected?.code} required placeholder="VD: DEV_SR" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên chức vụ <span className="text-red-500">*</span></label>
                      <input name="name" defaultValue={selected?.name} required placeholder="Tên chức vụ" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phòng ban</label>
                      <select name="dept" defaultValue={selected?.dept || 'Phòng Công nghệ'} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                        <option>Phòng Công nghệ</option>
                        <option>Phòng Nhân sự</option>
                        <option>Phòng Kinh doanh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cấp bậc</label>
                      <select name="level" defaultValue={selected?.level || 'Nhân viên'} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                        <option>Nhân viên</option>
                        <option>Chuyên viên</option>
                        <option>Quản lý</option>
                      </select>
                    </div>
                  </div>
                  <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                    <button type="button" onClick={() => setActiveModal(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                      <span className="material-symbols-outlined text-[16px]">save</span>Lưu
                    </button>
                  </footer>
                </form>
              </div>
            )}

            {/* Device Modal */}
            {(activeModal === 'ADD_DEV' || activeModal === 'EDIT_DEV') && (
              <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in pointer-events-auto">
                <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h2 className="text-base font-bold text-slate-900">{activeModal === 'ADD_DEV' ? 'Thêm máy chấm công' : 'Chỉnh sửa máy chấm công'}</h2>
                  <button onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </header>
                <form onSubmit={handleSaveDev}>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên thiết bị <span className="text-red-500">*</span></label>
                      <input name="name" defaultValue={selected?.name} required placeholder="Tên thiết bị" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">IP Address <span className="text-red-500">*</span></label>
                      <input name="ip" defaultValue={selected?.ip} required placeholder="192.168.x.x" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vị trí lắp đặt <span className="text-red-500">*</span></label>
                      <input name="location" defaultValue={selected?.location} required placeholder="Vị trí lắp đặt" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                    </div>
                  </div>
                  <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                    <button type="button" onClick={() => setActiveModal(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                      <span className="material-symbols-outlined text-[16px]">save</span>Lưu
                    </button>
                  </footer>
                </form>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
}
