import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { AdminSwapView } from '../components/AdminDesignViews';

type Shift = {
  id: string; name: string; empId: string;
  currentShift: string; requestedShift: string;
  swapWith: string; date: string; status: string;
};

export default function ICa() {
  const { role } = useRole();
  const [activeModal, setActiveModal] = useState<string|null>(null);
  const [shifts, setShifts] = useState<Shift[]>([
    { id: 'DC-1026-001', empId: 'NV015', name: 'Trần Thị Mai', currentShift: 'Ca Sáng (08:00-17:00)', requestedShift: 'Ca Chiều (13:00-22:00)', swapWith: 'Lê Văn Bình', date: '26/10/2023', status: 'Chờ duyệt' },
    { id: 'DC-1025-002', empId: 'NV012', name: 'Nguyễn Đức Thành', currentShift: 'Ca Chiều (13:00-22:00)', requestedShift: 'Ca Sáng (08:00-17:00)', swapWith: 'Trần Hà Linh', date: '25/10/2023', status: 'Đã duyệt' },
    { id: 'DC-1024-003', empId: 'NV008', name: 'Lê Thị Hương', currentShift: 'Ca Tối (22:00-06:00)', requestedShift: 'Ca Sáng (08:00-17:00)', swapWith: 'Phạm Văn Dũng', date: '24/10/2023', status: 'Từ chối' },
  ]);
  const [selectedShift, setSelectedShift] = useState<Shift|null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  if (role === 'ADMIN') return <AdminSwapView />;

  // Employee only sees their own (mock: NV015)
  const myEmpId = role === 'EMPLOYEE' ? 'NV015' : null;
  const visibleShifts = shifts.filter(s =>
    (myEmpId ? s.empId === myEmpId : true) &&
    (filterStatus === 'ALL' || s.status === filterStatus)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    const newShift: Shift = {
      id: 'DC-' + Date.now().toString().slice(-6),
      empId: myEmpId || 'NV_NEW',
      name: role === 'EMPLOYEE' ? 'Trần Thị Mai' : (f.reqName?.value || 'Nhân viên'),
      currentShift: f.currentShift?.value || 'Ca Sáng',
      requestedShift: f.requestedShift?.value || 'Ca Chiều',
      swapWith: f.swapWith?.value || 'N/A',
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Chờ duyệt',
    };
    setShifts([newShift, ...shifts]);
    setActiveModal(null);
  };

  const handleApprove = (id: string, status: string) => {
    setShifts(shifts.map(s => s.id === id ? { ...s, status } : s));
    setActiveModal(null);
    setSelectedShift(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      setShifts(shifts.filter(s => s.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  const statusBadge = (st: string) => {
    const map: Record<string, string> = {
      'Chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-200',
      'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Từ chối': 'bg-red-50 text-red-700 border-red-200',
    };
    return map[st] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Đổi ca</h1>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {visibleShifts.length} yêu cầu
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {role === 'EMPLOYEE' ? 'Yêu cầu đổi ca của bạn' : 'Quản lý tất cả yêu cầu đổi ca'}
          </p>
        </div>
        <button
          onClick={() => setActiveModal('newRequest')}
          className="btn-primary"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {role === 'EMPLOYEE' ? 'Đăng ký đổi ca' : 'Tạo yêu cầu'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${filterStatus === f
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200'
              }`}
              type="button"
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3">Mã YC</th>
              {role !== 'EMPLOYEE' && <th className="px-4 py-3">Nhân viên</th>}
              <th className="px-4 py-3">Ca hiện tại</th>
              <th className="px-4 py-3">Ca muốn đổi</th>
              <th className="px-4 py-3">Đổi cùng</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleShifts.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center py-12 text-slate-400">
                    <span className="material-symbols-outlined text-[48px] mb-2">inbox</span>
                    <p className="text-sm">Không có yêu cầu nào</p>
                  </div>
                </td>
              </tr>
            )}
            {visibleShifts.map(s => (
              <tr key={s.id} className="text-sm hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold text-blue-600">{s.id}</span>
                </td>
                {role !== 'EMPLOYEE' && (
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{s.name}</span>
                      <span className="text-xs text-slate-400 font-mono mt-0.5">{s.empId}</span>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3 text-slate-500">{s.currentShift}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{s.requestedShift}</td>
                <td className="px-4 py-3 text-slate-500">{s.swapWith}</td>
                <td className="px-4 py-3 text-slate-500">{s.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge(s.status)}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => { setSelectedShift(s); setActiveModal('detail'); }}
                      title="Xem chi tiết"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-blue-600 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    {role !== 'EMPLOYEE' && s.status === 'Chờ duyệt' && (
                      <>
                        <button
                          onClick={() => handleApprove(s.id, 'Đã duyệt')}
                          title="Duyệt"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        </button>
                        <button
                          onClick={() => handleApprove(s.id, 'Từ chối')}
                          title="Từ chối"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      </>
                    )}
                    {(role !== 'EMPLOYEE' || s.status === 'Chờ duyệt') && (
                      <button
                        onClick={() => setConfirmDelete(s.id)}
                        title="Xóa"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backdrop */}
      {(activeModal || confirmDelete) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setSelectedShift(null); setConfirmDelete(null); }} />
      )}

      {/* Modal: New Request */}
      {activeModal === 'newRequest' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Đăng ký đổi ca</h2>
              <button type="button" onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              {role !== 'EMPLOYEE' && (
                <div>
                  <label className="form-label">Nhân viên yêu cầu <span className="text-red-500">*</span></label>
                  <input name="reqName" required placeholder="Nhập tên nhân viên" className="form-input" />
                </div>
              )}
              <div>
                <label className="form-label">Ca hiện tại <span className="text-red-500">*</span></label>
                <select name="currentShift" required className="form-input bg-white">
                  <option>Ca Sáng (08:00-17:00)</option>
                  <option>Ca Chiều (13:00-22:00)</option>
                  <option>Ca Tối (22:00-06:00)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Ca muốn đổi sang <span className="text-red-500">*</span></label>
                <select name="requestedShift" required className="form-input bg-white">
                  <option>Ca Chiều (13:00-22:00)</option>
                  <option>Ca Sáng (08:00-17:00)</option>
                  <option>Ca Tối (22:00-06:00)</option>
                </select>
              </div>
              <div>
                <label className="form-label">Đổi cùng với (nếu có)</label>
                <input name="swapWith" placeholder="Tên người đổi cùng" className="form-input" />
              </div>
              <div>
                <label className="form-label">Lý do <span className="text-red-500">*</span></label>
                <textarea required rows={3} name="reason" placeholder="Ghi rõ lý do xin đổi ca..." className="form-input resize-none" />
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[18px]">send</span>
                Gửi yêu cầu
              </button>
            </footer>
          </form>
        </div>
      )}

      {/* Detail Drawer */}
      {activeModal === 'detail' && selectedShift && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Chi tiết yêu cầu</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{selectedShift.id}</p>
            </div>
            <button type="button" onClick={() => { setActiveModal(null); setSelectedShift(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="card p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Nhân viên:</span>
                <span className="text-sm font-semibold text-slate-800">{selectedShift.name} ({selectedShift.empId})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Ca hiện tại:</span>
                <span className="text-sm text-slate-600">{selectedShift.currentShift}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Ca muốn đổi:</span>
                <span className="text-sm font-semibold text-blue-600">{selectedShift.requestedShift}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Đổi cùng:</span>
                <span className="text-sm text-slate-600">{selectedShift.swapWith}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Ngày yêu cầu:</span>
                <span className="text-sm text-slate-600">{selectedShift.date}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-sm text-slate-500">Trạng thái:</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge(selectedShift.status)}`}>{selectedShift.status}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            {role !== 'EMPLOYEE' && selectedShift.status === 'Chờ duyệt' && (
              <>
                <button type="button" onClick={() => handleApprove(selectedShift.id, 'Từ chối')} className="btn-danger">Từ chối</button>
                <button type="button" onClick={() => handleApprove(selectedShift.id, 'Đã duyệt')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span> Duyệt yêu cầu
                </button>
              </>
            )}
            <button type="button" onClick={() => { setActiveModal(null); setSelectedShift(null); }} className="btn-secondary">Đóng</button>
          </div>
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
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc chắn muốn xóa yêu cầu đổi ca này không?</p>
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
