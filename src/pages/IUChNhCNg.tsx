import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

type Record_ = {
  empId: string; name: string; dept: string; date: string;
  checkInOrig: string; checkOutOrig: string;
  checkInAdj: string; checkOutAdj: string;
  adjBy: string; reason: string; status: string;
};

const INIT_RECORDS: Record_[] = [
  { empId:'NV0092', name:'Vũ Minh Tuấn',   dept:'Phát triển Phần mềm',  date:'18/10/2023', checkInOrig:'08:48', checkOutOrig:'17:32', checkInAdj:'08:30', checkOutAdj:'17:32', adjBy:'Nguyễn Văn An', reason:'Lỗi công quẹt vận tay cửa phòng tầng 1, trưởng bộ phận xác nhận mặt tại văn phòng lúc 08:28.',      status:'Đã can thiệp' },
  { empId:'NV0104', name:'Lê Thị Mai',      dept:'Tài chính Kế toán',    date:'18/10/2023', checkInOrig:'08:25', checkOutOrig:'—:—',   checkInAdj:'08:25', checkOutAdj:'17:35', adjBy:'Trần Hoàng Yên', reason:'Quên chấm công chiều do họp đột xuất tại phòng Giám đốc. Có biên bản họp xác nhận.',               status:'Đã can thiệp' },
  { empId:'NV0045', name:'Đỗ Hữu Thắng',   dept:'Kinh doanh Khối B2B', date:'17/10/2023', checkInOrig:'—:—',   checkOutOrig:'—:—',   checkInAdj:'—:—',   checkOutAdj:'—:—',   adjBy:'—',             reason:'Chưa có điều chỉnh',                                                                                       status:'Chờ xử lý' },
  { empId:'NV0188', name:'Phạm Thu Trang',  dept:'Nhân sự & Tuyển dụng', date:'16/10/2023', checkInOrig:'08:15', checkOutOrig:'16:10', checkInAdj:'08:15', checkOutAdj:'17:30', adjBy:'Nguyễn Văn An', reason:'Được duyệt ra sớm 1h làm việc bù theo giấy điều chuyển công tác đã được phê duyệt trước đó.',        status:'Đã can thiệp' },
  { empId:'NV0055', name:'Hoàng Văn Phúc',  dept:'Kỹ thuật',             date:'16/10/2023', checkInOrig:'09:12', checkOutOrig:'17:00', checkInAdj:'08:00', checkOutAdj:'17:00', adjBy:'Nguyễn Văn An', reason:'Nhân viên có mặt đúng giờ nhưng thiết bị máy chấm công tầng 2 bị lỗi cảm biến từ 07:50 - 09:05.',   status:'Đã can thiệp' },
];

