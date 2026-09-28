import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

// Mock schedule data per role
const allSchedules = {
  ADMIN: [
    { emp: 'Nguyễn Văn An',   empId: 'NV001', dept: 'Ban GĐ',   shift: 'Ca Sáng', days: ['T2','T3','T4','T5','T6'], week: '23/10 - 27/10' },
    { emp: 'Lê Thanh Bình',   empId: 'NV002', dept: 'Phòng IT',  shift: 'Ca Sáng', days: ['T2','T3','T4','T5','T6'], week: '23/10 - 27/10' },
    { emp: 'Trần Thị Mai',    empId: 'NV003', dept: 'Phòng KT',  shift: 'Ca Chiều',days: ['T2','T3','T4','T5','T6'], week: '23/10 - 27/10' },
    { emp: 'Nguyễn Văn Hùng', empId: 'NV004', dept: 'Phòng IT',  shift: 'Ca Sáng', days: ['T2','T3','T4','T5'],      week: '23/10 - 27/10' },
    { emp: 'Phạm Thị Lan',    empId: 'NV005', dept: 'Phòng HR',  shift: 'Ca Tối',  days: ['T3','T4','T5','T6','T7'], week: '23/10 - 27/10' },
  ],
  MANAGER: [
    { emp: 'Lê Thanh Bình',   empId: 'NV002', dept: 'Phòng IT',  shift: 'Ca Sáng', days: ['T2','T3','T4','T5','T6'], week: '23/10 - 27/10' },
    { emp: 'Nguyễn Văn Hùng', empId: 'NV004', dept: 'Phòng IT',  shift: 'Ca Sáng', days: ['T2','T3','T4','T5'],      week: '23/10 - 27/10' },
  ],
  EMPLOYEE: [
    { emp: 'Trần Thị Mai',    empId: 'NV003', dept: 'Phòng KT',  shift: 'Ca Chiều',days: ['T2','T3','T4','T5','T6'], week: '23/10 - 27/10' },
  ],
};

const weekDays = ['T2','T3','T4','T5','T6','T7','CN'];
const shiftMap: Record<string, string> = {
  'Ca Sáng':  'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500',
  'Ca Chiều': 'bg-amber-50 text-amber-700 border-l-4 border-amber-500',
  'Ca Tối':   'bg-blue-50 text-blue-700 border-l-4 border-blue-500',
};

