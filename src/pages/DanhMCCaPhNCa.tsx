import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { AdminShiftCatalogView } from '../components/AdminDesignViews';

type ShiftType = { id: string; code: string; name: string; in: string; out: string; type: string };
type ShiftAssign = { id: string; empId: string; name: string; dept: string; date: string; shiftCode: string; status: string };

const SHIFT_TYPES: ShiftType[] = [
  { id: '1', code: 'HC', name: 'Hành chính', in: '08:00', out: '17:00', type: 'Ca thường' },
  { id: '2', code: 'S', name: 'Ca sáng', in: '06:00', out: '14:00', type: 'Ca xoay' },
  { id: '3', code: 'C', name: 'Ca chiều', in: '14:00', out: '22:00', type: 'Ca xoay' },
  { id: '4', code: 'D', name: 'Ca đêm', in: '22:00', out: '06:00', type: 'Ca đêm' },
];

const INIT_ASSIGNS: ShiftAssign[] = [
  { id: '1', empId: 'NV001', name: 'Nguyễn Văn Minh', dept: 'Phòng Công nghệ', date: '25/10/2023', shiftCode: 'HC', status: 'Đã phân' },
  { id: '2', empId: 'NV002', name: 'Lê Thu Hà', dept: 'Phòng Công nghệ', date: '25/10/2023', shiftCode: 'S', status: 'Đã phân' },
  { id: '3', empId: 'NV003', name: 'Phạm Hoàng Nam', dept: 'Phòng Kinh doanh', date: '25/10/2023', shiftCode: 'C', status: 'Chờ duyệt' },
  { id: '4', empId: 'NV004', name: 'Vũ Khánh Linh', dept: 'Phòng HR', date: '25/10/2023', shiftCode: 'HC', status: 'Đã phân' },
];

