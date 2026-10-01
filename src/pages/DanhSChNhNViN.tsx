import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const DEPARTMENTS = ['Phòng Công nghệ', 'Phòng Kinh doanh', 'Phòng Kế toán', 'Phòng HR', 'Phòng Kỹ thuật', 'Khối Vận hành'];
const TITLES = ['Senior Developer', 'Business Analyst', 'Trưởng nhóm Sales', 'Chuyên viên C&B', 'Kỹ sư vận hành', 'Account Executive', 'Giám sát ca', 'Kế toán thanh toán'];

type Employee = {
  id: string; name: string; account: string; dept: string; title: string;
  manager: string; managerId: string; status: string; phone: string; email: string; joinDate: string;
};

const ALL_EMPLOYEES: Employee[] = [
  { id:'NV001', name:'Nguyễn Văn Minh',  account:'minhnv',  dept:'Phòng Công nghệ',      title:'Senior Developer',       manager:'Trần Văn Nam',     managerId:'NV_MGR1', status:'Đang làm việc', phone:'0912345001', email:'minhnv@company.com',  joinDate:'01/03/2021' },
  { id:'NV002', name:'Lê Thu Hà',        account:'halt',    dept:'Phòng Công nghệ',      title:'Business Analyst',       manager:'Trần Văn Nam',     managerId:'NV_MGR1', status:'Đang làm việc', phone:'0912345002', email:'halt@company.com',    joinDate:'15/06/2021' },
  { id:'NV003', name:'Phạm Hoàng Nam',   account:'namph',   dept:'Phòng Kinh doanh',     title:'Trưởng nhóm Sales',      manager:'Nguyễn Hữu Thắng', managerId:'NV_MGR2', status:'Đang làm việc', phone:'0912345003', email:'namph@company.com',   joinDate:'10/01/2020' },
  { id:'NV004', name:'Vũ Khánh Linh',    account:'linhvk',  dept:'Phòng HR',             title:'Chuyên viên C&B',        manager:'Nguyễn Văn An',    managerId:'NV_MGR3', status:'Đang làm việc', phone:'0912345004', email:'linhvk@company.com',  joinDate:'20/08/2022' },
  { id:'NV005', name:'Trần Đình Trọng',  account:'trongtd', dept:'Phòng Kỹ thuật',       title:'Kỹ sư vận hành',         manager:'Vũ Tiến Dũng',     managerId:'NV_MGR4', status:'Tạm nghỉ',     phone:'0912345005', email:'trongtd@company.com', joinDate:'05/05/2019' },
  { id:'NV006', name:'Hoàng Đức Trọng',  account:'tronghd', dept:'Phòng Kinh doanh',     title:'Account Executive',      manager:'Phạm Hoàng Nam',   managerId:'NV_MGR2', status:'Đang làm việc', phone:'0912345006', email:'tronghd@company.com', joinDate:'12/11/2021' },
  { id:'NV007', name:'Đỗ Hữu Thắng',    account:'thangdh', dept:'Khối Vận hành',         title:'Giám sát ca',            manager:'Lê Hoàng Nam',     managerId:'NV_MGR5', status:'Đã nghỉ việc', phone:'0912345007', email:'thangdh@company.com', joinDate:'03/02/2018' },
  { id:'NV008', name:'Ngô Thùy Linh',   account:'linhnt',  dept:'Phòng Kế toán',        title:'Kế toán thanh toán',     manager:'Trần Thị Mai',     managerId:'NV_MGR6', status:'Đang làm việc', phone:'0912345008', email:'linhnt@company.com',  joinDate:'28/09/2022' },
  { id:'NV009', name:'Bùi Thị Hương',   account:'huongbt', dept:'Phòng Công nghệ',      title:'Frontend Developer',     manager:'Trần Văn Nam',     managerId:'NV_MGR1', status:'Đang làm việc', phone:'0912345009', email:'huongbt@company.com', joinDate:'01/12/2022' },
  { id:'NV010', name:'Nguyễn Minh Tú',  account:'tungm',   dept:'Phòng Kinh doanh',     title:'Sales Executive',        manager:'Phạm Hoàng Nam',   managerId:'NV_MGR2', status:'Đang làm việc', phone:'0912345010', email:'tungm@company.com',   joinDate:'15/03/2023' },
];

