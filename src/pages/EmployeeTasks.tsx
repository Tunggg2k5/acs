import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Task={id:number;owner:string;description:string;deadline:string;time:string;status:'Quá hạn'|'Đang thực hiện'|'Đã hoàn thành'|'Hoàn thành trễ';lateDays?:number};
const initial:Task[]=[
 {id:1,owner:'Dự án Website HRM',description:'Hoàn thiện giao diện dashboard nhân viên và kiểm tra hiển thị trên màn hình nhỏ.',deadline:'24/10/2024',time:'17:00',status:'Quá hạn'},
 {id:2,owner:'Dự án ACS',description:'Thiết kế và tinh chỉnh lại luồng đặt phòng họp, bổ sung hiển thị danh sách người tham gia.',deadline:'25/10/2024',time:'12:00',status:'Đang thực hiện'},
 {id:3,owner:'Bộ phận Vận hành',description:'Kiểm tra dữ liệu log ra vào cổng 4 và đối soát với hệ thống camera để làm rõ sai lệch.',deadline:'23/10/2024',time:'16:30',status:'Đã hoàn thành'},
 {id:4,owner:'Phòng Công nghệ',description:'Tổng hợp các chỉ số KPI, hiệu suất chấm công và các sự cố phát sinh trong tuần 42.',deadline:'22/10/2024',time:'10:30',status:'Đã hoàn thành'},
 {id:5,owner:'Ban Quản lý',description:'Kiểm tra phần cứng đầu đọc vân tay, rà soát kết nối mạng nội bộ và biên bản bàn giao thiết bị.',deadline:'20/10/2024',time:'17:00',status:'Đã hoàn thành'},
];
const tone=(status:Task['status'])=>status==='Đã hoàn thành'?'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700':status==='Quá hạn'?'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-rose-200 bg-rose-50 text-rose-600':status==='Hoàn thành trễ'?'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-amber-200 bg-amber-50 text-amber-700':'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-600';

export default function EmployeeTasks(){
 const [params,setParams]=useSearchParams();
 const [tasks,setTasks]=useState(initial); const [filter,setFilter]=useState('Đang thực hiện'); const [query,setQuery]=useState(''); const [selected,setSelected]=useState<Task|null>(null); const [note,setNote]=useState('');
 useEffect(()=>{const id=Number(params.get('task'));if(id){const task=tasks.find(x=>x.id===id);if(task)setSelected(task)}},[params,tasks]);
 const counts=(s:string)=>s==='Tất cả'?tasks.length:tasks.filter(t=>t.status===s).length;
 const visible=useMemo(()=>tasks.filter(t=>(filter==='Tất cả'||t.status===filter)&&`${t.owner} ${t.description}`.toLowerCase().includes(query.toLowerCase())),[tasks,filter,query]);
 const closeDetail=()=>{setSelected(null);setNote('');if(params.has('task')){params.delete('task');setParams(params,{replace:true})}};
 const complete=()=>{if(!selected)return;setTasks(rows=>rows.map(t=>t.id===selected.id?{...t,status:selected.status==='Quá hạn'?'Hoàn thành trễ':'Đã hoàn thành',lateDays:selected.status==='Quá hạn'?2:undefined}:t));closeDetail()};

 const filterDotColor=(c:string)=>c==='rose'?'bg-rose-500':c==='emerald'?'bg-emerald-500':c==='amber'?'bg-amber-400':'bg-blue-500';

 return (
  <div className="flex flex-col gap-6 p-6 bg-[#F8FAFC] min-h-full">
    {/* Page Header */}
    <div className="mb-2 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Danh sách công việc</h1>
      </div>
    </div>

    {/* Main content card */}
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
        <div className="flex flex-wrap gap-2">
          {[['Tất cả','blue'],['Đang thực hiện','blue'],['Quá hạn','rose'],['Đã hoàn thành','emerald'],['Hoàn thành trễ','amber']].map(([x,c])=>(
            <button key={x} onClick={()=>setFilter(x)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition ${filter===x?'border-blue-300 bg-blue-50 text-blue-700 shadow-sm':'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
              <span className={`h-2 w-2 rounded-full shrink-0 ${filterDotColor(c)}`}/>
              {x}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter===x?'bg-blue-100 text-blue-700':'bg-slate-100 text-slate-500'}`}>{counts(x)}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm kiếm công việc..."
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 w-56"/>
          </div>
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500">
            <option>Tháng 10/2024</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">STT</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dự án / Mô tả công việc</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời hạn (Deadline)</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map(t=>{
              const actionable=t.status==='Đang thực hiện'||t.status==='Quá hạn';
              return (
                <tr key={t.id} onClick={()=>actionable&&setSelected(t)}
                  className={`text-sm transition ${actionable?'cursor-pointer hover:bg-blue-50/40':''}`}>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{t.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{t.owner}</span>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-lg">{t.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{t.deadline}</span>
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>{t.time}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={tone(t.status)}>
                      {t.status}{t.status==='Hoàn thành trễ'&&t.lateDays?` ${t.lateDays} ngày`:''}
                    </span>
                    {t.status==='Quá hạn'&&(
                      <p className="mt-2 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">touch_app</span>
                        Nhấn để xác nhận hoàn thành
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr><td colSpan={4} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <span className="material-symbols-outlined text-5xl text-slate-300">assignment_late</span>
                  <p className="text-sm text-slate-500">Không có công việc phù hợp</p>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <span className="text-xs text-slate-500">Hiển thị 1 - {visible.length} của {visible.length} bản ghi</span>
        <div className="flex gap-2 items-center">
          <select className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white">
            <option>20 / trang</option>
          </select>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">‹</button>
          <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white font-semibold">1</button>
          <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50">›</button>
        </div>
      </footer>
    </div>

    {/* Task detail modal */}
    {selected && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
          <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">check</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Xác nhận hoàn thành công việc</h2>
                <p className="text-xs text-slate-500">Bạn có chắc chắn muốn hoàn thành nhiệm vụ này và cập nhật tiến độ lên hệ thống?</p>
              </div>
            </div>
            <button onClick={closeDetail} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </header>

          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-0.5"></span>
                  <b className="text-sm font-bold text-slate-900">{selected.owner}</b>
                </div>
                <span className={tone(selected.status)}>{selected.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{selected.description}</p>
              <div className="mt-3 border-t border-slate-200 pt-3 flex items-center gap-2 text-xs text-slate-500">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Hạn hoàn thành: <b className="text-slate-700">{selected.time} - {selected.deadline}</b>
              </div>
            </div>

            {(selected.status==='Đang thực hiện'||selected.status==='Quá hạn')&&(
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ghi chú kết quả</label>
                <textarea value={note} onChange={e=>setNote(e.target.value)} rows={3} placeholder="Nhập ghi chú kết quả công việc..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"/>
              </div>
            )}
          </div>

          <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            <button onClick={closeDetail} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy bỏ</button>
            {(selected.status==='Đang thực hiện'||selected.status==='Quá hạn')&&(
              <button onClick={complete} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>Xác nhận hoàn thành
              </button>
            )}
          </footer>
        </div>
      </div>
    )}
  </div>
 );
}
