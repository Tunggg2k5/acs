import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { AdminTimesheetView } from '../components/AdminDesignViews';

type Row = { empId: string; name: string; dept: string; workDays: number; lateDays: number; absentDays: number; otHours: number; status: string };

const allData: Row[] = [
  { empId: 'NV001', name: 'Nguyễn Văn An',   dept: 'Ban GĐ',   workDays: 22, lateDays: 0, absentDays: 0, otHours: 4,  status: 'Hoàn tất' },
  { empId: 'NV002', name: 'Lê Thanh Bình',   dept: 'Phòng IT', workDays: 21, lateDays: 2, absentDays: 1, otHours: 8,  status: 'Cần xét' },
  { empId: 'NV003', name: 'Trần Thị Mai',    dept: 'Phòng KT', workDays: 20, lateDays: 1, absentDays: 0, otHours: 0,  status: 'Hoàn tất' },
  { empId: 'NV004', name: 'Nguyễn Văn Hùng', dept: 'Phòng IT', workDays: 22, lateDays: 0, absentDays: 0, otHours: 12, status: 'Hoàn tất' },
  { empId: 'NV005', name: 'Phạm Thị Lan',    dept: 'Phòng HR', workDays: 18, lateDays: 3, absentDays: 2, otHours: 0,  status: 'Cần xét' },
];