export default function DanhMCCaPhNCa() {
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<'TYPE' | 'ASSIGN'>('TYPE');
  const [search, setSearch] = useState('');

  const [shiftTypes, setShiftTypes] = useState(SHIFT_TYPES);
  const [assigns, setAssigns] = useState(INIT_ASSIGNS);

  const [activeModal, setActiveModal] = useState<'ADD_TYPE' | 'ADD_ASSIGN' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'TYPE' | 'ASSIGN', id: string } | null>(null);
  const isAdmin = role === 'ADMIN';
  if (role === 'ADMIN') return <AdminShiftCatalogView />;

  if (role === 'EMPLOYEE') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-error text-4xl">lock</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">Không có quyền truy cập</h2>
        <p className="text-sm text-on-surface-variant max-w-sm">Tài khoản của bạn không có quyền truy cập chức năng này.</p>
      </div>
    );
  }

  // Force tab to ASSIGN if MANAGER
  if (role === 'MANAGER' && activeTab === 'TYPE') setActiveTab('ASSIGN');

  const visibleAssigns = role === 'MANAGER' ? assigns.filter(a => ['NV001', 'NV002'].includes(a.empId)) : assigns;
  const filteredAssigns = visibleAssigns.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.empId.toLowerCase().includes(search.toLowerCase()));

  const handleSaveType = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    setShiftTypes([...shiftTypes, { id: Date.now().toString(), code: f.code.value, name: f.name.value, in: f.in.value, out: f.out.value, type: f.type.value }]);
    setActiveModal(null);
  };

  const handleSaveAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    setAssigns([...assigns, { id: Date.now().toString(), empId: f.empId.value, name: 'Nhân viên mới', dept: 'Phòng IT', date: f.date.value, shiftCode: f.shiftCode.value, status: 'Đã phân' }]);
    setActiveModal(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      if (confirmDelete.type === 'TYPE') {
        setShiftTypes(shiftTypes.filter(x => x.id !== confirmDelete.id));
      } else {
        setAssigns(assigns.filter(x => x.id !== confirmDelete.id));
      }
      setConfirmDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="page-title">Danh mục ca & Phân ca</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý các loại ca làm việc và phân công ca cho nhân sự.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'TYPE' && (
            <button onClick={() => setActiveModal('ADD_TYPE')} className="btn-primary">
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm loại ca
            </button>
          )}
          {activeTab === 'ASSIGN' && (
            <button onClick={() => setActiveModal('ADD_ASSIGN')} className="btn-primary">
              <span className="material-symbols-outlined text-[18px]">assignment_add</span> Phân ca
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-t-xl shadow-sm">
        {isAdmin && (
          <button
            onClick={() => setActiveTab('TYPE')}
            className={`h-12 px-6 flex items-center gap-2 border-b-2 text-sm font-semibold transition-colors ${activeTab === 'TYPE' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <span className="material-symbols-outlined text-[18px]">category</span>
            Danh mục ca
          </button>
        )}
        <button
          onClick={() => setActiveTab('ASSIGN')}
          className={`h-12 px-6 flex items-center gap-2 border-b-2 text-sm font-semibold transition-colors ${activeTab === 'ASSIGN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <span className="material-symbols-outlined text-[18px]">assignment</span>
          Phân ca nhân viên
        </button>
      </div>

      {/* Shift Types Table */}
      {activeTab === 'TYPE' && isAdmin && (
        <div className="card overflow-hidden -mt-6 rounded-t-none">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3">Mã ca</th>
                <th className="px-4 py-3">Tên ca</th>
                <th className="px-4 py-3 text-center">Giờ vào</th>
                <th className="px-4 py-3 text-center">Giờ ra</th>
                <th className="px-4 py-3">Loại ca</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shiftTypes.map(s => (
                <tr key={s.id} className="text-sm hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-mono">{s.code}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{s.name}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{s.in}</td>
                  <td className="px-4 py-3 text-center text-slate-600">{s.out}</td>
                  <td className="px-4 py-3 text-slate-500">{s.type}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setConfirmDelete({ type: 'TYPE', id: s.id })} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 mx-auto transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {shiftTypes.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-[48px] mb-2">inbox</span>
                      <p className="text-sm">Chưa có loại ca nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Shift Assignments Table */}
      {activeTab === 'ASSIGN' && (
        <div className="card overflow-hidden -mt-6 rounded-t-none">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm nhân viên theo tên hoặc mã..."
                className="form-input pl-9"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3">Mã NV</th>
                  <th className="px-4 py-3">Nhân viên</th>
                  <th className="px-4 py-3">Phòng ban</th>
                  <th className="px-4 py-3">Ngày</th>
                  <th className="px-4 py-3 text-center">Ca làm việc</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssigns.map(a => (
                  <tr key={a.id} className="text-sm hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-blue-600">{a.empId}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{a.name}</td>
                    <td className="px-4 py-3 text-slate-500">{a.dept}</td>
                    <td className="px-4 py-3 text-slate-600">{a.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-mono">{a.shiftCode}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${a.status === 'Đã phân'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setConfirmDelete({ type: 'ASSIGN', id: a.id })} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 mx-auto transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAssigns.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center py-12 text-slate-400">
                        <span className="material-symbols-outlined text-[48px] mb-2">inbox</span>
                        <p className="text-sm">Chưa có phân ca nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(activeModal || confirmDelete) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setConfirmDelete(null); }} />
      )}

      {/* Modal: Add Shift Type */}
      {activeModal === 'ADD_TYPE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveType} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Thêm loại ca mới</h2>
              <button type="button" onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Mã ca</label>
                <input name="code" required className="form-input" placeholder="VD: HC, S, C, D" />
              </div>
              <div>
                <label className="form-label">Tên ca</label>
                <input name="name" required className="form-input" placeholder="VD: Ca hành chính" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Giờ vào</label>
                  <input type="time" name="in" required className="form-input" />
                </div>
                <div>
                  <label className="form-label">Giờ ra</label>
                  <input type="time" name="out" required className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Phân loại</label>
                <select name="type" className="form-input bg-white">
                  <option>Ca thường</option>
                  <option>Ca xoay</option>
                  <option>Ca đêm</option>
                </select>
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Lưu loại ca</button>
            </footer>
          </form>
        </div>
      )}

      {/* Modal: Add Assign */}
      {activeModal === 'ADD_ASSIGN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveAssign} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Phân ca nhân viên</h2>
              <button type="button" onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Mã nhân viên <span className="text-red-500">*</span></label>
                <input name="empId" required className="form-input" placeholder="VD: NV001" />
              </div>
              <div>
                <label className="form-label">Ngày làm việc <span className="text-red-500">*</span></label>
                <input type="date" name="date" required className="form-input" />
              </div>
              <div>
                <label className="form-label">Ca làm việc</label>
                <select name="shiftCode" className="form-input bg-white">
                  {shiftTypes.map(s => <option key={s.id} value={s.code}>{s.code} – {s.name}</option>)}
                </select>
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Lưu phân ca</button>
            </footer>
          </form>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-[24px]">delete_forever</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc chắn muốn xóa {confirmDelete.type === 'TYPE' ? 'loại ca' : 'phân ca'} này không?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Hủy</button>
              <button onClick={handleConfirmDelete} className="btn-danger">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
