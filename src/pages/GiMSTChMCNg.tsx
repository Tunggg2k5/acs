import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

type Alert = { id: string; empId: string; name: string; dept: string; date: string; type: string; detail: string; severity: string };

const allAlerts: Alert[] = [
  { id: 'AL-001', empId: 'NV002', name: 'Lê Thanh Bình',   dept: 'Phòng IT',  date: '26/10/2023', type: 'Đi muộn',    detail: 'Vào 08:14 (muộn 14 phút)', severity: 'Cảnh báo' },
  { id: 'AL-002', empId: 'NV005', name: 'Phạm Thị Lan',    dept: 'Phòng HR',  date: '26/10/2023', type: 'Thiếu công', detail: 'Không có check-out',         severity: 'Nghiêm trọng' },
  { id: 'AL-003', empId: 'NV004', name: 'Nguyễn Văn Hùng', dept: 'Phòng IT',  date: '25/10/2023', type: 'Về sớm',     detail: 'Ra về 16:30 (sớm 30 phút)', severity: 'Cảnh báo' },
  { id: 'AL-004', empId: 'NV003', name: 'Trần Thị Mai',    dept: 'Phòng KT',  date: '24/10/2023', type: 'Đi muộn',    detail: 'Vào 13:20 (muộn 20 phút)', severity: 'Cảnh báo' },
];

