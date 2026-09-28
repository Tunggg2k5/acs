import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { AdminDutyView } from '../components/AdminDesignViews';

type OnCallAssign = { id: string; empId: string; name: string; dept: string; date: string; type: string; allowance: string; status: string };

const INIT_ASSIGNS: OnCallAssign[] = [
  { id: '1', empId: 'NV001', name: 'Nguyễn Văn Minh', dept: 'Phòng Công nghệ', date: '25/10/2023', type: 'Trực đêm', allowance: '150,000đ', status: 'Đã duyệt' },
  { id: '2', empId: 'NV002', name: 'Lê Thu Hà', dept: 'Phòng Công nghệ', date: '26/10/2023', type: 'Trực ngày nghỉ', allowance: '300,000đ', status: 'Chờ duyệt' },
  { id: '3', empId: 'NV003', name: 'Phạm Hoàng Nam', dept: 'Phòng Kinh doanh', date: '28/10/2023', type: 'Trực hỗ trợ KH', allowance: '200,000đ', status: 'Đã duyệt' },
];

export default function LChTrCPhNCNgTrC() {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [assigns, setAssigns] = useState(INIT_ASSIGNS);
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  if (role === 'ADMIN') return <AdminDutyView />;

  // Employee cannot access
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

  const visibleAssigns = role === 'MANAGER' ? assigns.filter(a => ['NV001', 'NV002'].includes(a.empId)) : assigns;
  const filteredAssigns = visibleAssigns.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.empId.toLowerCase().includes(search.toLowerCase()));

  const handleSaveAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    setAssigns([...assigns, { id: Date.now().toString(), empId: f.empId.value, name: 'Nhân viên mới', dept: 'Phòng ban', date: f.date.value, type: f.type.value, allowance: f.allowance.value, status: 'Chờ duyệt' }]);
    setActiveModal(false);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      setAssigns(assigns.filter(x => x.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="page-title">Lịch trực & Phân công trực</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý và phân công lịch trực ngoài giờ, trực đêm, trực ngày nghỉ.</p>
        </div>
        <button onClick={() => setActiveModal(true)} className="btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Phân công trực
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-5 border-l-4 border-blue-600">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">assignment_ind</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{visibleAssigns.length}</p>
              <p className="text-xs text-slate-500">Tổng lịch trực tháng này</p>
            </div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-amber-500">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">pending_actions</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{visibleAssigns.filter(a => a.status === 'Chờ duyệt').length}</p>
              <p className="text-xs text-slate-500">Lịch chờ duyệt</p>
            </div>
          </div>
        </div>
        <div className="card p-5 border-l-4 border-emerald-500">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">payments</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {visibleAssigns.reduce((acc, curr) => acc + parseInt(curr.allowance.replace(/,/g, '').replace('đ', '')), 0).toLocaleString()}đ
              </p>
              <p className="text-xs text-slate-500">Tổng chi phí phụ cấp</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="card overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input pl-9"
              placeholder="Tìm kiếm theo mã NV, tên NV..."
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3">Mã NV</th>
              <th className="px-4 py-3">Họ và tên</th>
              <th className="px-4 py-3">Phòng ban</th>
              <th className="px-4 py-3 text-center">Ngày trực</th>
              <th className="px-4 py-3">Loại trực</th>
              <th className="px-4 py-3 text-right">Phụ cấp</th>
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
                <td className="px-4 py-3 text-center text-slate-600">{a.date}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{a.type}</span>
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-800">{a.allowance}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                    a.status === 'Đã duyệt'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => setConfirmDelete(a.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 mx-auto transition-colors">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {filteredAssigns.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-[48px] mb-2">inbox</span>
                    <p className="text-sm">Chưa có lịch trực nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Backdrop */}
      {(activeModal || confirmDelete) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(false); setConfirmDelete(null); }} />
      )}

      {/* Modal: Add Duty */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveAssign} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Phân công trực mới</h2>
              <button type="button" onClick={() => setActiveModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Mã NV <span className="text-red-500">*</span></label>
                <input name="empId" required className="form-input" placeholder="VD: NV001" />
              </div>
              <div>
                <label className="form-label">Ngày trực <span className="text-red-500">*</span></label>
                <input type="date" name="date" required className="form-input" />
              </div>
              <div>
                <label className="form-label">Loại trực</label>
                <select name="type" className="form-input bg-white">
                  <option>Trực đêm</option>
                  <option>Trực ngày nghỉ</option>
                  <option>Trực hỗ trợ KH</option>
                </select>
              </div>
              <div>
                <label className="form-label">Phụ cấp (VNĐ)</label>
                <input name="allowance" defaultValue="150,000đ" required className="form-input" />
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setActiveModal(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Lưu phân công</button>
            </footer>
          </form>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-[24px]">delete_forever</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc chắn muốn xóa phân công trực này không?</p>
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