// Manager NV_MGR1 manages: NV001, NV002, NV009 (Phòng Công nghệ)
const MANAGER_TEAM = ['NV001', 'NV002', 'NV009'];

const statusColor = (s: string) => {
  if (s === 'Đang làm việc') return 'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-teal-100 text-teal-800';
  if (s === 'Tạm nghỉ') return 'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700';
  return 'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-slate-200 text-slate-700';
};

function InfoCard({label,value,sub}:{label:string;value:string;sub?:string}){return <div className="rounded-xl bg-slate-50 border border-slate-100 p-4"><p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</p><b className="mt-2 block text-sm text-slate-900">{value}</b>{sub&&<p className="mt-1 text-xs text-slate-500">{sub}</p>}</div>}
function InfoValue({label,value}:{label:string;value:string}){return <div><p className="text-xs text-slate-500">{label}</p><b className="mt-1 block text-sm text-slate-900">{value}</b></div>}
function EditSection({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-xl bg-white border border-slate-200 p-5"><h3 className="mb-4 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">{title}</h3>{children}</section>}
function Field({label,wide,children}:{label:string;wide?:boolean;children:React.ReactElement}){return <label className={`block text-sm font-semibold text-slate-700 ${wide?'col-span-3':''}`}>{label}{React.cloneElement(children as React.ReactElement<any>,{className:'mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-slate-100 disabled:text-slate-400'})}</label>}

function EmployeeDirectory({employees}:{employees:Employee[]}){
 const [query,setQuery]=useState('');const[dept,setDept]=useState('ALL');const[title,setTitle]=useState('ALL');const[presence,setPresence]=useState('ALL');
 const presenceOf=(e:Employee)=>e.id==='NV002'?'Vắng mặt':'Đã có mặt';
 const rows=employees.filter(e=>(dept==='ALL'||e.dept===dept)&&(title==='ALL'||e.title===title)&&(presence==='ALL'||presenceOf(e)===presence)&&`${e.name} ${e.email} ${e.id}`.toLowerCase().includes(query.toLowerCase()));
 return <div className="min-h-full space-y-5 bg-[#f8fafc] p-6"><header className="flex items-center justify-between"><h1 className="text-2xl font-bold">Danh sách nhân viên</h1><button onClick={()=>window.alert('Đã xuất danh sách nhân viên')} className="btn-secondary"><span className="material-symbols-outlined text-[16px]">download</span>Xuất Excel</button></header><section className="rounded-xl border bg-white p-4 shadow-sm"><div className="grid gap-4 md:grid-cols-4"><label className="text-[11px] font-bold uppercase text-slate-600">Tìm kiếm nhân viên<div className="relative mt-2"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-slate-400">search</span><input value={query} onChange={e=>setQuery(e.target.value)} className="form-input pl-9" placeholder="Tên, mã nhân viên, email..."/></div></label><label className="text-[11px] font-bold uppercase text-slate-600">Phòng ban / Đơn vị<select value={dept} onChange={e=>setDept(e.target.value)} className="form-input mt-2"><option value="ALL">Khối Công nghệ</option>{DEPARTMENTS.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-[11px] font-bold uppercase text-slate-600">Chức vụ<select value={title} onChange={e=>setTitle(e.target.value)} className="form-input mt-2"><option value="ALL">Tất cả chức vụ</option>{TITLES.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-[11px] font-bold uppercase text-slate-600">Trạng thái<select value={presence} onChange={e=>setPresence(e.target.value)} className="form-input mt-2"><option value="ALL">Đang làm việc</option><option>Đã có mặt</option><option>Vắng mặt</option></select></label></div></section><section className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead className="bg-slate-50 text-[11px] uppercase text-slate-500"><tr>{['Họ tên','Phòng ban','Chức vụ','Liên hệ','Trạng thái'].map(x=><th key={x} className="px-6 py-4">{x}</th>)}</tr></thead><tbody className="divide-y">{rows.map(e=><tr key={e.id} className="text-sm hover:bg-slate-50"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">{e.name.split(' ').at(-1)?.[0]}</span><b>{e.name}</b></div></td><td className="px-6 py-4 text-slate-600">{e.dept}</td><td className="px-6 py-4 text-slate-700">{e.title}</td><td className="px-6 py-4"><span className="block text-xs">{e.email}</span><span className="text-xs text-slate-400">{e.phone}</span></td><td className="px-6 py-4"><span className={`rounded-full border px-3 py-1 text-xs ${presenceOf(e)==='Đã có mặt'?'border-emerald-200 bg-emerald-50 text-emerald-600':'border-rose-200 bg-rose-50 text-rose-600'}`}>{presenceOf(e)}</span></td></tr>)}</tbody></table></div><footer className="flex items-center justify-between border-t bg-slate-50 px-5 py-4 text-xs text-slate-500"><span>Hiển thị 1-{rows.length} trên {rows.length} nhân viên</span><div><button className="h-8 w-8 text-slate-300">‹</button><button className="h-8 w-8 rounded bg-blue-600 text-white">1</button><button className="h-8 w-8 text-slate-300">›</button></div></footer></section></div>
}

export default function DanhSChNhNViN() {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterTitle, setFilterTitle] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(ALL_EMPLOYEES);
  const [confirmDelete, setConfirmDelete] = useState<string|null>(null);

  // Manager chỉ thấy team của mình
  const baseList = role === 'MANAGER'
    ? employees.filter(e => MANAGER_TEAM.includes(e.id))
    : employees;

  const visible = baseList.filter(e =>
    (search === '' || e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()) || e.account.toLowerCase().includes(search.toLowerCase())) &&
    (filterDept === 'ALL' || e.dept === filterDept) &&
    (filterTitle === 'ALL' || e.title === filterTitle) &&
    (filterStatus === 'ALL' || e.status === filterStatus)
  );

  const handleAdd = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const f = ev.currentTarget.elements as any;
    const newEmp: Employee = {
      id: f.eId.value, name: f.eName.value, account: f.eAccount.value,
      dept: f.eDept.value, title: f.eTitle.value,
      manager: f.eManager.value, managerId: 'NV_NEW',
      status: 'Đang làm việc',
      phone: f.ePhone.value, email: f.eEmail.value,
      joinDate: new Date().toLocaleDateString('vi-VN'),
    };
    setEmployees([...employees, newEmp]);
    setActiveModal(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      setEmployees(employees.filter(e => e.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  const availableDepts = role === 'MANAGER'
    ? [...new Set(MANAGER_TEAM.map(id => employees.find(e => e.id === id)?.dept).filter(Boolean))]
    : DEPARTMENTS;

  return <EmployeeDirectory employees={baseList}/>;

  /* Legacy role-specific administration view retained below for reference. */
  return (
    <div className="flex flex-col gap-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between flex-wrap gap-4 rounded-xl border bg-white p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Danh sách nhân viên</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              {role === 'MANAGER' ? 'Phạm vi: Khối Công nghệ' : role==='EMPLOYEE'?'Danh bạ nội bộ':'Phạm vi: Toàn công ty (Admin/HR)'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {role === 'MANAGER'
              ? `Quản lý ${visible.length} nhân viên trong team của bạn.`
              : 'Quản lý thông tin nhân sự, phòng ban, chức vụ, quản lý trực tiếp và trạng thái làm việc.'}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {(role === 'ADMIN' || role === 'MANAGER') && (
            <button type="button" onClick={()=>window.alert('Đã xuất danh sách nhân viên')} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">download</span>Xuất Excel
            </button>
          )}
          {role === 'ADMIN' && (
            <button type="button" onClick={() => setActiveModal('add')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
              <span className="material-symbols-outlined text-[18px]">person_add</span>Thêm nhân viên
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-end gap-3 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã NV, account..."
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm pl-9 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-w-[160px]">
          <option value="ALL">Tất cả phòng ban</option>
          {availableDepts.map(d => <option key={d as string}>{d}</option>)}
        </select>
        <select value={filterTitle} onChange={e => setFilterTitle(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-w-[160px]">
          <option value="ALL">Tất cả chức vụ</option>
          {TITLES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 min-w-[140px]">
          <option value="ALL">Tất cả trạng thái</option>
          <option>Đang làm việc</option>
          <option>Tạm nghỉ</option>
          <option>Đã nghỉ việc</option>
        </select>
        <button type="button" onClick={() => { setSearch(''); setFilterDept('ALL'); setFilterTitle('ALL'); setFilterStatus('ALL'); }}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors" title="Đặt lại bộ lọc">
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>
      </div>

      {/* Result summary */}
      <div className="flex items-center justify-between px-1 -mt-2">
        <span className="text-sm text-slate-500">Tìm thấy <strong className="text-slate-900">{visible.length}</strong> nhân viên</span>
        <span className="text-xs text-slate-400">Hiển thị {visible.length} / {baseList.length}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-blue-900 bg-[#203f86] text-white">
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider w-14">STT</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Mã NV</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Họ tên</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Account</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Phòng ban</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Chức vụ</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Manager</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-center w-24">Chức năng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length === 0 && (
                <tr><td colSpan={9} className="text-center py-16 text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-slate-300 text-5xl">group_off</span>
                    <p className="text-sm text-slate-500">Không tìm thấy nhân viên phù hợp</p>
                  </div>
                </td></tr>
              )}
              {visible.map((emp, i) => (
                <tr key={emp.id} className="text-sm hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-3 px-4">
                    <button type="button" onClick={() => { setSelected(emp); setActiveModal('view'); }}
                      className="text-sm font-semibold text-blue-600 hover:underline">{emp.id}</button>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900">{emp.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{emp.account}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.dept}</td>
                  <td className="py-3 px-4 text-slate-700">{emp.title}</td>
                  <td className="py-3 px-4 text-slate-500">{emp.manager}</td>
                  <td className="py-3 px-4">
                    <span className={statusColor(emp.status)}>{emp.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" title="Xem chi tiết" onClick={() => { setSelected(emp); setActiveModal('view'); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      {(role === 'ADMIN' || role === 'MANAGER') && (
                        <>
                          <button type="button" title="Chỉnh sửa" onClick={() => { setSelected(emp); setActiveModal('edit'); }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          {role === 'ADMIN' && <button type="button" title="Xóa nhân viên" onClick={() => setConfirmDelete(emp.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>}
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
      {activeModal && <button aria-label="Đóng cửa sổ" onClick={()=>setActiveModal(null)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" />}

      {/* Employee detail and edit modals from manager design */}
      {(activeModal === 'view' || activeModal === 'edit') && selected && (
        <section role="dialog" aria-modal="true" aria-label={activeModal==='edit'?'Chỉnh sửa thông tin nhân viên':'Chi tiết nhân viên'} className={`fixed left-1/2 top-1/2 z-50 flex w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in ${activeModal==='edit'?'h-[min(92vh,850px)] max-w-[940px]':'h-[min(86vh,690px)] max-w-[900px]'}`}>
          {activeModal==='view'?<>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <section className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-400 text-2xl font-bold text-white">
                  {selected.name.split(' ').map(x=>x[0]).slice(-2).join('')}
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-xs text-white">✓</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">@{selected.account}</span>
                  </div>
                  <p className="mt-1 font-semibold text-blue-600">› {selected.title} • {selected.dept}</p>
                  <p className="mt-1 text-sm text-slate-500">✉ {selected.email}　☎ {selected.phone.replace(/(\d{4})(\d{3})(\d+)/,'$1 $2 $3')}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Gia nhập</p>
                  <b className="mt-2 block text-sm text-slate-900">{selected.joinDate}</b>
                </div>
              </section>
              <h3 className="text-sm font-semibold text-slate-500 border-b border-slate-100 pb-3">Thông tin cá nhân & Liên hệ</h3>
              <section className="grid grid-cols-3 gap-4">
                <InfoCard label="Phòng ban" value={selected.dept}/>
                <InfoCard label="Bộ phận / Nhóm" value="Backend Development Team"/>
                <InfoCard label="Chức danh" value={selected.title==='Senior Developer'?'Senior Software Engineer':selected.title}/>
                <div className="col-span-2 rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Loại hợp đồng</p>
                  <b className="mt-2 block text-sm text-slate-900">Hợp đồng lao động chính thức / Không xác định thời hạn</b>
                  <p className="mt-1 text-xs text-slate-500">Đã ký kết ngày {selected.joinDate} • Chế độ bảo hiểm đầy đủ</p>
                </div>
                <InfoCard label="Địa điểm làm việc" value="Trụ sở chính • Tầng 8" sub="Khu vực kỹ thuật Tech-Wing B"/>
              </section>
              <section className="rounded-xl bg-slate-50 border border-slate-100 p-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Thông tin cá nhân & Pháp lý</h3>
                <div className="grid grid-cols-3 gap-6">
                  <InfoValue label="Ngày sinh" value="12/08/1993"/>
                  <InfoValue label="Giới tính" value="Nam"/>
                  <InfoValue label="CCCD / Định danh" value="001093008912"/>
                  <div className="col-span-3">
                    <InfoValue label="Địa chỉ thường trú & Hiện tại" value="Số 28 Ngõ 102 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội"/>
                  </div>
                </div>
              </section>
            </div>
            <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Xem nhật ký ra vào cá nhân</button>
              <div className="flex gap-3">
                <button onClick={()=>{setActiveModal(null);setSelected(null)}} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Đóng</button>
                <button onClick={()=>setActiveModal('edit')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                  <span className="material-symbols-outlined text-[18px]">edit</span>Chỉnh sửa thông tin
                </button>
              </div>
            </footer>
          </>:<>
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">edit</span>
                </div>
                <h2 className="text-base font-bold text-slate-900">Chỉnh sửa thông tin nhân viên</h2>
              </div>
              <button onClick={()=>{setActiveModal(null);setSelected(null)}} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <form id="editEmpForm" onSubmit={ev=>{ev.preventDefault();const f=ev.currentTarget.elements as any;setEmployees(employees.map(e=>e.id===selected.id?{...e,name:f.eName.value,dept:f.eDept.value,title:f.eTitle.value,manager:f.eManager.value,email:f.eEmail.value,phone:f.ePhone.value,status:f.eStatus.value}:e));setActiveModal(null);setSelected(null)}} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-6">
              <EditSection title="1. Thông tin công việc & Vai trò"><div className="grid grid-cols-3 gap-4"><Field label="Họ và tên *"><input name="eName" required defaultValue={selected.name}/></Field><Field label="Account hệ thống"><input value={selected.account} disabled/></Field><Field label="Phòng ban *"><select name="eDept" defaultValue={selected.dept}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></Field><Field label="Chức vụ / Vị trí *"><select name="eTitle" defaultValue={selected.title}>{TITLES.map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Trạng thái làm việc *"><select name="eStatus" defaultValue={selected.status}><option>Đang làm việc</option><option>Tạm nghỉ</option><option>Đã nghỉ việc</option></select></Field><Field label="Quản lý trực tiếp (Manager) *" wide><input name="eManager" defaultValue={selected.manager}/></Field></div></EditSection>
              <EditSection title="2. Chấm công & Phân quyền kiểm soát ra vào"><Field label="Ca làm việc mặc định *"><select defaultValue="Ca hành chính (08:00 - 17:00, Thứ 2 - Thứ 6)"><option>Ca hành chính (08:00 - 17:00, Thứ 2 - Thứ 6)</option></select></Field><p className="mt-4 text-xs font-semibold text-slate-700">Nhóm quyền ra vào / Điểm truy cập được ủy quyền</p><div className="mt-3 grid grid-cols-3 gap-3">{['Cổng FaceID Tầng 1','Thang máy Tầng 8 (IT)','Cửa xoay Tripod Hầm'].map(x=><label key={x} className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 p-3 text-sm font-semibold cursor-pointer hover:bg-slate-100 transition"><input type="checkbox" defaultChecked className="h-4 w-4"/>{x}</label>)}</div></EditSection>
              <EditSection title="3. Thông tin liên hệ cơ bản"><div className="grid grid-cols-2 gap-4"><Field label="Email công ty *"><input name="eEmail" type="email" defaultValue={selected.email}/></Field><Field label="Số điện thoại liên lạc *"><input name="ePhone" defaultValue={selected.phone}/></Field></div></EditSection>
            </form>
            <footer className="flex gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <button onClick={()=>{setActiveModal(null);setSelected(null)}} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy bỏ</button>
              <button type="submit" form="editEmpForm" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                <span className="material-symbols-outlined text-[18px]">check</span>Lưu thay đổi
              </button>
            </footer>
          </>}
        </section>
      )}

      {/* Modal: Add employee (Admin only) */}
      {activeModal === 'add' && role === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">person_add</span>
                <h2 className="text-base font-bold text-slate-900">Thêm nhân viên mới</h2>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>

            <div className="p-6 grid grid-cols-2 gap-4 overflow-y-auto max-h-[65vh]">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã NV <span className="text-red-500">*</span></label>
                <input name="eId" required placeholder="NV011" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tài khoản <span className="text-red-500">*</span></label>
                <input name="eAccount" required placeholder="ten.nv" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-mono" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                <input name="eName" required placeholder="Nhập đầy đủ họ và tên" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phòng ban</label>
                <select name="eDept" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                  {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chức vụ</label>
                <select name="eTitle" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                  {TITLES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input name="eEmail" type="email" placeholder="email@company.com" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Điện thoại</label>
                <input name="ePhone" type="tel" placeholder="09xx xxx xxx" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Manager trực tiếp</label>
                <input name="eManager" placeholder="Tên quản lý trực tiếp" className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
              </div>
            </div>

            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setActiveModal(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                <span className="material-symbols-outlined text-[18px]">save</span>Lưu nhân viên
              </button>
            </footer>
          </form>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-2xl">person_remove</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setConfirmDelete(null)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Hủy</button>
              <button onClick={handleConfirmDelete} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100">Xóa nhân viên</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ManagerEmployeeDirectory({employees}:{employees:Employee[]}){
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState<Employee|null>(null);
 const [editing,setEditing]=useState(false);
 const shown=employees.filter(e=>`${e.name} ${e.id} ${e.email}`.toLowerCase().includes(query.toLowerCase()));
 const dept=(e:Employee)=>e.id==='NV001'?'TT Phát triển PM':e.id==='NV002'?'Phòng Phân tích Nghiệp vụ':'Bộ phận Frontend';
 const phone=(e:Employee)=>e.id==='NV001'?'0912 345 678':e.id==='NV002'?'0987 654 321':'0903 112 233';
 return <div className="flex flex-col gap-6 p-6">
  <header className="flex items-center justify-between"><h1 className="page-title">Danh sách nhân viên</h1><button onClick={()=>window.alert('Đã xuất danh sách nhân viên')} className="btn-secondary"><span className="material-symbols-outlined text-[18px]">download</span>Xuất Excel</button></header>
  <div className="card grid grid-cols-[1.15fr_1.1fr_1.1fr_.75fr_auto] items-end gap-4 p-5">
   <label className="text-xs font-bold uppercase text-slate-600">Tìm kiếm nhân viên<div className="relative mt-2"><span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tên, mã nhân viên, email..." className="form-input pl-9"/></div></label>
   <label className="text-xs font-bold uppercase text-slate-600">Phòng ban / Đơn vị<select className="form-input mt-2"><option>Khối Công nghệ</option></select></label>
   <label className="text-xs font-bold uppercase text-slate-600">Chức vụ<select className="form-input mt-2"><option>Tất cả chức vụ</option></select></label>
   <label className="text-xs font-bold uppercase text-slate-600">Trạng thái<select className="form-input mt-2"><option>Đang làm việc</option></select></label>
   <button onClick={()=>setQuery('')} className="flex h-10 w-16 items-center justify-center rounded-lg border border-slate-200"><span className="material-symbols-outlined">refresh</span></button>
  </div>
  <div className="card overflow-hidden"><table className="w-full text-left"><thead><tr className="table-header">{['Mã NV','Họ tên','Phòng ban','Chức vụ','Liên hệ'].map(x=><th key={x} className="px-8 py-4">{x}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{shown.map(e=><tr key={e.id} onClick={()=>setSelected(e)} className="cursor-pointer hover:bg-blue-50/40"><td className="px-8 py-5 font-bold text-slate-700">{e.id}</td><td className="px-8 py-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">{e.name.split(' ').at(-1)?.[0]}</span><b>{e.name}</b></div></td><td className="px-8 py-5 text-slate-700">{dept(e)}</td><td className="px-8 py-5 text-slate-700">{e.title}</td><td className="px-8 py-5"><span className="block text-sm">{e.email}</span><span className="text-xs text-slate-400">{phone(e)}</span></td></tr>)}</tbody></table><footer className="flex items-center justify-between border-t bg-slate-50 px-6 py-4 text-xs text-slate-500"><span>Hiển thị 1-{shown.length} trên {shown.length} nhân viên</span><div><button className="h-8 w-8 text-slate-300">‹</button><button className="h-8 w-8 rounded bg-blue-600 text-white">1</button><button className="h-8 w-8 text-slate-300">›</button></div></footer></div>
  {selected&&!editing&&<div onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4"><section className="w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl"><header className="flex items-center gap-4 border-b px-6 py-5"><span className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">{selected.name.split(' ').at(-1)?.[0]}</span><div className="flex-1"><div className="flex items-center gap-3"><h2 className="text-xl font-bold">{selected.name}</h2><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">BOS_{selected.account}</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">● Đang hoạt động</span></div><p className="mt-1 text-sm text-slate-500">Phòng ban: {dept(selected)}</p></div><button onClick={()=>setSelected(null)} className="text-2xl text-slate-400">×</button></header><div className="space-y-5 p-6"><section className="rounded-xl border bg-slate-50 p-5"><h3 className="mb-4 font-bold text-slate-700">♙ Thông tin cá nhân</h3><div className="grid grid-cols-3 gap-5 text-sm"><InfoValue label="Họ và tên" value={selected.name}/><InfoValue label="Giới tính" value="Nam"/><InfoValue label="Ngày sinh" value="17/08/1986"/><InfoValue label="Email" value={selected.email}/><InfoValue label="Số điện thoại" value={phone(selected)}/><div className="col-span-3 border-t pt-4"><InfoValue label="Địa chỉ" value="SN78A ngõ 3 Xuân Phương, Nam Từ Liêm, HN"/></div></div></section><div className="grid grid-cols-2 gap-5"><section className="rounded-xl border bg-slate-50 p-5"><h3 className="mb-4 font-bold text-slate-700">▣ Thông tin CCCD</h3><div className="grid grid-cols-2 gap-4"><InfoValue label="Số CCCD" value="001186040007"/><InfoValue label="Ngày cấp" value="26/05/2026"/></div><div className="mt-4 flex items-center justify-between border-t pt-3"><span className="text-xs text-slate-500">▤　Ảnh thẻ CCCD</span><button onClick={()=>window.alert('Đang mở ảnh CCCD')} className="text-xs font-semibold text-blue-600">◉ Xem ảnh lớn</button></div></section><section className="rounded-xl border bg-slate-50 p-5"><div className="flex justify-between"><h3 className="font-bold text-slate-700">◉ Nhận diện khuôn mặt</h3><span className="text-xs text-blue-600">1 / 4 góc mặt</span></div><div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs"><span className="rounded border border-emerald-200 bg-emerald-50 p-3 text-emerald-600">Thẳng<br/>Đã có</span>{['Trái','Phải','Dưới'].map(x=><span key={x} className="rounded border p-3 text-slate-400">{x}<br/>Chưa có</span>)}</div><div className="mt-3 flex justify-end border-t pt-3"><button onClick={()=>window.alert('Đang mở ảnh khuôn mặt')} className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">▧ Xem ảnh khuôn mặt</button></div></section></div></div><footer className="flex justify-between border-t bg-slate-50 px-6 py-4"><button onClick={()=>setSelected(null)} className="btn-secondary">Đóng</button><button onClick={()=>setEditing(true)} className="btn-primary">✎ Chỉnh sửa thông tin</button></footer></section></div>}
  {selected&&editing&&<div onMouseDown={e=>{if(e.target===e.currentTarget)setEditing(false)}} className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/55 p-4"><form onSubmit={e=>{e.preventDefault();setEditing(false);window.alert('Đã lưu thay đổi')}} className="flex max-h-[92vh] w-full max-w-[1050px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><header className="flex shrink-0 items-center justify-between border-b px-6 py-5"><div><h2 className="text-lg font-bold">Chỉnh sửa thông tin nhân viên</h2><p className="text-xs text-slate-500">Cập nhật hồ sơ thông tin và phân quyền ra vào của nhân viên</p></div><button type="button" onClick={()=>setEditing(false)} className="text-2xl text-slate-400">×</button></header><div className="overflow-y-auto p-6"><section className="mb-6 grid grid-cols-3 gap-5 rounded-xl border bg-slate-50 p-5"><div><b className="text-sm">Ảnh đại diện <span className="text-rose-500">*</span></b><div className="mt-3 flex gap-3"><span className="flex h-24 w-20 items-center justify-center rounded-lg bg-blue-100 text-2xl font-bold text-blue-700">{selected.name.split(' ').at(-1)?.[0]}</span><button type="button" className="h-24 w-20 rounded-lg border-2 border-dashed text-xs text-slate-500">▧<br/>Upload</button></div></div><div><b className="text-sm">Ảnh CMND/CCCD <span className="text-rose-500">*</span></b><div className="mt-3 flex gap-3"><span className="flex h-24 w-32 flex-col items-center justify-center rounded-lg border bg-white text-xs text-slate-500">▤<br/>001186040007</span><button type="button" className="h-24 w-20 rounded-lg border-2 border-dashed text-xs text-slate-500">＋<br/>Upload</button></div></div><div><b className="text-sm">Ảnh khuôn mặt (thẳng, trái, phải, dưới)</b><div className="mt-3 flex h-24 items-center justify-between rounded-xl border bg-white px-5"><span><b>◉ Ảnh khuôn mặt (1)</b><small className="mt-1 block text-slate-400">Đã đăng ký 1/4 góc mặt</small></span><button type="button" className="font-semibold text-blue-600">Quản lý</button></div></div></section><div className="grid grid-cols-4 gap-4"><Field label="Họ và tên"><input defaultValue={selected.name}/></Field><Field label="Email"><input defaultValue={selected.email}/></Field><Field label="Số điện thoại"><input defaultValue={phone(selected)}/></Field><Field label="Số CCCD"><input defaultValue="001186040007"/></Field><Field label="Tên tài khoản valley"><input disabled defaultValue={`BOS_${selected.account}`}/></Field><Field label="Ngày sinh"><input type="date" defaultValue="1986-08-17"/></Field><Field label="Ngày cấp CCCD"><input type="date" defaultValue="2026-05-26"/></Field><Field label="Giới tính"><select defaultValue="Nam"><option>Nam</option><option>Nữ</option></select></Field><Field label="Địa chỉ" wide><input defaultValue="SN78A ngõ 3 Xuân Phương, Nam Từ Liêm, HN"/></Field><Field label="Trạng thái"><select><option>Đang hoạt động</option></select></Field><Field label="Cấp phép ra vào"><select><option>Cho phép ra vào</option></select></Field><Field label="Nhóm quyền"><select><option>chưa chọn</option></select></Field><Field label="Phòng ban"><select><option>{dept(selected)}</option></select></Field></div></div><footer className="flex shrink-0 justify-end gap-3 border-t bg-slate-50 px-6 py-4"><button type="button" onClick={()=>setEditing(false)} className="btn-secondary">Hủy bỏ</button><button className="btn-primary">▣ Lưu thay đổi</button></footer></form></div>}
 </div>;
}
