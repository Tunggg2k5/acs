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

const hrPeople=[['NV001','Nguyễn Văn Minh'],['NV012','Lê Thu Hà'],['NV025','Bùi Thị Hương'],['NV104','Hoàng Thùy Linh'],['NV098','Trần Nam Anh'],['NV042','Đỗ Quốc Trung'],['NV067','Vũ Minh Tâm'],['NV018','Phạm Ngọc Thảo'],['NV056','Đỗ Hùng Dũng'],['NV034','Trần Quang Hải']];
function HRWorkSchedule(){
 const[department,setDepartment]=useState('Tất cả phòng ban');const[query,setQuery]=useState('');const[config,setConfig]=useState(false);const[selectedCell,setSelectedCell]=useState<{name:string;day:string;shift:string}|null>(null);
 const people=hrPeople.filter(x=>`${x[0]} ${x[1]}`.toLowerCase().includes(query.toLowerCase()));
 const shifts=(i:number)=>i===2?['Ca Sáng','Ca Sáng','Ca Sáng','[P] Nghỉ phép','Ca Sáng','OFF']:i===8?['OFF','Ca Chiều','Ca Chiều','Ca Chiều','Cả ngày','Ca Sáng']:i%3===1?['Ca Chiều','Ca Chiều','Ca Chiều','Ca Chiều','Ca Chiều','OFF']:['Ca Sáng','Ca Sáng',i===4?'Cả ngày':'Ca Sáng','Ca Sáng','Ca Sáng','OFF'];
 const cls=(x:string)=>x==='Ca Sáng'?'border-blue-200 bg-blue-50 text-blue-600':x==='Ca Chiều'?'border-amber-200 bg-amber-50 text-amber-700':x==='Cả ngày'?'border-indigo-200 bg-indigo-50 text-indigo-600':x.startsWith('[P]')?'border-emerald-300 bg-emerald-50 text-emerald-700':'border-slate-200 bg-slate-100 text-slate-400';
 return <div className="min-h-full bg-[#f7f9fc] p-6"><header className="mb-8 flex items-center justify-between"><h1 className="flex items-center gap-3 text-xl font-bold"><span className="material-symbols-outlined rounded-lg bg-blue-600 p-2 text-white">calendar_month</span>Quản lý lịch làm việc và phân ca</h1><p className="text-sm text-slate-500"><span className="text-emerald-500">●</span> Hôm nay: Thứ 5　23/10/2026</p></header><section className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex flex-wrap items-center gap-3 border-b p-4"><button className="rounded-lg border px-4 py-2 text-sm">‹　▣ Tuần 42　(20/10/2026　-　26/10/2026)　›</button><select value={department} onChange={e=>setDepartment(e.target.value)} className="form-input ml-auto max-w-[190px]"><option>Tất cả phòng ban</option><option>Phòng Nhân sự</option><option>Phòng Kỹ thuật</option></select><input value={query} onChange={e=>setQuery(e.target.value)} className="form-input max-w-[230px]" placeholder="Tìm tên hoặc mã NV..."/><button className="btn-secondary">⇩ Xuất Excel</button><button onClick={()=>setConfig(true)} className="btn-secondary">⚙ Cấu hình khung ca</button></div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left"><thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-4">STT</th><th className="px-4 py-4">Mã NV</th><th className="px-4 py-4">Họ tên nhân viên</th>{[['Thứ 2','20/10'],['Thứ 3','21/10'],['Thứ 4','22/10'],['Thứ 5 ●','Hôm nay (23/10)'],['Thứ 6','24/10'],['Thứ 7','25/10']].map(x=><th key={x[0]} className="border-l px-4 py-3 text-center"><b className={x[0].includes('5')?'text-blue-600':'text-slate-700'}>{x[0]}</b><small className="block mt-1">{x[1]}</small></th>)}</tr></thead><tbody className="divide-y">{people.map((p,i)=><tr key={p[0]} className="text-sm"><td className="px-4 py-3 text-slate-400">{String(i+1).padStart(2,'0')}</td><td className="px-4 py-3 font-mono text-xs font-bold text-slate-600">{p[0]}</td><td className="px-4 py-3 font-semibold">{p[1]}</td>{shifts(hrPeople.indexOf(p)).map((s,j)=><td key={j} className={`border-l p-2 ${j===3?'bg-blue-50/50':''}`}><button onClick={()=>setSelectedCell({name:p[1],day:String(20+j)+'/10',shift:s})} className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold ${cls(s)}`}>{s}</button></td>)}</tr>)}</tbody></table></div><footer className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs"><p><b>CHÚ THÍCH MÃ CA:</b>　<span className="text-blue-600">□ Ca Sáng: 08:00 - 12:00</span>　<span className="text-amber-600">□ Ca Chiều: 13:30 - 17:30</span>　<span className="text-indigo-600">□ Cả ngày: 08:00 - 17:30</span>　<span className="text-emerald-600">□ [P]: Nghỉ phép</span>　<span className="text-slate-400">● OFF: Nghỉ ca</span></p><div className="flex gap-1"><button className="h-8 w-8 rounded border">‹</button><button className="h-8 w-8 rounded bg-blue-600 text-white">1</button><button className="h-8 w-8 rounded border">2</button><button className="h-8 w-8 rounded border">3</button><button className="h-8 w-8 rounded border">4</button><button className="h-8 w-8 rounded border">›</button></div></footer></section>{selectedCell&&<div onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedCell(null)}} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4"><div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><header className="flex items-start justify-between border-b pb-4"><div><h2 className="text-xl font-bold">🔵 Đổi ca làm việc</h2><p className="mt-1 text-slate-500">Ngày {selectedCell.day} • {selectedCell.name}</p></div><button onClick={()=>setSelectedCell(null)} className="text-2xl text-slate-400">×</button></header><div className="space-y-2 py-5">{[['Ca Sáng','08:00 - 12:00','wb_sunny'],['Ca Chiều','13:30 - 17:30','wb_twilight'],['Cả ngày','08:00 - 17:30 (Sáng + Chiều)','schedule'],['[P] Nghỉ phép','Đơn phép đã duyệt','beach_access'],['OFF / Nghỉ tuần','Không tính công ca','coffee']].map(x=><button key={x[0]} onClick={()=>setSelectedCell({...selectedCell,shift:x[0]})} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left ${selectedCell.shift===x[0]?'border-2 border-slate-300 bg-slate-50':''}`}><span className="material-symbols-outlined rounded-xl bg-blue-50 p-3 text-blue-600">{x[2]}</span><span><b className="block text-lg">{x[0]}</b><span className="text-sm text-slate-400">{x[1]}</span></span>{selectedCell.shift===x[0]&&<span className="material-symbols-outlined ml-auto text-amber-500">check_circle</span>}</button>)}</div><button onClick={()=>setSelectedCell(null)} className="flex w-full items-center gap-3 border-t pt-5 text-left font-semibold text-rose-500"><span className="material-symbols-outlined">delete</span>Xóa ca ngày này</button></div></div>}{config&&<div onMouseDown={e=>{if(e.target===e.currentTarget)setConfig(false)}} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6"><div className="flex justify-between"><h2 className="text-lg font-bold">Cấu hình khung ca</h2><button onClick={()=>setConfig(false)}>✕</button></div><div className="mt-5 space-y-3">{[['Ca Sáng','08:00','12:00'],['Ca Chiều','13:30','17:30'],['Cả ngày','08:00','17:30']].map(x=><div key={x[0]} className="grid grid-cols-3 items-center gap-3 rounded-xl border p-3"><b>{x[0]}</b><input type="time" defaultValue={x[1]} className="form-input"/><input type="time" defaultValue={x[2]} className="form-input"/></div>)}</div><footer className="mt-5 flex justify-end gap-2"><button onClick={()=>setConfig(false)} className="btn-secondary">Đóng</button><button onClick={()=>setConfig(false)} className="btn-primary">Lưu cấu hình</button></footer></div></div>}</div>;
}

export default function LChLMViC() {
  const { role } = useRole();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<any>(null);
  
  const visibleSchedules = (role === 'ADMIN' || role === 'HR') ? allSchedules.ADMIN
    : role === 'MANAGER' ? allSchedules.MANAGER
    : allSchedules.EMPLOYEE;

  const canEdit = role === 'ADMIN' || role === 'HR' || role === 'MANAGER';

  if (role === 'HR') return <HRWorkSchedule />;

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


