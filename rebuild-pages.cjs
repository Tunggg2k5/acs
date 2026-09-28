// MASTER BUILD SCRIPT - Builds ALL pages with proper CRUD + role-based UI
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

// ============================================================
// ICa.tsx - Đổi ca (Role-aware: Employee sees own requests only; Manager/Admin see all + approve)
// ============================================================
const ICa = `import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

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

  const handleDelete = (id: string) => {
    setShifts(shifts.filter(s => s.id !== id));
  };

  const statusBadge = (st: string) => {
    const map: Record<string, string> = {
      'Chờ duyệt': 'bg-secondary-container/30 text-secondary',
      'Đã duyệt': 'bg-tertiary-container/30 text-tertiary',
      'Từ chối': 'bg-error-container/20 text-error',
    };
    return map[st] || 'bg-surface-container text-on-surface';
  };

  return (
    <>
      <div className="flex flex-col w-full gap-space-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Đổi ca</h1>
              <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-xs text-label-xs font-semibold">{visibleShifts.length} yêu cầu</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {role === 'EMPLOYEE' ? 'Yêu cầu đổi ca của bạn' : 'Quản lý tất cả yêu cầu đổi ca'}
            </span>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              onClick={() => setActiveModal('newRequest')}
              className="h-9 px-4 bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {role === 'EMPLOYEE' ? 'Đăng ký đổi ca' : 'Tạo yêu cầu'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest p-space-md flex flex-wrap items-center gap-space-sm shadow-sm">
          {['ALL', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={\`px-space-md py-1.5 font-label-md text-label-md transition-colors \${filterStatus === f ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'}\`}
              type="button"
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wide">
                <th className="py-2 px-3">Mã YC</th>
                {role !== 'EMPLOYEE' && <th className="py-2 px-3">Nhân viên</th>}
                <th className="py-2 px-3">Ca hiện tại</th>
                <th className="py-2 px-3">Ca muốn đổi</th>
                <th className="py-2 px-3">Đổi cùng</th>
                <th className="py-2 px-3">Ngày</th>
                <th className="py-2 px-3">Trạng thái</th>
                <th className="py-2 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {visibleShifts.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-on-surface-variant">Không có yêu cầu nào</td></tr>
              )}
              {visibleShifts.map(s => (
                <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-label-sm text-label-sm font-semibold text-primary">{s.id}</span>
                  </td>
                  {role !== 'EMPLOYEE' && (
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm font-semibold">{s.name}</span>
                        <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{s.empId}</span>
                      </div>
                    </td>
                  )}
                  <td className="py-2.5 px-3 text-on-surface-variant text-sm">{s.currentShift}</td>
                  <td className="py-2.5 px-3 text-on-surface text-sm font-semibold">{s.requestedShift}</td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-sm">{s.swapWith}</td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-sm">{s.date}</td>
                  <td className="py-2.5 px-3">
                    <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${statusBadge(s.status)}\`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => { setSelectedShift(s); setActiveModal('detail'); }}
                        title="Xem chi tiết"
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      {role !== 'EMPLOYEE' && s.status === 'Chờ duyệt' && (
                        <>
                          <button
                            onClick={() => handleApprove(s.id, 'Đã duyệt')}
                            title="Duyệt"
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-tertiary-container text-on-surface-variant hover:text-tertiary transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          </button>
                          <button
                            onClick={() => handleApprove(s.id, 'Từ chối')}
                            title="Từ chối"
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        </>
                      )}
                      {(role !== 'EMPLOYEE' || s.status === 'Chờ duyệt') && (
                        <button
                          onClick={() => handleDelete(s.id)}
                          title="Xóa"
                          className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"
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
      </div>

      {/* Backdrop */}
      {activeModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 z-40" onClick={() => { setActiveModal(null); setSelectedShift(null); }} />
      )}

      {/* Modal: New Request */}
      {activeModal === 'newRequest' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-14 px-space-lg flex items-center justify-between bg-primary text-on-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
                <span className="font-title-md text-title-md font-bold">Đăng ký đổi ca</span>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="text-on-primary hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-space-lg flex flex-col gap-space-md overflow-y-auto">
              {role !== 'EMPLOYEE' && (
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Nhân viên yêu cầu <span className="text-error">*</span></label>
                  <input name="reqName" required placeholder="Nhập tên nhân viên" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
                </div>
              )}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Ca hiện tại <span className="text-error">*</span></label>
                <select name="currentShift" required className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none">
                  <option>Ca Sáng (08:00-17:00)</option>
                  <option>Ca Chiều (13:00-22:00)</option>
                  <option>Ca Tối (22:00-06:00)</option>
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Ca muốn đổi sang <span className="text-error">*</span></label>
                <select name="requestedShift" required className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none">
                  <option>Ca Chiều (13:00-22:00)</option>
                  <option>Ca Sáng (08:00-17:00)</option>
                  <option>Ca Tối (22:00-06:00)</option>
                </select>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Đổi cùng với (nếu có)</label>
                <input name="swapWith" placeholder="Tên người đổi cùng" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Lý do <span className="text-error">*</span></label>
                <textarea required rows={3} name="reason" placeholder="Ghi rõ lý do xin đổi ca..." className="w-full px-3 py-2 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none resize-none" />
              </div>
            </div>
            <div className="h-14 px-space-lg border-t border-outline-variant/30 flex items-center justify-end gap-space-sm bg-surface">
              <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Hủy</button>
              <button type="submit" className="h-9 px-5 bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">send</span>Gửi yêu cầu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drawer: Detail / Approval */}
      {activeModal === 'detail' && selectedShift && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end">
          <div className="w-full md:w-[420px] h-full bg-surface-container-lowest flex flex-col shadow-2xl">
            <div className="h-14 px-space-md bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">description</span>
                <div>
                  <div className="font-title-md text-title-md font-bold">Chi tiết yêu cầu</div>
                  <div className="font-label-xs text-label-xs opacity-80">{selectedShift.id}</div>
                </div>
              </div>
              <button type="button" onClick={() => { setActiveModal(null); setSelectedShift(null); }} className="text-on-primary hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-md">
              <div className="bg-surface-container-low rounded p-space-md flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Nhân viên:</span>
                  <span className="font-semibold text-sm">{selectedShift.name} ({selectedShift.empId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Ca hiện tại:</span>
                  <span className="text-sm">{selectedShift.currentShift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Ca muốn đổi:</span>
                  <span className="font-semibold text-sm text-primary">{selectedShift.requestedShift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Đổi cùng:</span>
                  <span className="text-sm">{selectedShift.swapWith}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant text-sm">Ngày yêu cầu:</span>
                  <span className="text-sm">{selectedShift.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant text-sm">Trạng thái:</span>
                  <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${statusBadge(selectedShift.status)}\`}>{selectedShift.status}</span>
                </div>
              </div>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-space-sm">
              {role !== 'EMPLOYEE' && selectedShift.status === 'Chờ duyệt' && (
                <>
                  <button type="button" onClick={() => handleApprove(selectedShift.id, 'Từ chối')} className="h-9 px-4 bg-error-container text-error font-label-md text-label-md hover:bg-error hover:text-on-error">Từ chối</button>
                  <button type="button" onClick={() => handleApprove(selectedShift.id, 'Đã duyệt')} className="h-9 px-5 bg-tertiary text-on-tertiary font-label-md text-label-md hover:bg-tertiary-container shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>Duyệt yêu cầu
                  </button>
                </>
              )}
              <button type="button" onClick={() => { setActiveModal(null); setSelectedShift(null); }} className="h-9 px-4 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

// ============================================================
// QuNLPhiU.tsx - Quản lý phiếu (Role-aware)
// ============================================================
const QuNLPhiU = `import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

