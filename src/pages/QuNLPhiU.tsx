import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { loadTickets, saveTickets, type SharedTicket, type TicketKind } from '../data/ticketStore';
import EmployeeTickets, { TicketModal, type FormKind } from '../components/EmployeeTickets';

type Modal='picker'|'leave'|'explain'|null;
const field='w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10';
function ModalShell({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
function Footer({close}:{close:()=>void}){
  return (
    <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
      <button type="button" onClick={close} className="btn-secondary">Hủy</button>
      <button className="btn-primary">
        <span className="material-symbols-outlined text-[18px]">send</span>
        Gửi phiếu
      </button>
    </footer>
  );
}
const formatDate=(v:string)=>v?v.split('-').reverse().join('/'):'—';
const ticketStart=(t:SharedTicket)=>t.fields.start||t.fields['Từ ngày']||t.fields['Ngày giải trình']||t.createdAt;
const ticketEnd=(t:SharedTicket)=>t.fields.end||t.fields['Đến ngày']||'—';
const ticketMode=(t:SharedTicket)=>t.fields.mode||t.fields['Chế độ']||t.fields['Thời lượng']||'';
const ticketStatusClass=(status:SharedTicket['status'])=>status==='Đã duyệt'?'border-emerald-200 bg-emerald-50 text-emerald-700':status==='Từ chối'?'border-rose-200 bg-rose-50 text-rose-700':status==='Đã thu hồi'?'border-slate-200 bg-slate-100 text-slate-600':'border-amber-200 bg-amber-50 text-amber-700';

export default function QuNLPhiU(){
 const {role}=useRole(); const location=useLocation(); const [tickets,setTickets]=useState<SharedTicket[]>(loadTickets); const [modal,setModal]=useState<Modal>(null); const [tab,setTab]=useState('Tất cả'); const [period,setPeriod]=useState<'Buổi sáng'|'Buổi chiều'|'Cả ngày'>('Cả ngày'); const [selected,setSelected]=useState<SharedTicket|null>(null);
 if(role==='EMPLOYEE') return <EmployeeTickets/>;
 if(role==='MANAGER'&&new URLSearchParams(location.search).get('scope')==='mine') return <EmployeeTickets ownerName="Lê Hoàng Dũng" ownerDepartment="Phòng IT"/>;
 const close=()=>setModal(null);
 const send=(kind:TicketKind,form:HTMLFormElement)=>{const d=new FormData(form);let fields:Record<string,string>={};if(kind==='Nghỉ phép'){const start=String(d.get('start'));const end=period==='Cả ngày'?String(d.get('end')):start;fields={'Từ ngày':formatDate(start),'Đến ngày':formatDate(end),'Thời lượng':period,'Ngày công bị trừ':period==='Cả ngày'?'1 công/ngày':'0,5 công','Chế độ':String(d.get('mode')),'Lý do':String(d.get('reason')),'Lý do khác':String(d.get('other')||'—'),'Ghi chú':String(d.get('note')||'—'),'Người xử lý':String(d.get('approver'))};}else if(kind==='Giải trình'){fields={'Ngày giải trình':formatDate(String(d.get('date'))),'Loại sai lệch':String(d.get('issue')),'Nội dung':String(d.get('content')),'Người xử lý':String(d.get('approver'))};}else{fields={tripType:String(d.get('tripType')),'Phương tiện':String(d.get('transport')),'Nơi đi':String(d.get('from')),'Điểm đến':String(d.get('to')),'Từ ngày':String(d.get('start')),'Đến ngày':String(d.get('end')),'Lý do':String(d.get('reason'))};}const next=[{id:`PH-${Date.now().toString().slice(-6)}`,kind,employee:role==='MANAGER'?'Lê Hoàng Dũng':'Trần Thị Mai',status:'Chờ duyệt' as const,createdAt:new Date().toLocaleDateString('vi-VN'),fields},...tickets];setTickets(next);saveTickets(next);close();};
 if(role==='MANAGER'||role==='ADMIN') return <ManagerView tickets={tickets} setTickets={setTickets} selected={selected} setSelected={setSelected} canCreate={role==='MANAGER'} onCreateSubmit={send}/>;
 const shown=tickets.filter(t=>tab==='Tất cả'||t.status===tab);
 return (
  <div className="flex flex-col gap-6 p-6">
    {/* Page Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="page-title">Phiếu của tôi</h1>
        <p className="mt-1 text-sm text-slate-500">Tạo và theo dõi phiếu yêu cầu của bạn</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="badge-blue">{tickets.length} phiếu</span>
        <button onClick={()=>setModal('picker')} className="btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tạo phiếu mới
        </button>
      </div>
    </div>

    {/* Tab Filters */}
    <div className="card p-4">
      <div className="flex gap-2">
        {['Tất cả','Chờ duyệt','Đã duyệt','Từ chối'].map(x=>(
          <button key={x} onClick={()=>setTab(x)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab===x?'bg-blue-600 text-white shadow-sm':'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{x}</button>
        ))}
      </div>
    </div>

    {/* Ticket Table */}
    <TicketTable tickets={shown} onView={setSelected}/>

    {/* Picker Modal */}
    {modal==='picker' && (
      <ModalShell title="Chọn loại phiếu" close={close}>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          {[
            ['leave','Xin nghỉ phép','event_busy','Đăng ký nghỉ phép có phép'],
            ['explain','Giải trình','description','Giải trình sai lệch chấm công'],
          ].map(([id,label,icon,desc])=>(
            <button key={id} onClick={()=>setModal(id as Modal)} className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 p-5 text-left hover:border-blue-500 hover:bg-blue-50/30 transition group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 group-hover:bg-blue-100 transition">
                <span className="material-symbols-outlined text-[20px] text-blue-600">{icon}</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </ModalShell>
    )}

    {/* Leave Modal */}
    {modal==='leave' && (
      <ModalShell title="Phiếu xin nghỉ phép" close={close}>
        <form onSubmit={e=>{e.preventDefault();send('Nghỉ phép',e.currentTarget)}}>
          <div className="space-y-4 p-6">
            <div>
              <label className="form-label">Thời lượng nghỉ <span className="text-red-500">*</span></label>
              <div className="mt-1 grid grid-cols-3 gap-3">
                {['Buổi sáng','Buổi chiều','Cả ngày'].map(x=>(
                  <button type="button" key={x} onClick={()=>setPeriod(x as typeof period)} className={`rounded-xl border-2 p-3 text-left transition ${period===x?'border-blue-500 bg-blue-50':'border-slate-200 hover:border-slate-300'}`}>
                    <b className={`text-sm ${period===x?'text-blue-700':'text-slate-700'}`}>{x}</b>
                    <small className="block text-xs text-slate-400 mt-0.5">Trừ {x==='Cả ngày'?'1 công/ngày':'0,5 công'}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className={`grid gap-4 ${period==='Cả ngày'?'grid-cols-2':'grid-cols-1'}`}>
              <div>
                <label className="form-label">{period==='Cả ngày'?'Từ ngày':'Ngày nghỉ'} <span className="text-red-500">*</span></label>
                <input name="start" required type="date" className={field}/>
              </div>
              {period==='Cả ngày' && (
                <div>
                  <label className="form-label">Đến ngày <span className="text-red-500">*</span></label>
                  <input name="end" required type="date" className={field}/>
                </div>
              )}
            </div>
            <div>
              <label className="form-label">Chế độ <span className="text-red-500">*</span></label>
              <select name="mode" className={field}><option>Nghỉ phép năm</option><option>Nghỉ ốm</option></select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Lý do <span className="text-red-500">*</span></label>
                <textarea name="reason" required rows={3} className={`${field} resize-none`}/>
              </div>
              <div>
                <label className="form-label">Lý do khác</label>
                <textarea name="other" rows={3} className={`${field} resize-none`}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Người xử lý <span className="text-red-500">*</span></label>
                <select name="approver" className={field}><option>Lê Hoàng Dũng</option></select>
              </div>
              <div>
                <label className="form-label">Ghi chú</label>
                <textarea name="note" rows={2} className={`${field} resize-none`}/>
              </div>
            </div>
          </div>
          <Footer close={close}/>
        </form>
      </ModalShell>
    )}

    {/* Explain Modal */}
    {modal==='explain' && (
      <ModalShell title="Phiếu giải trình" close={close}>
        <form onSubmit={e=>{e.preventDefault();send('Giải trình',e.currentTarget)}}>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <label className="form-label">Ngày giải trình <span className="text-red-500">*</span></label>
              <input name="date" required type="date" className={field}/>
            </div>
            <div>
              <label className="form-label">Loại sai lệch <span className="text-red-500">*</span></label>
              <select name="issue" className={field}><option>Đi muộn</option><option>Thiếu check-in</option><option>Thiếu check-out</option></select>
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Nội dung <span className="text-red-500">*</span></label>
              <textarea name="content" required rows={4} className={`${field} resize-none`}/>
            </div>
            <div>
              <label className="form-label">Người xử lý <span className="text-red-500">*</span></label>
              <select name="approver" className={field}><option>Lê Hoàng Dũng</option></select>
            </div>
          </div>
          <Footer close={close}/>
        </form>
      </ModalShell>
    )}

    {/* Detail Modal */}
    {selected && <Detail ticket={selected} close={()=>setSelected(null)}/>}
  </div>
 );
}

function TicketTable({tickets,onView}:{tickets:SharedTicket[];onView:(t:SharedTicket)=>void}){
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="table-header">
            <th className="px-4 py-3">Loại phiếu</th>
            <th className="px-4 py-3">Thời gian</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map(t=>(
            <tr key={t.id} className="text-sm hover:bg-slate-50 transition">
              <td className="px-4 py-3">
                <div className="font-semibold text-blue-600">{t.kind}</div>
                <div className="text-xs text-slate-400 mt-0.5">{t.id}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {t.fields['Từ ngày']||t.fields['Ngày giải trình']} {t.fields['Đến ngày']&&`– ${t.fields['Đến ngày']}`}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{t.status}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={()=>onView(t)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Detail({ticket,close}:{ticket:SharedTicket;close:()=>void}){
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{ticket.kind}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{ticket.id} · {ticket.employee}</p>
          </div>
          <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </header>
        <div className="grid grid-cols-2 gap-3 p-6">
          {Object.entries(ticket.fields).map(([k,v])=>(
            <div key={k} className="rounded-lg bg-slate-50 p-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{k}</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ManagerView({tickets,setTickets,selected,setSelected,canCreate,onCreateSubmit}:{tickets:SharedTicket[];setTickets:(x:SharedTicket[])=>void;selected:SharedTicket|null;setSelected:(x:SharedTicket|null)=>void;canCreate:boolean;onCreateSubmit:(kind:TicketKind,form:HTMLFormElement)=>void}){
 const location=useLocation();
 const scope:'team'|'mine'=canCreate&&new URLSearchParams(location.search).get('scope')==='mine'?'mine':'team';
 const [status,setStatus]=useState('Tất cả');
 const [category,setCategory]=useState('Tất cả loại');
 const [query,setQuery]=useState('');
 const [date,setDate]=useState('');
 const [createKind,setCreateKind]=useState<FormKind|null>(null);
 const [teamTickets,setTeamTickets]=useState<SharedTicket[]>([
  {id:'QL-001',kind:'Nghỉ phép',employee:'Nguyễn Văn An',status:'Chờ duyệt',createdAt:'22/09/2026',fields:{'Từ ngày':'22/09/2026','Đến ngày':'23/09/2026','Lý do':'Nghỉ phép thường niên giải quyết việc gia đình'}},
  {id:'QL-002',kind:'Công tác dài ngày',employee:'Lê Thanh Bình',status:'Chờ duyệt',createdAt:'21/09/2026',fields:{'Từ ngày':'21/09/2026','Đến ngày':'25/09/2026','Lý do':'Bàn giao hệ thống & đào tạo Q3'}},
  {id:'QL-003',kind:'Giải trình',employee:'Trần Thị Mai',status:'Chờ duyệt',createdAt:'21/09/2026',fields:{'Ngày giải trình':'21/09/2026','Nội dung':'Quên quẹt thẻ do thiết bị lỗi vân tay tầng 3'}},
  {id:'QL-004',kind:'Công tác liên văn phòng',employee:'Nguyễn Văn Hùng',status:'Chờ duyệt',createdAt:'15/11/2026',fields:{'Từ ngày':'15/11/2026','Đến ngày':'16/11/2026','Lý do':'Kiểm toán nội bộ & rà soát Q4'}},
  {id:'QL-006',kind:'Nghỉ phép',employee:'Bùi Thanh Tùng',status:'Đã duyệt',createdAt:'25/09/2026',fields:{'Từ ngày':'25/09/2026','Đến ngày':'25/09/2026','Lý do':'Khám sức khỏe định kỳ'}},
 ]);
 const employeeTickets=tickets.filter(t=>t.employee!=='Lê Hoàng Dũng');
 const baseTickets=scope==='mine'?tickets.filter(t=>t.employee==='Lê Hoàng Dũng'):[...employeeTickets,...teamTickets.filter(t=>!employeeTickets.some(saved=>saved.id===t.id))];
 const counts={pending:baseTickets.filter(t=>t.status==='Chờ duyệt').length,approved:baseTickets.filter(t=>t.status==='Đã duyệt').length,rejected:baseTickets.filter(t=>t.status==='Từ chối').length,recalled:baseTickets.filter(t=>t.status==='Đã thu hồi').length};
 const categories=['Tất cả loại','Nghỉ phép','Giải trình','Công tác trong ngày','Công tác dài ngày','Công tác liên văn phòng'];
 const visible=baseTickets.filter(t=>(status==='Tất cả'||t.status===status)&&(category==='Tất cả loại'||t.kind===category||(category.startsWith('Công tác')&&t.kind==='Công tác'))&&`${t.employee} ${t.kind} ${Object.values(t.fields).join(' ')}`.toLowerCase().includes(query.toLowerCase())&&(!date||Object.values(t.fields).some(v=>v.includes(date.split('-').reverse().join('/')))));
 const reason=(t:SharedTicket)=>t.fields['Lý do']||t.fields.reason||t.fields['Nội dung']||t.fields.content||t.fields['Nội dung công việc']||'Yêu cầu nhân sự';
 const time=(t:SharedTicket)=>{const start=t.fields['Từ ngày']||t.fields.start||t.fields['Ngày giải trình']||t.createdAt;const end=t.fields['Đến ngày']||t.fields.end;return end&&end!==start?`${start} – ${end}`:start};
 const decide=(nextStatus:'Đã duyệt'|'Từ chối')=>{if(!selected)return;if(selected.id.startsWith('QL-'))setTeamTickets(rows=>rows.map(t=>t.id===selected.id?{...t,status:nextStatus}:t));else{const next=tickets.map(t=>t.id===selected.id?{...t,status:nextStatus}:t);setTickets(next);saveTickets(next)}setSelected(null)};
 const recall=(ticket:SharedTicket)=>{if(!window.confirm(`Thu hồi phiếu ${ticket.id}?`))return;const next=tickets.map(t=>t.id===ticket.id?{...t,status:'Đã thu hồi' as const}:t);setTickets(next);saveTickets(next);if(selected?.id===ticket.id)setSelected(null)};
 const reset=()=>{setStatus('Tất cả');setCategory('Tất cả loại');setQuery('');setDate('')};
 return (
  <div className="flex flex-col gap-6 p-6">
    {/* Page Header */}
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="page-title">{scope==='mine'?'Phiếu & Đơn từ':'Quản lý phiếu'}</h1>
          <span className="badge-blue">{scope==='mine'?`${baseTickets.length} phiếu`:`${baseTickets.length} đề xuất & phiếu`}</span>
        </div>
      </div>
      {canCreate && (
        <button onClick={()=>setCreateKind('Công tác')} className="btn-primary px-5 py-3 text-sm">
          <span className="material-symbols-outlined text-[20px]">add</span>
          {scope==='mine'?'Tạo phiếu mới':'Tạo đề xuất / Phiếu'}
        </button>
      )}
    </div>

    {/* Filter Panel */}
    <div className="card p-5">
      {/* Status Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex flex-wrap gap-2">
          {([['Tất cả',baseTickets.length],['Chờ duyệt',counts.pending],['Đã duyệt',counts.approved],['Từ chối',counts.rejected],...(scope==='mine'?[['Đã thu hồi',counts.recalled]]:[])] as [string,number][]).map(([label,count])=>(
            <button key={label} onClick={()=>setStatus(label)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${status===label?'bg-blue-600 text-white shadow-sm':'text-slate-600 hover:bg-slate-50'}`}>
              {label} ({count})
            </button>
          ))}
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition">
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Đặt lại bộ lọc
        </button>
      </div>

      {/* Category Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">Phân loại:</span>
        {categories.map((item,i)=>(
          <button key={item} onClick={()=>setCategory(item)} className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${category===item?'border-blue-500 bg-blue-50 text-blue-700':'border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-slate-50'}`}>
            {i>3 && <span className="material-symbols-outlined text-[14px] mr-1 align-middle">flight</span>}
            {item}
          </button>
        ))}
      </div>

      {/* Search Row */}
      <div className="mt-4 grid grid-cols-[minmax(260px,1fr)_220px_auto] items-center gap-3">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
          <input value={query} onChange={e=>setQuery(e.target.value)} className="form-input pl-9" placeholder={scope==='mine'?'Tìm kiếm theo loại phiếu, lý do...':'Tìm kiếm theo tên nhân viên, lý do...'}/>
        </div>
        <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="form-input w-[220px]"/>
        <button className="btn-secondary">
          <span className="material-symbols-outlined text-[18px]">filter_alt</span>
          Áp dụng
        </button>
      </div>
    </div>

    {/* My Tickets Table */}
    {scope==='mine' ? (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left">
            <thead>
              <tr className="bg-blue-900 text-white">
                {['STT','Loại phiếu / Chế độ','Bắt đầu','Kết thúc','Lý do','Trạng thái','Chức năng'].map(x=>(
                  <th key={x} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length ? visible.map((t,i)=>(
                <tr key={t.id} className="text-sm hover:bg-slate-50 transition">
                  <td className="px-5 py-4 text-slate-400">{i+1}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{t.kind}</p>
                    {ticketMode(t) && <p className="mt-0.5 text-xs text-slate-400">{ticketMode(t)}</p>}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">{ticketStart(t)}</td>
                  <td className="px-5 py-4 text-slate-600">{ticketEnd(t)}</td>
                  <td className="max-w-[380px] px-5 py-4">
                    <p className="rounded-lg bg-blue-50/70 px-3 py-2 text-sm text-slate-700">{reason(t)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${ticketStatusClass(t.status)}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setSelected(t)} title="Xem chi tiết" aria-label={`Xem ${t.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                        <span className="material-symbols-outlined text-[18px]">info</span>
                      </button>
                      {t.status==='Chờ duyệt' && (
                        <button onClick={()=>recall(t)} title="Thu hồi phiếu" aria-label={`Thu hồi ${t.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50 transition">
                          <span className="material-symbols-outlined text-[18px]">undo</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-6 py-16 text-center text-sm text-slate-400">Không có phiếu phù hợp với bộ lọc</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm text-slate-500">
          <span>Tổng <b>{visible.length}</b> bản ghi</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">‹</span>
            <span className="rounded-lg border border-blue-500 px-3 py-1 text-sm font-semibold text-blue-700">1</span>
            <span className="text-slate-400">›</span>
            <select className="form-input w-auto text-xs"><option>20 / page</option></select>
          </div>
        </div>
      </div>
    ) : (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                {['STT','Tên nhân viên','Loại phiếu','Thời gian','Lý do / Mục đích','Trạng thái'].map(x=>(
                  <th key={x} className="px-4 py-3">{x}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length ? visible.slice(0,5).map((t,i)=>(
                <tr key={t.id} onClick={()=>setSelected(t)} className="cursor-pointer text-sm hover:bg-blue-50/40 transition">
                  <td className="px-4 py-4 text-slate-400">{i+1}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{t.employee}</td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{t.kind}</td>
                  <td className="px-4 py-4 font-medium text-slate-700">{time(t)}</td>
                  <td className="max-w-[330px] px-4 py-4 text-slate-600">{reason(t)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${ticketStatusClass(t.status)}`}>● {t.status}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-sm text-slate-400">Không có phiếu phù hợp với bộ lọc</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-1 border-t border-slate-100 px-5 py-3">
          <button disabled className="h-9 w-9 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center text-sm">‹</button>
          <button className="h-9 w-9 rounded-lg bg-blue-600 font-semibold text-white flex items-center justify-center text-sm">1</button>
          <button className="h-9 w-9 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-sm">2</button>
          <button className="h-9 w-9 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center text-sm">›</button>
        </div>
      </div>
    )}

    {/* Create Kind Modal */}
    {createKind && <TicketModal kind={createKind} onKindChange={setCreateKind} onClose={()=>setCreateKind(null)} onSubmit={(kind,form)=>{onCreateSubmit(kind,form);setCreateKind(null)}}/>}

    {/* Selected Ticket Detail Modal */}
    {selected && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
          <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <div className="flex items-center gap-3"><h2 className="text-xl font-bold text-slate-900">{selected.employee==='Lê Hoàng Dũng'?'Chi tiết phiếu của tôi':'Chi tiết yêu cầu chờ duyệt'}</h2>{selected.employee!=='Lê Hoàng Dũng'&&<span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">● TRẠNG THÁI: {selected.status.toUpperCase()}</span>}</div>
              <p className="mt-1 text-sm text-slate-500"><b className="text-blue-600">{selected.id}</b>　•　{selected.employee}</p>
            </div>
            <button onClick={()=>setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </header>
          <div className="grid max-h-[68vh] grid-cols-2 gap-3 overflow-y-auto p-6">
           {selected.employee!=='Lê Hoàng Dũng'&&<><h3 className="col-span-2 border-l-4 border-blue-600 pl-3 text-sm font-bold uppercase">Thông tin phiếu</h3></>}
            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Loại phiếu</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selected.kind}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Trạng thái</span>
              <p className="mt-1 text-sm font-semibold text-slate-900">{selected.status}</p>
            </div>
            {Object.entries(selected.fields).map(([k,v])=>(
              <div key={k} className="rounded-xl bg-slate-50 p-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider">{{tripType:'Loại công tác',transport:'Phương tiện',from:'Nơi đi',to:'Điểm đến',start:'Từ ngày / giờ',end:'Đến ngày / giờ',part:'Buổi nghỉ',mode:'Chế độ',reason:'Lý do / Mục đích',complaintType:'Loại vi phạm',date:'Ngày khiếu nại',actualTime:'Thời gian thực tế'}[k]||k}</span>
                <p className="mt-1 whitespace-pre-wrap text-sm font-semibold text-slate-900">{['start','end'].includes(k)&&v.includes('T')?v.replace('T',' lúc '):v}</p>
              </div>
            ))}
          </div>
          <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
            {selected.employee==='Lê Hoàng Dũng' ? (
              <>
                {selected.status==='Chờ duyệt' && (
                  <button onClick={()=>recall(selected)} className="btn-secondary border-amber-200 text-amber-700 hover:bg-amber-50">
                    <span className="material-symbols-outlined text-[18px]">undo</span>
                    Thu hồi phiếu
                  </button>
                )}
                <button onClick={()=>setSelected(null)} className="btn-primary">Đóng</button>
              </>
            ) : (
              <>
                <button onClick={()=>decide('Từ chối')} className="btn-danger">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  Từ chối đơn
                </button>
                <button onClick={()=>decide('Đã duyệt')} className="btn-primary">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Phê duyệt đơn
                </button>
              </>
            )}
          </footer>
        </div>
      </div>
    )}
  </div>
 );
}