export default function BNgCNg() {
  const roleCheck = useRole().role;
  if (roleCheck === 'MANAGER') return <ManagerTimesheet />;
  if (roleCheck === 'ADMIN') return <AdminTimesheetView />;
  const { role } = useRole();
  const [month, setMonth] = useState('2023-10');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);

  const myRows = role === 'EMPLOYEE' ? allData.filter(r => r.empId === 'NV003')
    : role === 'MANAGER' ? allData.filter(r => ['NV001', 'NV002', 'NV004'].includes(r.empId) || r.empId === 'NV003')
    : allData;

  const canExport = role !== 'EMPLOYEE';
  const canAdjust = role === 'ADMIN';

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="mb-0 flex items-center justify-between">
        <div>
          <h1 className="page-title">Bảng công</h1>
          <p className="mt-1 text-sm text-slate-500">
            {role === 'EMPLOYEE' ? 'Bảng công cá nhân của bạn'
              : role === 'MANAGER' ? 'Bảng công nhóm bạn quản lý'
              : 'Bảng công toàn công ty'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_month</span>
            <input
              type="month"
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="text-sm text-slate-700 outline-none bg-transparent"
            />
          </div>
          <span className="badge-blue">
            Tháng {month.split('-').reverse().join('/')}
          </span>
          {canExport && (
            <button onClick={() => window.alert('Đã xuất bảng công')} className="btn-secondary">
              <span className="material-symbols-outlined text-[18px]">download</span>
              {role === 'ADMIN' ? 'Xuất Excel' : 'Xuất Excel team'}
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng ngày công', value: myRows.reduce((s,r)=>s+r.workDays,0), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500', icon: 'work' },
          { label: 'Số lần đi muộn', value: myRows.reduce((s,r)=>s+r.lateDays,0), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500', icon: 'alarm' },
          { label: 'Ngày vắng', value: myRows.reduce((s,r)=>s+r.absentDays,0), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500', icon: 'person_off' },
          { label: 'Giờ tăng ca', value: myRows.reduce((s,r)=>s+r.otHours,0), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500', icon: 'more_time' },
        ].map(card => (
          <div key={card.label} className={`card p-5 border-l-4 ${card.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[20px] ${card.color}`}>{card.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="table-header">
              {role !== 'EMPLOYEE' && <th className="px-4 py-3">Nhân viên</th>}
              {role !== 'EMPLOYEE' && <th className="px-4 py-3">Phòng ban</th>}
              <th className="px-4 py-3 text-center">Ngày công</th>
              <th className="px-4 py-3 text-center">Đi muộn</th>
              <th className="px-4 py-3 text-center">Vắng</th>
              <th className="px-4 py-3 text-center">OT (giờ)</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="material-symbols-outlined text-slate-300 text-5xl">inbox</span>
                    <p className="text-sm text-slate-400">Chưa có dữ liệu</p>
                  </div>
                </td>
              </tr>
            ) : myRows.map(row => (
              <tr key={row.empId} className="text-sm hover:bg-slate-50 transition">
                {role !== 'EMPLOYEE' && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-400">{row.empId}</div>
                      </div>
                    </div>
                  </td>
                )}
                {role !== 'EMPLOYEE' && (
                  <td className="px-4 py-3 text-slate-500">{row.dept}</td>
                )}
                <td className="px-4 py-3 text-center font-bold text-blue-600">{row.workDays}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${row.lateDays > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{row.lateDays}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${row.absentDays > 0 ? 'text-red-600' : 'text-slate-400'}`}>{row.absentDays}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${row.otHours > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>{row.otHours}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${row.status === 'Hoàn tất' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => { setSelectedRow(row); setActiveModal('detail'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Xem chi tiết">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    {canAdjust && (
                      <button onClick={() => { setSelectedRow(row); setActiveModal('adjust'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition" title="Điều chỉnh">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Backdrop */}
      {activeModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setSelectedRow(null); }} />}

      {/* Detail Modal */}
      {activeModal === 'detail' && selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Chi tiết bảng công</h2>
              <button onClick={() => { setActiveModal(null); setSelectedRow(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl mb-5">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  {selectedRow.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{selectedRow.name}</div>
                  <div className="text-sm text-slate-500">{selectedRow.dept} · {selectedRow.empId}</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { l: 'Tháng', v: month },
                  { l: 'Ngày công thực', v: `${selectedRow.workDays} ngày` },
                  { l: 'Số lần đi muộn', v: `${selectedRow.lateDays} lần` },
                  { l: 'Ngày vắng', v: `${selectedRow.absentDays} ngày` },
                  { l: 'Giờ OT', v: `${selectedRow.otHours} giờ` },
                  { l: 'Trạng thái', v: selectedRow.status },
                ].map(r => (
                  <div key={r.l} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{r.l}</span>
                    <span className="text-sm font-semibold text-slate-900">{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => { setActiveModal(null); setSelectedRow(null); }} className="btn-secondary">Đóng</button>
            </footer>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {activeModal === 'adjust' && selectedRow && canAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={e => { e.preventDefault(); setActiveModal(null); setSelectedRow(null); }} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Điều chỉnh công</h2>
              <button type="button" onClick={() => { setActiveModal(null); setSelectedRow(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                <span className="material-symbols-outlined text-blue-500 text-[18px]">person</span>
                <span className="text-sm font-semibold text-blue-900">{selectedRow.name} – Tháng {month}</span>
              </div>
              <div>
                <label className="form-label">Ngày công điều chỉnh</label>
                <input type="number" defaultValue={selectedRow.workDays} min={0} max={31} className="form-input" />
              </div>
              <div>
                <label className="form-label">Lý do điều chỉnh <span className="text-red-500">*</span></label>
                <textarea required rows={3} placeholder="Ghi rõ lý do..." className="form-input resize-none" />
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => { setActiveModal(null); setSelectedRow(null); }} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Lưu điều chỉnh
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}


function ManagerTimesheet(){
 const rows=allData.slice(0,4);
 const [detail,setDetail]=useState<{name:string;type:string}|null>(null);
 const [query,setQuery]=useState('');
 const [violation,setViolation]=useState('Có vi phạm');
 const visibleRows=rows.filter(r=>(!query||`${r.name} ${r.empId}`.toLowerCase().includes(query.toLowerCase()))&&(violation!=='Chỉ có vi phạm'||r.lateDays>0||r.absentDays>0));
 return <div className="flex flex-col gap-6 p-6">
   <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
     <div>
       <h1 className="page-title">Bảng công</h1>
     </div>
     <div className="flex items-center gap-3">
       <select defaultValue="2026-09" className="form-input w-auto"><option value="2026-09">Tháng 09/2026</option><option value="2026-08">Tháng 08/2026</option></select>
       <button onClick={()=>window.alert('Đã xuất bảng công team')} className="btn-secondary whitespace-nowrap">
         <span className="material-symbols-outlined text-[18px]">download</span>
         Xuất Excel
       </button>
     </div>
   </div>

   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
     {[
       ['warning','2','nhân sự','Nhân sự cần chú ý','Có bất thường chuyên cần trong kỳ','bg-amber-50','text-amber-600'],
       ['person_off','1','ngày','Vắng không phép','Vắng không lý do / không có phép','bg-red-50','text-red-600'],
     ].map(([icon,value,unit,label,sub,bg,color])=>(
       <div key={label} className="card p-6">
         <div className="flex items-center gap-3">
           <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
             <span className={`material-symbols-outlined text-[20px] ${color}`}>{icon}</span>
           </div>
           <div>
             <p className={`text-2xl font-bold ${color}`}>{value} <small className="text-xs font-medium">{unit}</small></p>
             <p className="text-sm font-bold text-slate-700">{label}</p>
             <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
           </div>
         </div>
       </div>
     ))}
   </div>

   <div className="card overflow-visible">
     <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
       <div><h2 className="text-sm font-bold text-slate-900">Danh sách chấm công chi tiết theo nhân sự</h2><p className="mt-1 text-xs text-slate-400">Kỳ công: 01/09/2026 - 30/09/2026</p></div>
       <div className="flex gap-2"><div className="relative"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-400">search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm kiếm nhân viên..." className="form-input w-52 pl-9 text-xs"/></div><select value={violation} onChange={e=>setViolation(e.target.value)} className="form-input w-auto text-xs"><option>Có vi phạm</option><option>Chỉ có vi phạm</option><option>Tất cả</option></select></div>
     </div>
     <table className="w-full text-left">
       <thead>
         <tr className="table-header">
           {['Nhân viên','Ngày công','Đi muộn','Về sớm','Vắng KP'].map(x=>(
             <th key={x} className="px-4 py-3">{x}</th>
           ))}
         </tr>
       </thead>
       <tbody className="divide-y divide-slate-100">
         {visibleRows.map(r=>(
           <tr key={r.empId} className="text-sm hover:bg-slate-50 transition">
             <td className="px-4 py-3">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{r.name.charAt(0)}</div>
                 <div>
                   <p className="font-semibold text-slate-900">{r.name}</p>
                   <p className="text-xs text-slate-400">{r.empId}</p>
                 </div>
               </div>
             </td>
             <td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{r.workDays}/22 công</span></td>
             <td className="relative px-4 py-3">{r.lateDays>0?<button onMouseEnter={()=>setDetail({name:r.name,type:'Đi muộn'})} onMouseLeave={()=>setDetail(null)} className="border-b border-dotted border-amber-500 font-semibold text-amber-600">{r.lateDays} lần · {r.lateDays===2?'35':'12'}′{detail?.name===r.name&&detail.type==='Đi muộn'&&<span className="absolute left-1/2 top-[75%] z-30 w-64 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xl"><b className="block text-sm text-slate-800">◷ Đi muộn · {r.lateDays} lần</b><span className="mt-3 grid grid-cols-2 gap-y-2 text-xs font-normal text-slate-500"><span>05/09/2026:</span><strong className="text-right text-amber-600">15 phút</strong>{r.lateDays>1&&<><span>18/09/2026:</span><strong className="text-right text-amber-600">20 phút</strong></>}<span className="border-t pt-2 font-bold text-slate-700">Tổng:</span><strong className="border-t pt-2 text-right text-amber-600">{r.lateDays===2?'35':'12'} phút</strong></span></span>}</button>:<span className="text-slate-400">0</span>}</td>
             <td className="relative px-4 py-3">{Number(r.lateDays)>1?<button onMouseEnter={()=>setDetail({name:r.name,type:'Về sớm'})} onMouseLeave={()=>setDetail(null)} className="border-b border-dotted border-amber-500 font-semibold text-amber-600">1 lần · 5′{detail?.name===r.name&&detail.type==='Về sớm'&&<span className="absolute left-1/2 top-[75%] z-30 w-56 -translate-x-1/2 rounded-xl border bg-white p-4 text-left shadow-xl"><b className="text-sm text-slate-800">◷ Về sớm · 1 lần</b><span className="mt-3 flex justify-between text-xs font-normal text-slate-500"><span>18/09/2026</span><strong className="text-amber-600">5 phút</strong></span></span>}</button>:<span className="text-slate-400">0</span>}</td>
             <td className="relative px-4 py-3">{r.absentDays>0?<button onMouseEnter={()=>setDetail({name:r.name,type:'Vắng không phép'})} onMouseLeave={()=>setDetail(null)} className="rounded-full border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600">{r.absentDays} ngày{detail?.name===r.name&&detail.type==='Vắng không phép'&&<span className="absolute right-4 top-[75%] z-30 w-56 rounded-xl border bg-white p-4 text-left shadow-xl"><b className="text-sm text-slate-800">Vắng không phép</b><span className="mt-2 block text-xs font-normal text-slate-500">Ngày 21/09/2026 · 1 ngày</span></span>}</button>:<span className="text-slate-400">0</span>}</td>
           </tr>
         ))}
       </tbody>
     </table>
     <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
       <span className="mr-2">Trang 1/1</span><button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-300">‹</button><button className="h-8 w-8 rounded-lg bg-blue-600 font-bold text-white">1</button><button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-300">›</button>
     </div>
   </div>
 </div>
}
