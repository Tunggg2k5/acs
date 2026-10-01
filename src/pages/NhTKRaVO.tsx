import { useState } from 'react';
import { useRole } from '../context/RoleContext';

type AccessRow = { name: string; code: string; date: string; checkIn: string; checkOut: string; status: string; note: string };
const teamRows: AccessRow[] = [
  { name: 'Nguyễn Văn An', code: 'NV001', date: '21/09/2026', checkIn: '07:52', checkOut: '17:10', status: 'Đúng giờ', note: '—' },
  { name: 'Lê Thanh Bình', code: 'NV002', date: '21/09/2026', checkIn: '08:14', checkOut: '17:05', status: 'Đi muộn', note: 'Muộn 14 phút' },
  { name: 'Trần Thị Mai', code: 'NV003', date: '21/09/2026', checkIn: '13:01', checkOut: '22:00', status: 'Đúng giờ', note: 'Ca chiều' },
  { name: 'Nguyễn Văn Hùng', code: 'NV004', date: '21/09/2026', checkIn: '08:00', checkOut: '17:00', status: 'Đúng giờ', note: '—' },
];

export default function NhTKRaVO() {
  const { role } = useRole(); const manager = role === 'MANAGER';
  const [logDate, setLogDate] = useState('2026-09-21');
  const person = manager ? 'Lê Hoàng Dũng' : role === 'HR' ? 'Trần Thị Mai' : 'Nguyễn Văn An';
  const code = manager ? 'BOS_DungLH_IT' : role === 'HR' ? 'MaiTT-HR02' : 'AnNV-FE03';
  const initials = manager ? 'LD' : role === 'HR' ? 'TM' : 'NA';
  const position = manager ? 'Trưởng phòng IT' : role === 'HR' ? 'Quản trị viên / Nhân sự' : 'Nhân viên Kỹ thuật';
  const department = manager ? 'Công nghệ thông tin' : role === 'HR' ? 'Nhân sự' : 'Frontend Development';
  const logs = [
    { time: '17:35:10', date: '21/09/2026', place: 'Cửa chính - Tầng 4', device: 'Quẹt thẻ', type: 'Check-out' },
    { time: '13:30:22', date: '21/09/2026', place: 'Cổng phụ - Tầng 1', device: 'Quẹt vân tay', type: 'Check-in' },
    { time: '12:16:35', date: '21/09/2026', place: 'Cửa chính - Tầng 4', device: 'Quẹt vân tay', type: 'Check-out' },
    { time: '08:15:58', date: '21/09/2026', place: 'Cửa chính - Tầng 4', device: 'Khuôn mặt', type: 'Check-in' },
    { time: '17:42:05', date: '20/09/2026', place: 'Cổng chính - Tòa nhà', device: 'Khuôn mặt', type: 'Check-out' },
    { time: '12:05:14', date: '20/09/2026', place: 'Cửa văn phòng - P.402', device: 'Quẹt vân tay', type: 'Check-out' },
    { time: '13:15:40', date: '20/09/2026', place: 'Cửa văn phòng - P.402', device: 'Quẹt thẻ', type: 'Check-in' },
    { time: '08:22:15', date: '20/09/2026', place: 'Cửa chính - Tầng 4', device: 'Quẹt vân tay', type: 'Check-in' },
  ];
  // The date control is an "up to date" filter in the supplied design.  Keeping
  // earlier records visible also makes the initial 21/09 view match the mock-up.
  const selectedTimestamp = new Date(`${logDate}T23:59:59`).getTime();
  const visibleLogs = logs.filter(x => {
    const [day, month, year] = x.date.split('/').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59).getTime() <= selectedTimestamp;
  });

  if (role === 'EMPLOYEE' || role === 'MANAGER' || role === 'HR') return (
    <div className="flex flex-col gap-6">
      {/* Profile section */}
      <div className="card px-6 py-5 flex items-center gap-5">
        <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-[#173b77] text-xl font-bold text-white">{initials}</span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900">{person}</h2>
            <span className="inline-flex items-center rounded-full bg-[#315791] px-2.5 py-1 text-xs font-semibold text-white">Mã NV: {code}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Chức vụ: {position} <span className="px-1 text-slate-300">•</span> Phòng ban: {department}</p>
        </div>
      </div>

      {/* Log table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="text-base font-bold text-slate-900">Danh sách vào / ra</div>
          <input
            aria-label="Lọc nhật ký theo ngày"
            type="date"
            value={logDate}
            onChange={e => setLogDate(e.target.value)}
            className="form-input w-auto text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="table-header">
                {['Cửa / Điểm danh', 'Thiết bị', 'Giờ check', 'Ra / Vào'].map(x => (
                  <th key={x} className="px-5 py-3">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleLogs.map((x, i) => (
                <tr key={`${x.time}-${i}`} className="text-sm hover:bg-slate-50 transition">
                  <td className="px-5 py-4 text-slate-600">{x.place}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{x.device}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono font-semibold text-slate-800">{x.time}</span>
                    <p className="mt-0.5 text-xs text-slate-400">{x.date}</p>
                  </td>
                  <td className={`px-5 py-4 font-bold ${x.type === 'Check-in' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {x.type === 'Check-in' ? (
                      <span className="text-base font-bold text-emerald-600">Vào</span>
                    ) : (
                      <span className="text-base font-bold text-red-500">Ra</span>
                    )}
                  </td>
                </tr>
              ))}
              {visibleLogs.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center py-12 text-slate-400">
                      <span className="material-symbols-outlined text-[48px] mb-2">inbox</span>
                      <p className="text-sm">Không có dữ liệu ra vào trong ngày đã chọn.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // MANAGER / non-employee view
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="page-title">Nhật ký ra vào của tôi</h1>
          <p className="mt-1 text-sm text-slate-500">Theo dõi lịch sử check-in và check-out cá nhân</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {([
          ['check_circle', '20', 'Đúng giờ', 'emerald'],
          ['history', '1', 'Đi muộn', 'amber'],
          ['update', '0', 'Về sớm', 'sky'],
          ['error', '0', 'Nghỉ', 'rose']
        ] as [string, string, string, string][]).map(([icon, value, label, tone]) => (
          <div key={label} className={`card p-4 flex items-center gap-4 border-l-4 ${tone === 'emerald' ? 'border-emerald-500' : tone === 'amber' ? 'border-amber-500' : tone === 'sky' ? 'border-sky-500' : 'border-rose-500'
            }`}>
            <span className={`material-symbols-outlined rounded-lg p-2 text-[20px] ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                tone === 'amber' ? 'bg-amber-50 text-amber-600' :
                  tone === 'sky' ? 'bg-sky-50 text-sky-600' :
                    'bg-rose-50 text-rose-600'
              }`}>{icon}</span>
            <div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tháng này - stat header */}
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 -mb-4">Thống kê tháng này (Tháng 09/2026)</p>

      {/* Check-in/out log table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <span className="material-symbols-outlined text-[18px] text-slate-400">history</span>
            Danh sách check-in/out
          </div>
          <input aria-label="Chọn ngày" type="date" defaultValue="2026-09-21" className="form-input w-auto text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="table-header">
                {['Họ và tên', 'Mã / Display name', 'Cửa / Điểm danh', 'Giờ check', 'Loại quét'].map(x => (
                  <th key={x} className="px-5 py-3">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.slice(0, 2).map((x, i) => (
                <tr key={i} className="text-sm hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-semibold text-slate-800">{person}</td>
                  <td className="px-5 py-4">
                    <code className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 font-mono">{code}</code>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{x.place}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono font-semibold text-slate-800">{x.time}</span>
                    <p className="text-xs text-slate-400 mt-0.5">{x.date}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${x.type === 'Check-in'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}>{x.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ManagerAccessLog() {
  const [selected, setSelected] = useState<AccessRow | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Tất cả trạng thái');
  const [date, setDate] = useState('2026-09-21');
  const selectedDate = date.split('-').reverse().join('/');
  const filtered = teamRows.filter(x => (!query || `${x.name} ${x.code}`.toLowerCase().includes(query.toLowerCase())) && (status === 'Tất cả trạng thái' || x.status === status) && (!date || x.date === selectedDate));
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div><h1 className="page-title">Nhật ký ra vào</h1></div>
        <button onClick={() => window.alert('Đã xuất nhật ký ra vào')} className="btn-secondary"><span className="material-symbols-outlined text-[18px]">download</span>Xuất Excel</button>
      </div>

      {/* Team Table */}
      <div className="card overflow-hidden">
        <div className="grid gap-4 border-b border-slate-100 px-5 py-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center gap-2 whitespace-nowrap text-sm font-bold text-slate-900">
            <span className="material-symbols-outlined text-[18px] text-slate-400">group</span>
            Danh sách ra vào
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-2 lg:ml-auto lg:max-w-[760px] lg:grid-cols-[minmax(240px,1fr)_190px_190px]">
            <div className="relative min-w-0"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span><input aria-label="Tìm nhân viên" value={query} onChange={e => setQuery(e.target.value)} className="form-input !w-full pl-9 text-sm" placeholder="Tên hoặc mã nhân viên..." /></div>
            <input aria-label="Lọc theo ngày" type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input !w-full text-sm" />
            <select aria-label="Lọc theo trạng thái" value={status} onChange={e => setStatus(e.target.value)} className="form-input !w-full bg-white text-sm sm:col-span-2 lg:col-span-1">
              <option>Tất cả trạng thái</option>
              <option>Đúng giờ</option>
              <option>Đi muộn</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="table-header">
                {['Nhân viên', 'Check-in', 'Check-out', 'Trạng thái', 'Ghi chú'].map(x => (
                  <th key={x} className="px-5 py-3">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(x => (
                <tr key={x.code} tabIndex={0} role="button" aria-label={`Xem chi tiết nhật ký ra vào của ${x.name}`} onClick={() => setSelected(x)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(x) } }} className="cursor-pointer text-sm hover:bg-blue-50/60 focus:bg-blue-50 focus:outline-none transition">
                  <td className="px-5 py-4">
                    <button type="button" onClick={e => { e.stopPropagation(); setSelected(x) }} className="flex items-center gap-3 text-left"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{x.name.split(' ').map(n => n[0]).slice(-2).join('')}</span><span><span className="block font-semibold text-slate-800 hover:text-blue-600">{x.name}</span><span className="block text-xs text-slate-400 mt-0.5">Mã NV: {x.code}</span></span></button>
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-slate-800">{x.checkIn}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-slate-800">{x.checkOut}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${x.status === 'Đúng giờ'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>{x.status}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-sm">{x.note}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={5} className="px-5 py-14 text-center text-sm text-slate-400">Không có dữ liệu ra vào phù hợp với bộ lọc</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs text-slate-500"><span>Hiển thị 1 - {filtered.length} trên tổng số 4 bản ghi</span><div className="flex gap-1"><button className="h-8 w-8 rounded-lg border text-slate-300">‹</button><button className="h-8 w-8 rounded-lg bg-blue-600 font-bold text-white">1</button><button className="h-8 w-8 rounded-lg border text-slate-300">›</button></div></div>
      </div>

      {selected && <AccessHistoryDrawer employee={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function AccessHistoryDrawer({ employee, onClose }: { employee: AccessRow; onClose: () => void }) {
  const logs = [
    ['Cửa chính - Tầng 4', 'Quẹt thẻ', '17:35:10', '21/09/2026', 'Ra'],
    ['Cổng phụ - Tầng 1', 'Quẹt vân tay', '13:30:22', '21/09/2026', 'Vào'],
    ['Cửa chính - Tầng 4', 'Quẹt vân tay', '12:16:35', '21/09/2026', 'Ra'],
    ['Cửa chính - Tầng 4', 'Khuôn mặt', '08:15:58', '21/09/2026', 'Vào'],
    ['Cổng chính - Tòa nhà', 'Khuôn mặt', '17:42:05', '20/09/2026', 'Ra'],
    ['Cửa văn phòng - P.402', 'Quẹt vân tay', '12:05:14', '20/09/2026', 'Ra'],
    ['Cửa văn phòng - P.402', 'Quẹt thẻ', '13:15:40', '20/09/2026', 'Vào'],
    ['Cửa chính - Tầng 4', 'Quẹt vân tay', '08:22:15', '20/09/2026', 'Vào'],
  ];
  return <div onMouseDown={e => { if (e.target === e.currentTarget) onClose() }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4">
    <section className="w-full max-w-[940px] overflow-hidden rounded-3xl bg-white p-8 shadow-2xl">
      <div className="flex justify-end"><button onClick={onClose} className="text-2xl text-slate-400">×</button></div>
      <div className="mt-1 flex items-center gap-5 rounded-2xl border border-slate-200 p-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-xl font-bold text-white">{employee.name.split(' ').map(x => x[0]).slice(-2).join('')}</span>
        <div><div className="flex items-center gap-3"><h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2><span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white">Mã NV: {employee.code}</span></div><p className="mt-1 text-sm text-slate-500">Chức vụ: Nhân viên Kỹ thuật • Phòng ban: Frontend Development</p></div>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b px-6 py-4"><h3 className="font-bold text-slate-900">Danh sách vào / ra</h3><input type="date" defaultValue="2026-09-21" className="form-input w-auto text-sm" /></div>
        <table className="w-full text-left"><thead><tr className="table-header">{['Cửa / Điểm danh', 'Thiết bị', 'Giờ check', 'Ra / Vào'].map(x => <th key={x} className="px-6 py-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{logs.map(x => <tr key={`${x[0]}-${x[2]}`}><td className="px-6 py-3 text-sm text-slate-700">{x[0]}</td><td className="px-6 py-3"><span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{x[1]}</span></td><td className="px-6 py-3"><b className="text-sm">{x[2]}</b><span className="block text-xs text-slate-400">{x[3]}</span></td><td className={`px-6 py-3 font-bold ${x[4] === 'Vào' ? 'text-emerald-600' : 'text-rose-500'}`}>{x[4]}</td></tr>)}</tbody></table>
      </div>
      <footer className="mt-7 flex justify-end gap-3"><button onClick={onClose} className="btn-secondary">Đóng</button><button onClick={() => window.alert('Đã xuất dữ liệu cá nhân')} className="btn-primary"><span className="material-symbols-outlined text-[17px]">download</span>Xuất dữ liệu cá nhân</button></footer>
    </section>
  </div>;
}