function ManagerAttendanceMonitor(){
  const [rows,setRows]=useState([allAlerts[0],allAlerts[2]]);
  const [query,setQuery]=useState('');
  const [kind,setKind]=useState('Tất cả loại vi phạm');
  const [range,setRange]=useState('Hôm nay');
  const [explanation,setExplanation]=useState<Alert|null>(null);
  const visible=rows.filter(x=>(kind==='Tất cả loại vi phạm'||x.type===kind)&&`${x.name} ${x.empId}`.toLowerCase().includes(query.toLowerCase()));
  const resolve=(id:string)=>setRows(v=>v.filter(x=>x.id!==id));
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Giám sát chấm công</h1>
          <p className="mt-1 text-sm text-slate-500">Giám sát đi muộn / về sớm / thiếu công của nhân sự theo phòng ban</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {['Hôm nay','Tuần này','Tháng này'].map(x=>(
              <button key={x} onClick={()=>setRange(x)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${range===x?'bg-blue-600 text-white shadow-sm':'text-slate-600 hover:bg-slate-50'}`}>{x}</button>
            ))}
          </div>
          <button className="btn-secondary">
            <span className="material-symbols-outlined text-[18px]">date_range</span>
            23/10/2023 - 29/10/2023
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} className="form-input pl-9" placeholder="Tìm tên hoặc mã nhân viên..."/>
          </div>
          <select value={kind} onChange={e=>setKind(e.target.value)} className="form-input w-auto">
            <option>Tất cả loại vi phạm</option>
            <option>Đi muộn</option>
            <option>Về sớm</option>
          </select>
          <button onClick={()=>window.alert('Đã xuất Excel')} className="btn-secondary">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất Excel
          </button>
          <button onClick={()=>{setQuery('');setKind('Tất cả loại vi phạm')}} className="btn-primary">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="table-header">
              {['Nhân viên','Ngày','Loại vi phạm','Chi tiết chấm công','Đơn giải trình','Xử lý'].map(x=>(
                <th key={x} className="px-4 py-3">{x}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((x,i)=>(
              <tr key={x.id} className="text-sm hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{x.name}</div>
                  <div className="text-xs text-slate-400">Mã NV: {x.empId} · {x.dept.replace('Phòng IT','Ban Công nghệ').replace('Phòng KT','Phòng Kỹ thuật')}</div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">{x.date}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{x.type}</td>
                <td className="px-4 py-3 text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                    {x.detail}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {i===0 ? (
                    <button onClick={()=>setExplanation(x)} className="badge-blue cursor-pointer hover:bg-blue-100 transition">
                      <span className="material-symbols-outlined text-[14px]">description</span>
                      Có giải trình
                    </button>
                  ) : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {i===0 ? (
                      <>
                        <button onClick={()=>resolve(x.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition" title="Chấp thuận">
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </button>
                        <button onClick={()=>resolve(x.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition" title="Từ chối">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </>
                    ) : <span className="text-slate-300">—</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          <span>Hiển thị 1 - {visible.length} trên tổng số {visible.length} bản ghi</span>
          <div className="flex gap-1">
            <button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 flex items-center justify-center text-sm">‹</button>
            <button className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">1</button>
            <button className="h-8 w-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-sm">›</button>
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      {explanation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                  <span className="material-symbols-outlined text-[20px] text-blue-600">description</span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-slate-900">Chi tiết đơn giải trình chấm công</h2>
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Chờ duyệt</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">Gửi lúc 08:35, 26/10/2023</p>
                </div>
              </div>
              <button onClick={()=>setExplanation(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="space-y-4 p-6 max-h-[65vh] overflow-y-auto">
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">LB</div>
                <div>
                  <div className="font-bold text-slate-900">Lê Thanh Bình</div>
                  <p className="text-sm text-slate-500">Mã NV: NV002 · Ban Công nghệ (Frontend Team)</p>
                </div>
              </div>
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                <div className="flex items-center justify-between border-b border-red-100 pb-2">
                  <span className="flex items-center gap-2 font-bold text-red-600">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    THÔNG TIN VI PHẠM
                  </span>
                  <span className="rounded-lg bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">Đi muộn (14 phút)</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <p><span className="text-slate-500">Ngày vi phạm:</span> <b>26/10/2023</b></p>
                  <p><span className="text-slate-500">Địa điểm:</span> Cổng chính (FaceID Tầng 1)</p>
                  <p><span className="text-slate-500">Giờ quy định:</span> 08:00</p>
                  <p><span className="text-slate-500">Giờ thực tế check-in:</span> <b className="text-red-500">08:14</b></p>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Lý do giải trình</div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  <b className="text-slate-800">🚦 Kẹt xe do sự cố giao thông trên đường Cộng Hòa</b>
                  <p className="mt-2">Sáng nay tuyến đường Cộng Hòa xảy ra va chạm giao thông gây ùn tắc kéo dài hơn 25 phút. Tôi đã cố gắng di chuyển nhưng không kịp giờ check-in 08:00 theo quy định.</p>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Bằng chứng đính kèm</div>
                <div className="inline-flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                  <span className="material-symbols-outlined text-[20px] text-blue-500">image</span>
                  <span>
                    <b>vov_giaothong_screenshot.png</b>
                    <small className="block text-slate-400">1.1 MB · Tin tức VOV</small>
                  </span>
                  <button className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">Xem</button>
                </div>
              </div>
              <div>
                <label className="form-label">Ý kiến phản hồi / Ghi chú của quản lý</label>
                <textarea rows={2} className="form-input resize-none" placeholder="Nhập lý do chấp thuận hoặc lý do từ chối giải trình..."/>
              </div>
            </div>
            <footer className="flex items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button className="btn-secondary">
                <span className="material-symbols-outlined text-[18px]">info</span>
                Yêu cầu bổ sung thông tin
              </button>
              <button onClick={()=>{resolve(explanation.id);setExplanation(null)}} className="btn-danger">
                <span className="material-symbols-outlined text-[18px]">close</span>
                Từ chối giải trình
              </button>
              <button onClick={()=>{resolve(explanation.id);setExplanation(null)}} className="btn-primary ml-auto bg-emerald-600 hover:bg-emerald-700">
                <span className="material-symbols-outlined text-[18px]">check</span>
                Chấp thuận & Hủy vi phạm
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GiMSTChMCNg() {
  const { role } = useRole();
  const location = useLocation();
  const managerView = new URLSearchParams(location.search).get('scope');
  const [filter, setFilter] = useState('ALL');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<Alert | null>(null);

  if (role === 'EMPLOYEE' || (role === 'MANAGER' && !managerView)) {
    const mine = [
      { id:'VP-01', date:'18/09/2026', type:'Đi muộn', detail:'Check-in lúc 08:42, muộn 12 phút', status:'Chờ giải trình', note:'' },
      { id:'VP-02', date:'15/09/2026', type:'Đi muộn', detail:'Check-in lúc 09:15, muộn 45 phút', status:'Bị từ chối', note:'Lý do từ chối: Giải trình không có minh chứng hợp lệ' },
      { id:'VP-03', date:'12/09/2026', type:'Quên check-out', detail:'Không có dữ liệu check-out ca chiều', status:'Đã giải trình', note:'' },
      { id:'VP-04', date:'05/09/2026', type:'Về sớm', detail:'Check-out lúc 16:40 (sớm 50 phút)', status:'Bị từ chối', note:'' },
      { id:'VP-05', date:'02/09/2026', type:'Quên check-in', detail:'Không có dữ liệu check-in ca sáng', status:'Đã giải trình', note:'' },
    ];
    return (
      <div className="flex flex-col gap-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Danh sách vi phạm của tôi</h1>
            <p className="mt-1 text-sm text-slate-500">Theo dõi các ghi nhận chấm công và trạng thái giải trình cá nhân</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            5 ghi nhận
          </span>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="material-symbols-outlined text-[18px] text-slate-400">history</span>
              Lịch sử vi phạm
            </h2>
            <select className="form-input w-auto text-xs"><option>Tháng 09/2026</option></select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="table-header">
                  {['STT','Ngày','Loại vi phạm','Chi tiết','Trạng thái','Thao tác'].map(x=>(
                    <th key={x} className="px-4 py-3">{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mine.map((x,index)=>(
                  <tr key={x.id} className="text-sm hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-400">{index+1}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{x.date}</td>
                    <td className="px-4 py-3 text-slate-700">{x.type}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {x.detail}
                      {x.note && <p className="mt-1 text-xs text-red-500">{x.note}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${x.status==='Đã giải trình'?'bg-emerald-50 text-emerald-700 border-emerald-200':x.status==='Bị từ chối'?'bg-red-50 text-red-600 border-red-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {x.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {x.status==='Chờ giải trình' ? (
                        <button onClick={()=>{setSelected(x);setActiveModal('complaint')}} className="btn-primary text-xs py-1.5">
                          <span className="material-symbols-outlined text-[16px]">edit_note</span>
                          Giải trình ngay
                        </button>
                      ) : (
                        <button disabled className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-400 cursor-not-allowed">
                          Giải trình ngay
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaint Modal */}
        {activeModal==='complaint' && selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e=>{if(e.target===e.currentTarget){setActiveModal(null);setSelected(null)}}}>
            <form onSubmit={e=>{e.preventDefault();setActiveModal(null);setSelected(null);window.alert('Đã gửi giải trình')}} className="w-full max-w-[620px] overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
              <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Khiếu nại thời gian làm việc</h2>
                </div>
                <button type="button" onClick={()=>{setActiveModal(null);setSelected(null)}} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </header>
              <div className="space-y-4 p-6">
                <div>
                  <label className="form-label">Chọn loại vi phạm</label>
                  <input readOnly value={`${selected.type} / Về sớm (08:42)`} className="form-input bg-slate-50 cursor-not-allowed"/>
                </div>
                <div>
                  <label className="form-label">Ngày khiếu nại <span className="text-red-500">*</span></label>
                  <input readOnly value={selected.date} className="form-input bg-slate-50 cursor-not-allowed"/>
                </div>
                <div>
                  <label className="form-label">Thời gian hệ thống thông báo <span className="text-red-500">*</span></label>
                  <textarea readOnly value="08:42:00 (Đi muộn 12 phút - Ca sáng 08:30)" rows={2} className="form-input resize-none bg-slate-50 cursor-not-allowed"/>
                </div>
                <div>
                  <label className="form-label">Thời gian thực tế <span className="text-red-500">*</span></label>
                  <textarea required rows={3} className="form-input resize-none" placeholder="Nhập thời gian thực tế... (Bạn cần ghi rõ địa điểm, khoảng thời gian quẹt thẻ xác nhận.)"/>
                </div>
                <div>
                  <label className="form-label">Lý do <span className="text-red-500">*</span></label>
                  <textarea required rows={3} className="form-input resize-none" placeholder="Nhập lý do khiếu nại..."/>
                </div>
              </div>
              <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
                <button type="button" onClick={()=>{setActiveModal(null);setSelected(null)}} className="btn-secondary">Hủy</button>
                <button className="btn-primary">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Gửi khiếu nại
                </button>
              </footer>
            </form>
          </div>
        )}
      </div>
    );
  }

  if (role === 'MANAGER') return <ManagerAttendanceMonitor/>;

  const myAlerts = allAlerts;

  const visible = filter === 'ALL' ? myAlerts : myAlerts.filter(a => a.severity === filter);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Giám sát chấm công</h1>
          <p className="mt-1 text-sm text-slate-500">Giám sát đi muộn / về sớm / thiếu công toàn công ty</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {myAlerts.filter(a => a.severity === 'Nghiêm trọng').length} cần xử lý
          </span>
          {role === 'ADMIN' && (
            <button onClick={()=>window.alert('Đã xuất báo cáo giám sát')} className="btn-secondary">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Xuất báo cáo
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Nghiêm trọng', count: myAlerts.filter(a=>a.severity==='Nghiêm trọng').length, icon: 'error', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' },
          { label: 'Cảnh báo', count: myAlerts.filter(a=>a.severity==='Cảnh báo').length, icon: 'warning', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500' },
          { label: 'Tổng vi phạm', count: myAlerts.length, icon: 'monitor_heart', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
        ].map(c => (
          <div key={c.label} className={`card p-5 border-l-4 ${c.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[20px] ${c.color}`}>{c.icon}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{c.count}</p>
                <p className="text-xs text-slate-500">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-input w-auto">
            <option value="ALL">Tất cả mức độ</option>
            <option value="Nghiêm trọng">Nghiêm trọng</option>
            <option value="Cảnh báo">Cảnh báo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3">Nhân viên</th>
              {role === 'ADMIN' && <th className="px-4 py-3">Phòng ban</th>}
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Loại vi phạm</th>
              <th className="px-4 py-3">Chi tiết</th>
              <th className="px-4 py-3">Mức độ</th>
              <th className="px-4 py-3 text-center">Xử lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <span className="material-symbols-outlined text-slate-300 text-5xl">inbox</span>
                    <p className="text-sm text-slate-400">Chưa có dữ liệu vi phạm</p>
                  </div>
                </td>
              </tr>
            ) : visible.map(alert => (
              <tr key={alert.id} className="text-sm hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900">{alert.name}</div>
                  <div className="text-xs text-slate-400">{alert.empId}</div>
                </td>
                {role === 'ADMIN' && <td className="px-4 py-3 text-slate-500">{alert.dept}</td>}
                <td className="px-4 py-3 text-slate-700">{alert.date}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{alert.type}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{alert.detail}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${alert.severity === 'Nghiêm trọng' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => { setSelected(alert); setActiveModal('detail'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition mx-auto" title="Xử lý vi phạm">
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Backdrop */}
      {activeModal && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={() => { setActiveModal(null); setSelected(null); }} />}

      {/* Handle Violation Modal */}
      {activeModal === 'detail' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Xử lý vi phạm</h2>
              <button onClick={() => { setActiveModal(null); setSelected(null); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div className={`p-4 rounded-xl border ${selected.severity === 'Nghiêm trọng' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                <div className="font-bold mb-1">{selected.type}</div>
                <div className="text-sm">{selected.detail}</div>
              </div>
              <div className="space-y-1">
                {[
                  { l: 'Nhân viên', v: selected.name },
                  { l: 'Mã NV', v: selected.empId },
                  { l: 'Ngày', v: selected.date },
                  { l: 'Mức độ', v: selected.severity },
                ].map(r => (
                  <div key={r.l} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{r.l}</span>
                    <span className="text-sm font-semibold text-slate-900">{r.v}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="form-label">Ghi chú xử lý</label>
                <textarea rows={3} placeholder="Nhập biện pháp xử lý..." className="form-input resize-none" />
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => { setActiveModal(null); setSelected(null); }} className="btn-secondary">Đóng</button>
              <button onClick={() => { setActiveModal(null); setSelected(null); }} className="btn-primary bg-red-600 hover:bg-red-700">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                Xác nhận xử lý
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