export default function IUChNhCNg() {
  const { role } = useRole();
  const [filterEmp, setFilterEmp] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [records, setRecords] = useState<Record_[]>(INIT_RECORDS);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record_ | null>(null);

  if (role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-red-500 text-4xl">lock</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Không có quyền truy cập</h2>
        <p className="text-sm text-slate-500 max-w-sm">Chức năng Điều chỉnh công chỉ dành cho Admin.</p>
      </div>
    );
  }

  const visible = records.filter(r =>
    (filterEmp === '' || r.empId.toLowerCase().includes(filterEmp.toLowerCase()) || r.name.toLowerCase().includes(filterEmp.toLowerCase())) &&
    (filterStatus === 'ALL' || r.status === filterStatus)
  );

  const handleAdjust = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!selected) return;
    const f = ev.currentTarget.elements as any;
    setRecords(records.map(r => r.empId === selected.empId && r.date === selected.date
      ? { ...r, checkInAdj: f.checkIn.value, checkOutAdj: f.checkOut.value, reason: f.reason.value, adjBy: 'Nguyễn Văn An', status: 'Đã can thiệp' }
      : r
    ));
    setActiveModal(null); setSelected(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Chấm công · Thao tác nghiệp vụ</span>
          </div>
          <h1 className="page-title">Điều chỉnh chấm công</h1>
          <p className="mt-1 text-sm text-slate-500">HR/Admin can thiệp sửa giờ vào/ra, bổ sung ngày công khi máy lỗi hoặc có xác nhận bằng văn bản hợp lệ.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={()=>window.alert('Đã xuất nhật ký điều chỉnh')} className="btn-secondary">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất nhật ký
          </button>
          <button type="button" onClick={() => setActiveModal('history')} className="btn-secondary">
            <span className="material-symbols-outlined text-[18px]">history</span>
            Lịch sử can thiệp
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="form-label">Nhân viên / Mã NV</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-400">search</span>
              <input value={filterEmp} onChange={e => setFilterEmp(e.target.value)}
                placeholder="Tìm kiếm..."
                className="form-input pl-9" />
            </div>
          </div>
          <div className="min-w-[160px]">
            <label className="form-label">Trạng thái dữ liệu</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="form-input">
              <option value="ALL">Tất cả bản ghi</option>
              <option value="Đã can thiệp">Đã can thiệp</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
            </select>
          </div>
          <div>
            <button type="button" onClick={() => { setFilterEmp(''); setFilterStatus('ALL'); }}
              className="btn-secondary">
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3">Mã NV</th>
                <th className="px-4 py-3">Nhân viên</th>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3 text-center">Vào gốc</th>
                <th className="px-4 py-3 text-center">Ra gốc</th>
                <th className="px-4 py-3 text-center text-blue-600">Vào chỉnh</th>
                <th className="px-4 py-3 text-center text-blue-600">Ra chỉnh</th>
                <th className="px-4 py-3">Người chỉnh</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="material-symbols-outlined text-slate-300 text-5xl">inbox</span>
                      <p className="text-sm text-slate-400">Không có bản ghi phù hợp</p>
                    </div>
                  </td>
                </tr>
              ) : visible.map(r => (
                <tr key={r.empId + r.date} className="text-sm hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-semibold text-blue-600">{r.empId}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{r.name}</div>
                    <div className="text-xs text-slate-400">{r.dept}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.date}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${r.checkInOrig === '—:—' || r.checkInOrig > '08:05' ? 'text-red-500' : 'text-slate-900'}`}>{r.checkInOrig}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-900">{r.checkOutOrig}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-blue-600">{r.checkInAdj}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-blue-600">{r.checkOutAdj}</span>
                  </td>
                  <td className="px-4 py-3">
                    {r.adjBy !== '—' ? (
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{r.adjBy}</span>
                    ) : <span className="text-slate-300">–</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${r.status === 'Đã can thiệp' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setSelected(r); setActiveModal('detail'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Chi tiết">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button onClick={() => { setSelected(r); setActiveModal('adjust'); }} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition" title="Can thiệp">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Can thiệp
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Backdrop */}
      {activeModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setSelected(null); }} />}

      {/* Detail Modal */}
      {activeModal === 'detail' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Chi tiết điều chỉnh</h2>
              <button onClick={() => { setActiveModal(null); setSelected(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { l: 'Mã nhân viên', v: selected.empId },
                  { l: 'Họ tên', v: selected.name },
                  { l: 'Phòng ban', v: selected.dept },
                  { l: 'Ngày làm việc', v: selected.date },
                  { l: 'Giờ vào gốc', v: selected.checkInOrig },
                  { l: 'Giờ ra gốc', v: selected.checkOutOrig },
                  { l: 'Giờ vào sau chỉnh', v: selected.checkInAdj },
                  { l: 'Giờ ra sau chỉnh', v: selected.checkOutAdj },
                  { l: 'Người điều chỉnh', v: selected.adjBy },
                  { l: 'Trạng thái', v: selected.status },
                ].map(row => (
                  <div key={row.l} className="flex flex-col bg-slate-50 rounded-lg p-3">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">{row.l}</span>
                    <span className="text-sm font-semibold text-slate-900 mt-1">{row.v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Lý do điều chỉnh:</div>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 italic border-l-4 border-blue-500">
                  {selected.reason}
                </div>
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => { setActiveModal(null); setSelected(null); }} className="btn-secondary">Đóng</button>
              <button onClick={() => { setActiveModal('adjust'); }} className="btn-primary">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Can thiệp
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {activeModal === 'adjust' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdjust} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Can thiệp chỉnh sửa</h2>
              <button type="button" onClick={() => { setActiveModal(null); setSelected(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <span className="material-symbols-outlined text-blue-500 text-[18px]">person</span>
                <span className="text-sm font-semibold text-blue-900">{selected.name} ({selected.empId}) – {selected.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Giờ vào sau chỉnh</label>
                  <input name="checkIn" type="time" defaultValue={selected.checkInAdj !== '—:—' ? selected.checkInAdj.replace(':','') : '08:30'}
                    className="form-input" />
                </div>
                <div>
                  <label className="form-label">Giờ ra sau chỉnh</label>
                  <input name="checkOut" type="time" defaultValue={selected.checkOutAdj !== '—:—' ? selected.checkOutAdj.replace(':','') : '17:30'}
                    className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Lý do can thiệp <span className="text-red-500">*</span></label>
                <textarea name="reason" required rows={4} defaultValue={selected.reason}
                  className="form-input resize-none" />
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => { setActiveModal(null); setSelected(null); }} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Lưu điều chỉnh
              </button>
            </footer>
          </form>
        </div>
      )}

      {/* History Modal */}
      {activeModal === 'history' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in flex flex-col max-h-[80vh]">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
              <h2 className="text-base font-bold text-slate-900">Lịch sử can thiệp chấm công</h2>
              <button type="button" onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {records.filter(r => r.status === 'Đã can thiệp').map(r => (
                <div key={r.empId + r.date} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                  <span className="material-symbols-outlined text-[20px] text-blue-500 shrink-0 mt-0.5">edit_calendar</span>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.name} ({r.empId}) – {r.date}</div>
                    <div className="text-sm text-slate-600 mt-1">{r.reason}</div>
                    <div className="text-xs text-slate-400 mt-2">Người điều chỉnh: <span className="font-semibold text-slate-700">{r.adjBy}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 shrink-0">
              <button type="button" onClick={() => setActiveModal(null)} className="btn-secondary">Đóng</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
