import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

type Meeting = {
  id: string; title: string; host: string; participants: string[]; room: string;
  date: string; start: string; end: string; status: 'Sắp diễn ra' | 'Đang diễn ra' | 'Đã kết thúc';
};

const INITIAL_MEETINGS: Meeting[] = [
  { id:'LH-01',title:'Đào tạo quy trình chấm công',host:'Lê Hoàng Dũng',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng đào tạo tầng 4',date:'21/10/2024',start:'10:00',end:'11:30',status:'Sắp diễn ra' },
  { id:'LH-02',title:'Họp tiến độ dự án ACS',host:'Nguyễn Bình Chương',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Lotus 01',date:'22/10/2024',start:'09:00',end:'10:00',status:'Sắp diễn ra' },
  { id:'LH-03',title:'Rà soát ngân sách tháng 10',host:'Nguyễn Văn An',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Orchid 02',date:'22/10/2024',start:'14:00',end:'15:30',status:'Sắp diễn ra' },
  { id:'LH-04',title:'Họp triển khai tính năng chấm công AI',host:'Trần Minh Quân',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Rose 03',date:'22/10/2024',start:'15:30',end:'16:30',status:'Sắp diễn ra' },
  { id:'LH-05',title:'Đánh giá hiệu suất quý III',host:'Hoàng Thùy Linh',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Lotus 02',date:'23/10/2024',start:'09:00',end:'11:00',status:'Sắp diễn ra' },
  { id:'LH-06',title:'Phỏng vấn ứng viên Frontend Dev',host:'Nguyễn Văn Hùng',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng phỏng vấn 1',date:'23/10/2024',start:'14:00',end:'15:00',status:'Sắp diễn ra' },
  { id:'LH-07',title:'Họp giao ban bộ phận Kỹ thuật',host:'Phạm Minh Tuấn',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Orchid 01',date:'21/10/2024',start:'08:30',end:'09:30',status:'Đã kết thúc' },
  { id:'LH-08',title:'Tổng kết Sprint 14 & Planning Sprint 15',host:'Lê Hoàng Dũng',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Online - Google Meet',date:'20/10/2024',start:'16:00',end:'17:30',status:'Đã kết thúc' },
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="form-label">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
      {children}
    </label>
  );
}

function GuestBooking() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(false);
  const [done, setDone] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registered, setRegistered] = useState(false);

  if (!booking) return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900 px-6 py-8 text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3 font-bold">
            <span className="material-symbols-outlined rounded-xl bg-white/20 p-2 backdrop-blur-sm">calendar_month</span>
            ACS Meeting
          </div>
          <button onClick={() => navigate('/login')} className="rounded-lg border border-white/30 px-4 py-2 text-sm font-semibold transition hover:bg-white/10">Đăng nhập</button>
        </nav>
        <section className="mx-auto grid max-w-6xl items-center gap-12 py-24 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[.2em] text-blue-200">Cổng đăng ký dành cho khách</p>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Đăng ký lịch họp dễ dàng hơn</h1>
            <p className="mt-5 max-w-xl text-lg text-blue-100/90">Đặt lịch gặp cán bộ nhanh chóng, chọn phòng họp phù hợp và nhận xác nhận ngay sau khi gửi yêu cầu.</p>
            {registered && <p className="mt-5 rounded-xl border border-emerald-300/40 bg-emerald-400/15 p-3 text-sm font-semibold text-emerald-100">Đăng ký tài khoản thành công. Bạn có thể đăng nhập để tiếp tục.</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setBooking(true)} className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">Đặt lịch họp ngay</button>
              <button onClick={() => setRegisterOpen(true)} className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold transition hover:bg-white/10">Đăng ký tài khoản</button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-bold">Quy trình đặt lịch</h2>
            <div className="mt-6 space-y-6">
              {[
                ['1', 'Điền thông tin', 'Cung cấp mục đích, thời gian và thông tin liên hệ.'],
                ['2', 'Chọn cán bộ chủ trì', 'Tìm đúng người phụ trách cuộc họp.'],
                ['3', 'Nhận xác nhận', 'Theo dõi kết quả qua email và số điện thoại.']
              ].map(x => (
                <div key={x[0]} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-blue-700 shadow-sm">{x[0]}</span>
                  <div>
                    <p className="font-semibold text-white">{x[1]}</p>
                    <p className="mt-1 text-sm text-blue-100/80">{x[2]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {registerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) setRegisterOpen(false) }}>
          <form onSubmit={e => { e.preventDefault(); setRegistered(true); setRegisterOpen(false) }} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white text-slate-800 shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Đăng ký tài khoản</h2>
                <p className="mt-0.5 text-xs text-slate-500">Tạo tài khoản để theo dõi lịch hẹn của bạn</p>
              </div>
              <button type="button" onClick={() => setRegisterOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Họ và tên" required><input required autoComplete="name" className="form-input" placeholder="Nhập họ tên đầy đủ" /></Field>
              </div>
              <Field label="Email" required><input required type="email" autoComplete="email" className="form-input" placeholder="email@example.com" /></Field>
              <Field label="Số điện thoại" required><input required type="tel" autoComplete="tel" className="form-input" placeholder="09xxxxxxxx" /></Field>
              <Field label="Mật khẩu" required><input required type="password" minLength={6} autoComplete="new-password" className="form-input" placeholder="Tối thiểu 6 ký tự" /></Field>
              <Field label="Xác nhận mật khẩu" required><input required type="password" minLength={6} autoComplete="new-password" className="form-input" placeholder="Nhập lại mật khẩu" /></Field>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setRegisterOpen(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">Tạo tài khoản</button>
            </footer>
          </form>
        </div>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <button onClick={() => setBooking(false)} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>Quay lại
          </button>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="material-symbols-outlined flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-[18px] text-white">event_available</span>
            ACS Meeting
          </div>
          <button onClick={() => navigate('/login')} className="btn-secondary text-blue-600 border-blue-200 bg-blue-50">Đăng nhập</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:py-12">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="badge-blue uppercase tracking-wider">DÀNH CHO KHÁCH</span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Đặt lịch họp với ACS</h1>
            <p className="mt-2 max-w-2xl text-slate-500">Điền thông tin bên dưới, chúng tôi sẽ xác nhận lịch hẹn qua email hoặc số điện thoại của bạn.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">1</span> Thông tin lịch hẹn
            <span className="h-px w-8 bg-slate-300" />
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white">2</span> Xác nhận
          </div>
        </div>

        {done && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-slide-up">
            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
            <div>
              <b className="font-bold">Đã gửi yêu cầu thành công</b>
              <p className="mt-1 text-sm text-emerald-700">Mã đăng ký <b>LH-KH-1026</b> đã được gửi đến email của bạn.</p>
            </div>
          </div>
        )}

        <form onSubmit={e => { e.preventDefault(); setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="card p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <span className="material-symbols-outlined text-[20px]">notes</span>
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Nội dung cuộc họp</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Cho cán bộ biết bạn muốn trao đổi vấn đề gì</p>
                </div>
              </div>
              <Field label="Mục đích cuộc họp" required><textarea required rows={4} className="form-input resize-none" placeholder="Ví dụ: Trao đổi hồ sơ hợp tác và kế hoạch triển khai..." /></Field>
            </section>

            <section className="card p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Thời gian và địa điểm</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Chọn khung giờ và phòng họp phù hợp</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Thời gian bắt đầu" required><input required type="datetime-local" className="form-input" /></Field>
                <Field label="Thời gian kết thúc" required><input required type="datetime-local" className="form-input" /></Field>
                <div className="sm:col-span-2">
                  <Field label="Địa điểm diễn ra" required>
                    <select required className="form-input" defaultValue="">
                      <option value="" disabled>Chọn phòng họp hoặc khu vực tiếp khách</option>
                      <option>Phòng họp Lotus 01</option>
                      <option>Phòng họp Orchid 02</option>
                      <option>Phòng tiếp khách tầng 1</option>
                    </select>
                  </Field>
                </div>
              </div>
            </section>

            <section className="card p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Người chủ trì</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Chọn cán bộ bạn cần gặp</p>
                </div>
              </div>
              <Field label="Cán bộ chủ trì" required>
                <select required className="form-input" defaultValue="">
                  <option value="" disabled>Chọn cán bộ chủ trì</option>
                  <option>Nguyễn Văn An — Ban Giám đốc</option>
                  <option>Lê Hoàng Dũng — Phòng IT</option>
                  <option>Phạm Thu Hà — Phòng Hành chính</option>
                </select>
              </Field>
            </section>

            <section className="card p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Thông tin liên hệ</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Thông tin dùng để gửi xác nhận lịch hẹn</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Họ và tên" required><input required autoComplete="name" className="form-input" placeholder="Nhập họ tên đầy đủ" /></Field>
                <Field label="CCCD/CMND" required><input required inputMode="numeric" className="form-input" placeholder="Nhập số giấy tờ" /></Field>
                <Field label="Email" required><input required type="email" autoComplete="email" className="form-input" placeholder="email@example.com" /></Field>
                <Field label="Số điện thoại" required><input required type="tel" autoComplete="tel" className="form-input" placeholder="09xxxxxxxx" /></Field>
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24">
            <div className="overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
              <span className="material-symbols-outlined text-[32px] text-blue-400">verified_user</span>
              <h2 className="mt-4 text-lg font-bold">Yêu cầu của bạn được bảo mật</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">Thông tin cá nhân chỉ được dùng để xác minh khách, gửi thông báo và hỗ trợ kiểm soát ra vào.</p>
              <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-sm">
                {['Phản hồi qua email hoặc điện thoại', 'Có thể thay đổi lịch sau khi xác nhận', 'Không chia sẻ thông tin cho bên thứ ba'].map(x => (
                  <p key={x} className="flex gap-2.5 items-center">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                    <span className="text-slate-300">{x}</span>
                  </p>
                ))}
              </div>
            </div>
            
            <div className="card p-5 text-center">
              <p className="text-sm font-bold text-slate-900">Cần hỗ trợ?</p>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">Liên hệ lễ tân ACS trong giờ hành chính.</p>
              <p className="mt-3 text-sm font-bold text-blue-600">028 7300 6868</p>
            </div>
            
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-button transition hover:bg-blue-700 active:bg-blue-800">
              <span className="material-symbols-outlined text-[18px]">send</span>
              Gửi yêu cầu đặt lịch
            </button>
            <p className="text-center text-xs leading-relaxed text-slate-400 px-4">
              Bằng việc gửi yêu cầu, bạn đồng ý cho ACS sử dụng thông tin để xử lý lịch hẹn.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}

function AdminMeetings() {
  const [rows, setRows] = useState(INITIAL_MEETINGS);
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('2024-10-22');
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  
  const shown = rows.filter(x => `${x.title} ${x.host} ${x.room}`.toLowerCase().includes(query.toLowerCase()));
  
  const openEdit = (m: Meeting | null) => { setEditing(m); setFormOpen(true) };
  
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const item: Meeting = {
      id: editing?.id || `LH-${Date.now().toString().slice(-4)}`,
      title: String(f.get('title')),
      host: String(f.get('host')),
      participants: editing?.participants || ['Lê Hoàng Dũng', 'Trần Thị Mai'],
      room: String(f.get('room')),
      date: String(f.get('date')),
      start: String(f.get('start')),
      end: String(f.get('end')),
      status: editing?.status || 'Sắp diễn ra'
    };
    setRows(v => editing ? v.map(x => x.id === editing.id ? item : x) : [item, ...v]);
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Quản lý lịch họp</h1>
          <p className="mt-1 text-sm text-slate-500">Toàn quyền quản lý lịch họp trong hệ thống</p>
        </div>
        <button onClick={() => openEdit(null)} className="btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Tạo lịch họp
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          [shown.length, 'Lịch họp hiển thị', 'calendar_month', 'blue'],
          [shown.filter(x => x.status === 'Sắp diễn ra').length, 'Sắp diễn ra', 'schedule', 'amber'],
          [shown.filter(x => x.status === 'Đang diễn ra').length, 'Đang diễn ra', 'play_circle', 'emerald']
        ].map(x => (
          <div key={String(x[1])} className={`stat-card border-l-4 ${x[3] === 'blue' ? 'border-l-blue-500' : x[3] === 'amber' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">{x[0]}</p>
                <p className="mt-0.5 text-xs text-slate-500">{x[1]}</p>
              </div>
              <span className={`material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-xl ${x[3] === 'blue' ? 'bg-blue-50 text-blue-600' : x[3] === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {x[2]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="card flex flex-col overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900">Danh sách lịch họp</h2>
          <div className="flex flex-wrap gap-3">
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input w-auto" />
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
              <input value={query} onChange={e => setQuery(e.target.value)} className="form-input w-72 pl-9" placeholder="Tìm cuộc họp, chủ trì, phòng..." />
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Cuộc họp</th>
                <th className="px-5 py-3">Chủ trì</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3">Địa điểm</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map(m => (
                <tr key={m.id} className="text-sm transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{m.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{m.id} · {m.participants.length} người tham gia</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">{m.host}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{m.date}</p>
                    <p className="text-xs text-slate-500">{m.start}–{m.end}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{m.room}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${m.status === 'Đang diễn ra' ? 'badge-green' : m.status === 'Sắp diễn ra' ? 'badge-blue' : 'badge-slate'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => openEdit(m)} className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50" title="Sửa">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => setRows(v => v.filter(x => x.id !== m.id))} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" title="Xóa">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Không tìm thấy cuộc họp nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) setFormOpen(false) }}>
          <form onSubmit={submit} className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">{editing ? 'Chỉnh sửa lịch họp' : 'Tạo lịch họp'}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="grid grid-cols-2 gap-4 p-6">
              <div className="col-span-2">
                <Field label="Tên cuộc họp" required>
                  <input name="title" required defaultValue={editing?.title} className="form-input mt-1.5" />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Chủ trì" required>
                  <select name="host" defaultValue={editing?.host || 'Nguyễn Văn An'} className="form-input mt-1.5">
                    <option>Nguyễn Văn An</option>
                    <option>Lê Hoàng Dũng</option>
                  </select>
                </Field>
              </div>
              <Field label="Ngày họp" required>
                <input name="date" required defaultValue={editing?.date || '22/10/2024'} className="form-input mt-1.5" />
              </Field>
              <Field label="Địa điểm" required>
                <select name="room" defaultValue={editing?.room || 'Phòng họp Lotus 01'} className="form-input mt-1.5">
                  <option>Phòng họp Lotus 01</option>
                  <option>Phòng họp Orchid 02</option>
                  <option>Phòng đào tạo tầng 4</option>
                </select>
              </Field>
              <Field label="Bắt đầu" required>
                <input name="start" type="time" required defaultValue={editing?.start || '09:00'} className="form-input mt-1.5" />
              </Field>
              <Field label="Kết thúc" required>
                <input name="end" type="time" required defaultValue={editing?.end || '10:00'} className="form-input mt-1.5" />
              </Field>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">{editing ? 'Lưu thay đổi' : 'Tạo lịch họp'}</button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}

function EmployeeMeetings() {
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<'Tất cả' | 'Chưa diễn ra' | 'Đã kết thúc'>('Tất cả');
  const [detail, setDetail] = useState<Meeting | null>(null);
  
  useEffect(() => {
    const id = params.get('meeting');
    if (id) {
      const meeting = INITIAL_MEETINGS.find(x => x.id === id);
      if (meeting) setDetail(meeting);
    }
  }, [params]);
  
  const closeDetail = () => {
    setDetail(null);
    if (params.has('meeting')) {
      params.delete('meeting');
      setParams(params, { replace: true });
    }
  };
  
  const rows = INITIAL_MEETINGS.filter(m => tab === 'Tất cả' || (tab === 'Chưa diễn ra' ? m.status !== 'Đã kết thúc' : m.status === 'Đã kết thúc'));

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#F8FAFC]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Danh sách lịch họp</h1>
        </div>
      </div>

      <section className="card flex flex-col overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
          <div className="flex rounded-lg bg-slate-100 p-1">
            {(['Tất cả', 'Chưa diễn ra', 'Đã kết thúc'] as const).map(x => (
              <button
                key={x}
                onClick={() => setTab(x)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${tab === x ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {x} ({x === 'Tất cả' ? 8 : x === 'Chưa diễn ra' ? 6 : 2})
              </button>
            ))}
          </div>
          <select className="form-input w-auto">
            <option>Hôm nay (22/10/2024)</option>
          </select>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="table-header">
                {['STT', 'Cuộc họp', 'Chủ trì', 'Thời gian', 'Địa điểm', 'Trạng thái'].map(x => <th key={x} className="px-5 py-3">{x}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((m, i) => (
                <tr key={m.id} onClick={() => setDetail(m)} className="cursor-pointer text-sm transition hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-500">{i + 1}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">{m.title}</td>
                  <td className="px-5 py-4 text-slate-700">{m.host}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{m.date}</p>
                    <p className="text-xs text-slate-500">{m.start}–{m.end}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{m.room}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${m.status === 'Đã kết thúc' ? 'badge-slate' : m.status === 'Sắp diễn ra' ? 'badge-blue' : 'badge-green'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Không có cuộc họp nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) closeDetail() }}>
          <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Chi tiết lịch họp</h2>
              <button onClick={closeDetail} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <p className="text-xs font-semibold text-slate-500">Tên cuộc họp</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{detail.title}</h2>
              
              <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Chủ trì</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.host}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phòng họp</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.room}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Ngày</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Thời gian</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.start} - {detail.end}</p>
                </div>
              </div>
              
              <div className="mt-5">
                <p className="text-sm font-bold text-slate-900">Nội dung cuộc họp</p>
                <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                  • Rà soát tiến độ triển khai các tính năng mới trong sprint 42.<br/>
                  • Đánh giá kết quả kiểm thử và thống nhất phương án xử lý các lỗi tồn đọng.<br/>
                  • Phân công nhiệm vụ chuẩn bị nghiệm thu giai đoạn 1.
                </div>
              </div>
              
              <div className="mt-5">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-slate-900">Biên bản cuộc họp</p>
                  <span className="text-xs text-slate-400">Cập nhật 22/10/2024</span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined rounded-lg bg-blue-50 p-2 text-[20px] text-blue-600">description</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Biên bản cuộc họp tiến độ dự án ACS_221</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">245 KB • Cập nhật bởi Thư ký</p>
                    </div>
                  </div>
                  <button onClick={() => window.alert('Đang mở biên bản cuộc họp')} className="btn-secondary text-blue-600 hover:text-blue-700 py-1.5 px-3">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Xem
                  </button>
                </div>
              </div>
              
              <div className="mt-5">
                <p className="text-sm font-bold text-slate-900">Người tham gia ({detail.participants.length})</p>
                <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
                  {detail.participants.map((p, i) => (
                    <div key={p} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{p}</p>
                        <p className="text-xs text-slate-500">0{3+i}2 545 1548</p>
                      </div>
                      <span className={`badge ${i === 0 ? 'badge-amber' : i === 2 ? 'badge-purple' : 'badge-slate'}`}>
                        {i === 0 ? 'Thư ký' : i === 2 ? 'Giám đốc' : 'Nhân viên'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <footer className="flex justify-end border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={closeDetail} className="btn-secondary">Đóng</button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default function LichHop() {
  const { role } = useRole();
  const [params, setParams] = useSearchParams();
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState<Meeting | null>(null);

  useEffect(() => {
    if (role !== 'MANAGER') return;
    const id = params.get('meeting');
    if (id) {
      const meeting = meetings.find(x => x.id === id);
      if (meeting) setDetail(meeting);
    }
  }, [params, meetings, role]);

  const closeManagerDetail = () => {
    setDetail(null);
    if (params.has('meeting')) {
      const next = new URLSearchParams(params);
      next.delete('meeting');
      setParams(next, { replace: true });
    }
  };
  
  const visible = useMemo(() => meetings
    .filter(m => role === 'MANAGER' ? m.host === 'Lê Hoàng Dũng' : m.participants.includes('Trần Thị Mai'))
    .filter(m => `${m.title} ${m.host} ${m.room}`.toLowerCase().includes(query.toLowerCase())), 
  [meetings, query, role]);
  
  if (role === 'GUEST') return <GuestBooking />;
  if (role === 'ADMIN') return <AdminMeetings />;
  if (role === 'EMPLOYEE') return <EmployeeMeetings />;
  
  const canManage = role === 'MANAGER';
  const remove = (id: string) => setMeetings(x => x.filter(m => m.id !== id));

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Quản lý lịch họp</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý các cuộc họp do bạn chủ trì</p>
        </div>
        {canManage && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo lịch họp
          </button>
        )}
      </div>
      
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="stat-card border-l-4 border-l-slate-400">
          <div>
            <p className="text-2xl font-bold text-slate-900">{visible.length}</p>
            <p className="mt-0.5 text-xs text-slate-500">Lịch họp hiển thị</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-slate-100 p-2.5 text-xl text-slate-600">calendar_month</span>
        </div>
        <div className="stat-card border-l-4 border-l-blue-500">
          <div>
            <p className="text-2xl font-bold text-slate-900">{visible.filter(x => x.status === 'Sắp diễn ra').length}</p>
            <p className="mt-0.5 text-xs text-slate-500">Sắp diễn ra</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-blue-50 p-2.5 text-xl text-blue-600">schedule</span>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <div>
            <p className="text-2xl font-bold text-slate-900">{visible.filter(x => x.status === 'Đang diễn ra').length}</p>
            <p className="mt-0.5 text-xs text-slate-500">Đang diễn ra</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-emerald-50 p-2.5 text-xl text-emerald-600">play_circle</span>
        </div>
      </div>
      
      <div className="card flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <h2 className="text-base font-bold text-slate-900">Danh sách lịch họp</h2>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
            <input value={query} onChange={e => setQuery(e.target.value)} className="form-input w-full sm:w-72 pl-9" placeholder="Tìm cuộc họp, chủ trì, phòng..." />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">Cuộc họp</th>
                <th className="px-5 py-3">Chủ trì</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3">Địa điểm</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map(m => (
                <tr key={m.id} onClick={() => setDetail(m)} className="cursor-pointer text-sm transition hover:bg-blue-50/40">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{m.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{m.id} · {m.participants.length} người tham gia</p>
                  </td>
                  <td className="px-5 py-4 text-slate-700">{m.host}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{m.date}</p>
                    <p className="text-xs text-slate-500">{m.start}–{m.end}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{m.room}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${m.status === 'Đang diễn ra' ? 'badge-green' : m.status === 'Sắp diễn ra' ? 'badge-blue' : 'badge-slate'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {canManage ? (
                      <div className="inline-flex gap-1">
                        <button onClick={e => { e.stopPropagation(); setDetail(m) }} className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50" title="Xem chi tiết">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={e => { e.stopPropagation(); remove(m.id) }} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50" title="Xóa">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDetail(m)} className="btn-secondary text-blue-600 py-1.5 px-3">
                        Xem chi tiết
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-500">Không có lịch họp phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Meeting detail modal — same structure as employee */}
      {detail && role === 'MANAGER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) closeManagerDetail() }}>
          <section className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in">
            <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined rounded-xl bg-blue-50 p-2 text-blue-600">event</span><h2 className="text-base font-bold text-slate-900">Chi tiết lịch họp</h2><span className={`badge ${detail.status === 'Đang diễn ra' ? 'badge-green' : detail.status === 'Sắp diễn ra' ? 'badge-blue' : 'badge-slate'}`}>{detail.status}</span></div>
              <button onClick={closeManagerDetail} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-bold text-slate-900">{detail.title}</h3>
              <p className="mt-1 text-xs text-slate-500">Tổ chức bởi <b>{detail.host}</b></p>
              <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div><p className="text-xs text-slate-500">Thời gian diễn ra</p><p className="mt-1 font-semibold">{detail.date}</p><p className="text-xs text-slate-500">{detail.start} - {detail.end}</p></div>
                <div><p className="text-xs text-slate-500">Hình thức & Địa điểm</p><p className="mt-1 font-semibold">{detail.room}</p></div>
              </div>
              <div className="mt-5"><p className="text-sm font-bold">Nội dung cuộc họp</p><div className="mt-2 rounded-xl border bg-slate-50 p-4 text-sm leading-6 text-slate-600">Rà soát tiến độ công việc, thống nhất phương án xử lý các nội dung tồn đọng và phân công nhiệm vụ tiếp theo.</div></div>
              <div className="mt-5"><p className="mb-2 text-sm font-bold">Người tham gia ({detail.participants.length})</p><div className="divide-y overflow-hidden rounded-xl border">{detail.participants.map((p,i)=><div key={p} className="flex items-center justify-between px-4 py-3"><span className="text-sm font-semibold">{p}</span><span className="badge badge-slate">{i===0?'Thư ký':'Nhân viên'}</span></div>)}</div></div>
            </div>
            <footer className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button onClick={() => { remove(detail.id); closeManagerDetail() }} className="btn-danger">
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                Hủy lịch họp
              </button>
              <div className="flex gap-3"><button onClick={closeManagerDetail} className="btn-secondary">Đóng</button><button onClick={() => { closeManagerDetail(); setShowForm(true) }} className="btn-primary">
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Chỉnh sửa
              </button></div>
            </footer>
          </section>
        </div>
      )}
      
      {/* Form Modal for Manager */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <form onSubmit={e => { 
            e.preventDefault(); 
            const f = new FormData(e.currentTarget); 
            setMeetings([{ 
              id: `LH-${Date.now().toString().slice(-4)}`, 
              title: String(f.get('title')), 
              host: role === 'MANAGER' ? 'Lê Hoàng Dũng' : String(f.get('host')), 
              participants: ['Trần Thị Mai'], 
              room: String(f.get('room')), 
              date: String(f.get('date')), 
              start: String(f.get('start')), 
              end: String(f.get('end')), 
              status: 'Sắp diễn ra' 
            }, ...meetings]); 
            setShowForm(false) 
          }} className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Tạo lịch họp</h2>
              <button type="button" onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Tên cuộc họp" required><input name="title" required className="form-input mt-1.5" /></Field>
              </div>
              <Field label="Ngày họp" required><input name="date" required placeholder="dd/mm/yyyy" className="form-input mt-1.5" /></Field>
              <Field label="Phòng họp" required>
                <select name="room" className="form-input mt-1.5">
                  <option>Phòng họp Lotus 01</option>
                  <option>Phòng họp Orchid 02</option>
                </select>
              </Field>
              <Field label="Bắt đầu" required><input name="start" type="time" required className="form-input mt-1.5" /></Field>
              <Field label="Kết thúc" required><input name="end" type="time" required className="form-input mt-1.5" /></Field>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[16px]">save</span>
                Lưu lịch họp
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}