export default function LChLMViC() {
  const { role } = useRole();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<any>(null);
  
  const visibleSchedules = role === 'ADMIN' ? allSchedules.ADMIN
    : role === 'MANAGER' ? allSchedules.MANAGER
    : allSchedules.EMPLOYEE;

  const canEdit = role === 'ADMIN' || role === 'MANAGER';

  const handleAssign = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Lịch làm việc</h1>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Tuần 23/10 – 27/10
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {role === 'EMPLOYEE' ? 'Lịch làm việc cá nhân của bạn' : role === 'MANAGER' ? 'Lịch làm việc nhóm bạn quản lý' : 'Lịch làm việc toàn công ty'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
            {(['calendar', 'list'] as const).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setViewMode(v)}
                className={`h-9 px-4 flex items-center gap-2 text-sm font-medium transition-colors ${viewMode === v ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className="material-symbols-outlined text-[16px]">{v === 'calendar' ? 'calendar_month' : 'list'}</span>
                {v === 'calendar' ? 'Lưới' : 'Danh sách'}
              </button>
            ))}
          </div>
          {canEdit && (
            <button onClick={() => setActiveModal('assign')} type="button" className="btn-primary">
              <span className="material-symbols-outlined text-[18px]">add</span>
              {role === 'MANAGER' ? 'Phân ca team' : 'Phân ca'}
            </button>
          )}
        </div>
      </div>

      {viewMode === 'calendar' ? (
        /* CALENDAR GRID VIEW */
        <div className="card overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 border-r border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider w-48 text-center">
                  {role === 'EMPLOYEE' ? 'Ca làm việc' : 'Nhân sự'}
                </th>
                {weekDays.map(d => (
                  <th key={d} className="py-3 px-4 border-r border-slate-200 text-center last:border-0">
                    <div className="font-bold text-sm text-slate-700">{d}</div>
                    <div className="text-xs text-slate-400 font-normal">Tháng 10</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleSchedules.map((row, idx) => (
                <tr key={row.empId} className={`group ${idx !== visibleSchedules.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <td className="p-4 border-r border-slate-200 bg-white align-top">
                    {role === 'EMPLOYEE' ? (
                      <div className="font-bold text-blue-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        {row.shift}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{row.emp}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{row.dept}</span>
                        <span className="font-mono text-[10px] text-blue-600 mt-1">{row.empId}</span>
                      </div>
                    )}
                  </td>
                  {weekDays.map((d, i) => {
                    const isWorking = row.days.includes(d);
                    return (
                      <td key={d} className={`p-2 border-r border-slate-100 align-top h-28 transition-colors ${isWorking ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60'} ${i === weekDays.length - 1 ? 'border-r-0' : ''}`}>
                        {isWorking ? (
                          <button type="button" onClick={() => { if (canEdit) { setEditRow(row); setActiveModal('assign'); } }} className={`w-full p-3 rounded-xl flex flex-col gap-1 text-left shadow-sm hover:shadow transition-shadow ${shiftMap[row.shift] || ''}`}>
                            <span className="font-bold text-sm">{row.shift}</span>
                            <span className="text-xs opacity-70">08:00 - 17:00</span>
                          </button>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {canEdit && <button onClick={() => { setEditRow(row); setActiveModal('assign'); }} className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-sm">Phân ca</button>}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                {role !== 'EMPLOYEE' && <th className="px-4 py-3">Nhân viên</th>}
                {role !== 'EMPLOYEE' && <th className="px-4 py-3">Phòng ban</th>}
                <th className="px-4 py-3">Ca làm việc</th>
                <th className="px-4 py-3">Ngày làm</th>
                <th className="px-4 py-3">Tuần</th>
                {canEdit && <th className="px-4 py-3 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleSchedules.map(row => (
                <tr key={row.empId} className="text-sm hover:bg-slate-50 transition">
                  {role !== 'EMPLOYEE' && <td className="px-4 py-3 font-semibold text-slate-800">{row.emp}</td>}
                  {role !== 'EMPLOYEE' && <td className="px-4 py-3 text-slate-500">{row.dept}</td>}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">{row.shift}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.days.join(', ')}</td>
                  <td className="px-4 py-3 text-slate-500">{row.week}</td>
                  {canEdit && (
                    <td className="px-4 py-3 text-center">
                      <button type="button" onClick={() => { setEditRow(row); setActiveModal('assign'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 mx-auto transition-colors">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Backdrop */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setEditRow(null); }} />
      )}

      {/* Modal: Assign Shift */}
      {activeModal === 'assign' && canEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAssign} className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">event_upcoming</span>
                </span>
                <h2 className="text-base font-bold text-slate-900">Phân ca làm việc</h2>
              </div>
              <button type="button" onClick={() => { setActiveModal(null); setEditRow(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-5">
              <div>
                <label className="form-label">Nhân sự áp dụng <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-sm">
                      {(editRow?.emp || 'Lê Thanh Bình').split(' ').slice(-2).map((x: string) => x[0]).join('')}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-slate-800">
                        {editRow?.emp || 'Lê Thanh Bình'}
                        <span className="ml-2 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-[10px] text-blue-600">{editRow?.empId || 'NV002'}</span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Phòng Phát Triển Công Nghệ • Frontend Developer</p>
                    </div>
                  </div>
                  <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Đổi nhân sự</button>
                </div>
              </div>
              <div>
                <label className="form-label">Ngày áp dụng <span className="text-red-500">*</span></label>
                <input type="date" required defaultValue="2024-10-28" className="form-input max-w-xs" />
              </div>
              <div>
                <label className="form-label">Chọn loại ca làm việc <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {[['Ca Sáng', '08:00 – 12:00', true], ['Ca Chiều', '13:00 – 17:30', false]].map(([name, time, checked], i) => (
                    <label key={name as string} className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-colors ${i === 0 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shift" defaultChecked={checked as boolean} />
                        <div>
                          <b className={`text-sm ${i === 0 ? 'text-emerald-700' : 'text-slate-700'}`}>{name as string}</b>
                          <p className="mt-0.5 text-xs text-blue-600">◷ {time as string}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${i === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>8 tiếng</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Ghi chú phân ca</label>
                <textarea rows={3} placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt cho nhân sự (nếu có)..." className="form-input resize-none" />
              </div>
              <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300" />
                Lặp lại ca làm việc này cho các tuần tiếp theo trong tháng 10
              </label>
            </div>
            <footer className="flex justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => { setActiveModal(null); setEditRow(null); }} className="btn-secondary">Đóng</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Lưu & Phân ca
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}