type Ticket = {
  id: string; empId: string; name: string; dept: string;
  type: string; fromDate: string; toDate: string; reason: string;
  status: string; createdAt: string;
};

export default function QuNLPhiU() {
  const { role } = useRole();
  const [activeModal, setActiveModal] = useState<string|null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket|null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'YC-20231026-001', empId: 'NV001', name: 'Nguyễn Văn An', dept: 'Ban Giám đốc', type: 'Nghỉ phép', fromDate: '28/10/2023', toDate: '29/10/2023', reason: 'Việc cá nhân', status: 'Đã duyệt', createdAt: '26/10/2023' },
    { id: 'YC-20231025-002', empId: 'NV015', name: 'Trần Thị Mai', dept: 'Phòng HR', type: 'Giải trình', fromDate: '25/10/2023', toDate: '25/10/2023', reason: 'Giải trình đi muộn do kẹt xe', status: 'Chờ duyệt', createdAt: '25/10/2023' },
    { id: 'YC-20231024-003', empId: 'NV008', name: 'Lê Văn Bình', dept: 'Phòng IT', type: 'OT', fromDate: '24/10/2023', toDate: '24/10/2023', reason: 'Tăng ca hoàn thiện dự án', status: 'Từ chối', createdAt: '24/10/2023' },
    { id: 'YC-20231023-004', empId: 'NV012', name: 'Phạm Thị Lan', dept: 'Phòng KT', type: 'Nghỉ ốm', fromDate: '23/10/2023', toDate: '23/10/2023', reason: 'Bị ốm', status: 'Đã duyệt', createdAt: '23/10/2023' },
  ]);

  const myEmpId = role === 'EMPLOYEE' ? 'NV015' : null;
  const visibleTickets = tickets.filter(t =>
    (myEmpId ? t.empId === myEmpId : true) &&
    (filterStatus === 'ALL' || t.status === filterStatus)
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget.elements as any;
    const newTicket: Ticket = {
      id: 'YC-' + Date.now().toString().slice(-9),
      empId: myEmpId || 'NV_NEW',
      name: role === 'EMPLOYEE' ? 'Trần Thị Mai' : (f.empName?.value || 'Nhân viên'),
      dept: f.empDept?.value || 'Phòng IT',
      type: f.ticketType?.value || 'Nghỉ phép',
      fromDate: f.fromDate?.value || '',
      toDate: f.toDate?.value || '',
      reason: f.reason?.value || '',
      status: 'Chờ duyệt',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    setTickets([newTicket, ...tickets]);
    setActiveModal(null);
  };

  const handleApprove = (id: string, status: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
    setSelectedTicket(prev => prev?.id === id ? { ...prev, status } : prev);
    if (status !== 'Chờ duyệt') { setActiveModal(null); setSelectedTicket(null); }
  };

  const handleDelete = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const statusBadge = (st: string) => {
    const map: Record<string, string> = {
      'Chờ duyệt': 'bg-secondary-container/30 text-secondary',
      'Đã duyệt': 'bg-tertiary-container/30 text-tertiary',
      'Từ chối': 'bg-error-container/20 text-error',
    };
    return map[st] || 'bg-surface-container text-on-surface';
  };

  return (
    <>
      <div className="flex flex-col w-full gap-space-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
                {role === 'EMPLOYEE' ? 'Phiếu của tôi' : 'Quản lý phiếu'}
              </h1>
              <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-xs text-label-xs font-semibold">{visibleTickets.length} phiếu</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {role === 'EMPLOYEE' ? 'Tạo và theo dõi phiếu yêu cầu của bạn' : 'Xem xét và phê duyệt phiếu yêu cầu nhân viên'}
            </span>
          </div>
          <button
            onClick={() => setActiveModal('createTicket')}
            className="inline-flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md h-9 rounded font-label-md text-label-md transition-all shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            + Tạo phiếu mới
          </button>
        </div>

        {/* Filter tabs */}
        <div className="bg-surface-container-lowest p-space-sm flex flex-wrap gap-2 shadow-sm">
          {['ALL', 'Chờ duyệt', 'Đã duyệt', 'Từ chối'].map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={\`px-space-md py-1.5 font-label-md text-label-md rounded transition-colors \${filterStatus === f ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}\`}
              type="button"
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wide">
                <th className="py-2.5 px-3">Mã phiếu</th>
                {role !== 'EMPLOYEE' && <th className="py-2.5 px-3">Nhân viên</th>}
                {role !== 'EMPLOYEE' && <th className="py-2.5 px-3">Phòng ban</th>}
                <th className="py-2.5 px-3">Loại phiếu</th>
                <th className="py-2.5 px-3">Từ ngày</th>
                <th className="py-2.5 px-3">Đến ngày</th>
                <th className="py-2.5 px-3">Trạng thái</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {visibleTickets.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-on-surface-variant">Không có phiếu nào</td></tr>
              )}
              {visibleTickets.map(t => (
                <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-label-sm font-semibold text-primary">{t.id}</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant">{t.createdAt}</span>
                    </div>
                  </td>
                  {role !== 'EMPLOYEE' && (
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm font-semibold">{t.name}</span>
                        <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{t.empId}</span>
                      </div>
                    </td>
                  )}
                  {role !== 'EMPLOYEE' && <td className="py-2.5 px-3 text-on-surface-variant text-sm">{t.dept}</td>}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-xs text-label-xs font-semibold">{t.type}</span>
                  </td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-sm">{t.fromDate}</td>
                  <td className="py-2.5 px-3 text-on-surface-variant text-sm">{t.toDate}</td>
                  <td className="py-2.5 px-3">
                    <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${statusBadge(t.status)}\`}>{t.status}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setSelectedTicket(t); setActiveModal('detail'); }} title="Xem chi tiết" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" type="button">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      {role !== 'EMPLOYEE' && t.status === 'Chờ duyệt' && (
                        <>
                          <button onClick={() => handleApprove(t.id, 'Đã duyệt')} title="Duyệt" className="w-8 h-8 flex items-center justify-center rounded hover:bg-tertiary-container text-on-surface-variant hover:text-tertiary transition-colors" type="button">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          </button>
                          <button onClick={() => handleApprove(t.id, 'Từ chối')} title="Từ chối" className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" type="button">
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        </>
                      )}
                      {(role !== 'EMPLOYEE' || t.status === 'Chờ duyệt') && (
                        <button onClick={() => handleDelete(t.id)} title="Xóa" className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors" type="button">
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
      </div>

      {/* Backdrop */}
      {activeModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 z-40" onClick={() => { setActiveModal(null); setSelectedTicket(null); }} />
      )}

      {/* Modal: Create Ticket */}
      {activeModal === 'createTicket' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-14 px-space-lg flex items-center justify-between bg-primary text-on-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">assignment_add</span>
                <span className="font-title-md text-title-md font-bold">Tạo phiếu yêu cầu mới</span>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="text-on-primary hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-space-lg flex flex-col gap-space-md overflow-y-auto max-h-[60vh]">
              {role !== 'EMPLOYEE' && (
                <>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Nhân viên <span className="text-error">*</span></label>
                    <input name="empName" required placeholder="Họ và tên nhân viên" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Phòng ban</label>
                    <input name="empDept" placeholder="Phòng ban" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
                  </div>
                </>
              )}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Loại phiếu <span className="text-error">*</span></label>
                <select name="ticketType" required className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none">
                  <option>Nghỉ phép</option>
                  <option>Nghỉ ốm</option>
                  <option>Giải trình</option>
                  <option>OT</option>
                  <option>Điều chỉnh công</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-space-md">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Từ ngày <span className="text-error">*</span></label>
                  <input name="fromDate" required type="date" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none cursor-pointer" />
                </div>
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Đến ngày <span className="text-error">*</span></label>
                  <input name="toDate" required type="date" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Lý do <span className="text-error">*</span></label>
                <textarea name="reason" required rows={3} placeholder="Ghi rõ lý do..." className="w-full px-3 py-2 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none resize-none" />
              </div>
            </div>
            <div className="h-14 px-space-lg border-t border-outline-variant/30 flex items-center justify-end gap-space-sm bg-surface">
              <button type="button" onClick={() => setActiveModal(null)} className="h-9 px-4 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Hủy</button>
              <button type="submit" className="h-9 px-5 bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-sm">Gửi yêu cầu</button>
            </div>
          </form>
        </div>
      )}

      {/* Drawer: Detail */}
      {activeModal === 'detail' && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end">
          <div className="w-full md:w-[440px] h-full bg-surface-container-lowest flex flex-col shadow-2xl">
            <div className="h-14 px-space-md bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">assignment</span>
                <div>
                  <div className="font-title-md text-title-md font-bold">Chi tiết phiếu</div>
                  <div className="font-label-xs text-label-xs opacity-80">{selectedTicket.id}</div>
                </div>
              </div>
              <button type="button" onClick={() => { setActiveModal(null); setSelectedTicket(null); }} className="text-on-primary hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-md">
              <div className="bg-surface-container-low rounded p-space-md flex flex-col gap-2">
                {role !== 'EMPLOYEE' && (
                  <>
                    <div className="flex justify-between"><span className="text-on-surface-variant text-sm">Nhân viên:</span><span className="font-semibold text-sm">{selectedTicket.name}</span></div>
                    <div className="flex justify-between"><span className="text-on-surface-variant text-sm">Phòng ban:</span><span className="text-sm">{selectedTicket.dept}</span></div>
                  </>
                )}
                <div className="flex justify-between"><span className="text-on-surface-variant text-sm">Loại phiếu:</span><span className="font-semibold text-sm text-primary">{selectedTicket.type}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant text-sm">Từ ngày:</span><span className="text-sm">{selectedTicket.fromDate}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant text-sm">Đến ngày:</span><span className="text-sm">{selectedTicket.toDate}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant text-sm">Lý do:</span><span className="text-sm">{selectedTicket.reason}</span></div>
                <div className="flex justify-between items-center"><span className="text-on-surface-variant text-sm">Trạng thái:</span>
                  <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${statusBadge(selectedTicket.status)}\`}>{selectedTicket.status}</span>
                </div>
              </div>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-space-sm">
              {role !== 'EMPLOYEE' && selectedTicket.status === 'Chờ duyệt' && (
                <>
                  <button type="button" onClick={() => handleApprove(selectedTicket.id, 'Từ chối')} className="h-9 px-4 bg-error-container text-error font-label-md text-label-md hover:bg-error hover:text-on-error">Từ chối</button>
                  <button type="button" onClick={() => handleApprove(selectedTicket.id, 'Đã duyệt')} className="h-9 px-5 bg-tertiary text-on-tertiary font-label-md text-label-md hover:bg-tertiary-container shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>Phê duyệt
                  </button>
                </>
              )}
              <button type="button" onClick={() => { setActiveModal(null); setSelectedTicket(null); }} className="h-9 px-4 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

// ============================================================
// QuNLNgIDNg.tsx - Quản lý người dùng (Admin only features)
// ============================================================
const QuNLNgIDNg = `import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

type User = {
  id: string; username: string; name: string; dept: string;
  title: string; role: string; email: string; phone: string; status: string;
};

export default function QuNLNgIDNg() {
  const { role } = useRole();
  const [activeModal, setActiveModal] = useState<string|null>(null);
  const [selectedUser, setSelectedUser] = useState<User|null>(null);
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

  const roleBadge = (r: string) => {
    const map: Record<string, string> = { 'Admin': 'bg-primary text-on-primary', 'Manager': 'bg-secondary-container text-secondary', 'Employee': 'bg-surface-container text-on-surface' };
    return map[r] || 'bg-surface-container text-on-surface';
  };

  return (
    <>
      <div className="flex flex-col w-full gap-space-md">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm bg-surface-container-lowest p-space-md shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-sm">
              <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Quản lý người dùng</h1>
              <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-label-xs text-label-xs font-semibold">{users.length} tài khoản</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Quản lý tài khoản và phân quyền người dùng trong hệ thống</span>
          </div>
          {role === 'ADMIN' && (
            <button onClick={() => { setSelectedUser(null); setActiveModal('add'); }} className="inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary px-space-md h-9 rounded font-label-md text-label-md transition-colors shadow-sm" type="button">
              <span className="material-symbols-outlined text-[18px]">person_add</span>+ Thêm người dùng
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-surface-container-lowest p-space-md flex flex-wrap items-center gap-space-sm shadow-sm">
          <div className="flex-1 min-w-[200px] relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên, mã NV..."
              className="w-full h-9 pl-8 pr-3 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className="h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded outline-none focus:ring-1 focus:ring-primary">
            <option value="ALL">Tất cả role</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Employee</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded outline-none focus:ring-1 focus:ring-primary">
            <option value="ALL">Tất cả trạng thái</option>
            <option>Hoạt động</option>
            <option>Khóa</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest shadow-sm overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wide">
                <th className="py-2 px-3">Mã / TK</th>
                <th className="py-2 px-3">Họ và tên</th>
                <th className="py-2 px-3">Phòng ban</th>
                <th className="py-2 px-3">Chức vụ</th>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Trạng thái</th>
                <th className="py-2 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {visibleUsers.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-on-surface-variant">Không tìm thấy người dùng</td></tr>
              )}
              {visibleUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-2 px-3">
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-semibold text-primary">{u.id}</span>
                      <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{u.username}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 font-label-md text-label-md text-on-surface font-semibold">{u.name}</td>
                  <td className="py-2 px-3 text-on-surface text-sm">{u.dept}</td>
                  <td className="py-2 px-3 text-on-surface-variant text-sm">{u.title}</td>
                  <td className="py-2 px-3">
                    <span className={\`inline-flex items-center px-1.5 py-0.5 rounded font-label-xs text-label-xs font-semibold \${roleBadge(u.role)}\`}>{u.role}</span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${u.status === 'Hoạt động' ? 'bg-tertiary-container/15 text-tertiary' : 'bg-error-container/15 text-error'}\`}>
                      <span className={\`w-1.5 h-1.5 rounded-full \${u.status === 'Hoạt động' ? 'bg-tertiary' : 'bg-error'}\`}></span>{u.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <div className="inline-flex items-center justify-center gap-1">
                      <button type="button" title="Xem chi tiết" onClick={() => { setSelectedUser(u); setActiveModal('view'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      {role === 'ADMIN' && (
                        <>
                          <button type="button" title="Chỉnh sửa" onClick={() => { setSelectedUser(u); setActiveModal('edit'); }} className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-container hover:text-primary transition-colors text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button type="button" title="Xóa" onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="w-7 h-7 flex items-center justify-center rounded hover:bg-error-container hover:text-error transition-colors text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                          <button type="button" title="Khóa tài khoản" onClick={() => setUsers(users.map(x => x.id === u.id ? { ...x, status: x.status === 'Hoạt động' ? 'Khóa' : 'Hoạt động' } : x))} className={\`w-7 h-7 flex items-center justify-center rounded hover:bg-error-container transition-colors \${u.status === 'Hoạt động' ? 'text-on-surface-variant hover:text-error' : 'text-tertiary hover:text-tertiary'}\`}>
                            <span className="material-symbols-outlined text-[18px]">{u.status === 'Hoạt động' ? 'lock' : 'lock_open'}</span>
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
      </div>

      {/* Backdrop */}
      {activeModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 z-40" onClick={() => { setActiveModal(null); setSelectedUser(null); }} />
      )}

      {/* Modal: Add / Edit User */}
      {(activeModal === 'add' || activeModal === 'edit') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="h-14 px-space-lg flex items-center justify-between bg-primary text-on-primary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">{activeModal === 'edit' ? 'edit' : 'person_add'}</span>
                <span className="font-title-md text-title-md font-bold">{activeModal === 'edit' ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</span>
              </div>
              <button type="button" onClick={() => { setActiveModal(null); setSelectedUser(null); }} className="text-on-primary hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-space-lg grid grid-cols-2 gap-space-md overflow-y-auto max-h-[65vh]">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Mã NV <span className="text-error">*</span></label>
                <input name="uId" required defaultValue={selectedUser?.id || ''} placeholder="VD: NV010" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Tài khoản <span className="text-error">*</span></label>
                <input name="uUsername" required defaultValue={selectedUser?.username || ''} placeholder="ten.nv" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none font-mono" />
              </div>
              <div className="col-span-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Họ và tên <span className="text-error">*</span></label>
                <input name="uName" required defaultValue={selectedUser?.name || ''} placeholder="Nhập đầy đủ họ và tên" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Phòng ban <span className="text-error">*</span></label>
                <input name="uDept" required defaultValue={selectedUser?.dept || ''} placeholder="Phòng ban" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Chức vụ <span className="text-error">*</span></label>
                <input name="uTitle" required defaultValue={selectedUser?.title || ''} placeholder="Chức vụ" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Email <span className="text-error">*</span></label>
                <input name="uEmail" type="email" required defaultValue={selectedUser?.email || ''} placeholder="email@company.com" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Số điện thoại</label>
                <input name="uPhone" defaultValue={selectedUser?.phone || ''} placeholder="09xx xxx xxx" className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Vai trò <span className="text-error">*</span></label>
                <select name="uRole" required defaultValue={selectedUser?.role || 'Employee'} className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Employee</option>
                </select>
              </div>
              {activeModal === 'edit' && (
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Trạng thái</label>
                  <select name="uStatus" defaultValue={selectedUser?.status || 'Hoạt động'} className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-body-sm rounded border border-outline-variant focus:border-primary focus:outline-none">
                    <option>Hoạt động</option>
                    <option>Khóa</option>
                  </select>
                </div>
              )}
            </div>
            <div className="h-14 px-space-lg border-t border-outline-variant/30 flex items-center justify-end gap-space-sm bg-surface">
              <button type="button" onClick={() => { setActiveModal(null); setSelectedUser(null); }} className="h-9 px-4 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Hủy</button>
              <button type="submit" className="h-9 px-5 bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">save</span>Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drawer: View Detail */}
      {activeModal === 'view' && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end">
          <div className="w-full md:w-[380px] h-full bg-surface-container-lowest flex flex-col shadow-2xl">
            <div className="h-14 px-space-md bg-primary text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <div>
                  <div className="font-title-md text-title-md font-bold">Chi tiết</div>
                  <div className="font-label-xs text-label-xs opacity-80">{selectedUser.id} - {selectedUser.name}</div>
                </div>
              </div>
              <button type="button" onClick={() => { setActiveModal(null); setSelectedUser(null); }} className="text-on-primary hover:opacity-80">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded">
                <div className="w-12 h-12 rounded bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shrink-0">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface font-bold">{selectedUser.name}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">{selectedUser.title}</div>
                  <span className={\`inline-flex items-center px-1.5 py-0.5 rounded font-label-xs text-label-xs font-semibold mt-0.5 \${roleBadge(selectedUser.role)}\`}>{selectedUser.role}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Mã nhân viên', value: selectedUser.id },
                  { label: 'Tài khoản', value: selectedUser.username },
                  { label: 'Phòng ban', value: selectedUser.dept },
                  { label: 'Email', value: selectedUser.email },
                  { label: 'Điện thoại', value: selectedUser.phone },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-1 border-b border-outline-variant/30">
                    <span className="text-on-surface-variant text-sm">{row.label}:</span>
                    <span className="font-semibold text-sm text-on-surface">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-space-sm">
              {role === 'ADMIN' && (
                <button type="button" onClick={() => setActiveModal('edit')} className="h-9 px-4 bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">edit</span>Chỉnh sửa
                </button>
              )}
              <button type="button" onClick={() => { setActiveModal(null); setSelectedUser(null); }} className="h-9 px-4 bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

fs.writeFileSync(path.join(srcDir, 'ICa.tsx'), ICa, 'utf8');
console.log('✓ ICa.tsx written');
fs.writeFileSync(path.join(srcDir, 'QuNLPhiU.tsx'), QuNLPhiU, 'utf8');
console.log('✓ QuNLPhiU.tsx written');
fs.writeFileSync(path.join(srcDir, 'QuNLNgIDNg.tsx'), QuNLNgIDNg, 'utf8');
console.log('✓ QuNLNgIDNg.tsx written');
