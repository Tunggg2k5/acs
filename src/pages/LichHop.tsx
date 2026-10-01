import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

type Meeting = {
  id: string; title: string; host: string; participants: string[]; room: string;
  date: string; start: string; end: string; status: 'Chờ xác nhận' | 'Chưa diễn ra' | 'Đã diễn ra' | 'Đã hủy' | 'Đã từ chối';
};

const MEETING_STAFF = [
  {name:'Lê Hoàng Dũng',email:'dung.le@acs.vn',dept:'Trưởng phòng IT',initials:'LD',color:'bg-blue-600'},
  {name:'Trần Thị Mai',email:'mai.tran@acs.vn',dept:'Phó phòng IT',initials:'TM',color:'bg-violet-500'},
  {name:'Nguyễn Văn Hùng',email:'hung.nguyen@acs.vn',dept:'Kỹ sư phần mềm IT',initials:'NH',color:'bg-emerald-500'},
  {name:'Đỗ Quốc Bảo',email:'bao.do@acs.vn',dept:'Frontend Developer - IT',initials:'QB',color:'bg-blue-500'},
  {name:'Bùi Thanh Tùng',email:'tung.bui@acs.vn',dept:'DevOps Engineer - IT',initials:'TT',color:'bg-amber-500'},
  {name:'Lê Thị Hoa',email:'hoa.le@acs.vn',dept:'Chuyên viên QA - IT',initials:'TH',color:'bg-rose-500'},
  {name:'Hoàng Thùy Linh',email:'linh.hoang@acs.vn',dept:'Trưởng phòng Nhân sự - HR',initials:'TL',color:'bg-indigo-500'},
];

const INITIAL_MEETINGS: Meeting[] = [
  { id:'LH-01',title:'Đào tạo quy trình chấm công',host:'Lê Hoàng Dũng',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng đào tạo tầng 4',date:'21/10/2024',start:'10:00',end:'11:30',status:'Chưa diễn ra' },
  { id:'LH-02',title:'Họp tiến độ dự án ACS',host:'Nguyễn Bình Chương',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Lotus 01',date:'22/10/2024',start:'09:00',end:'10:00',status:'Chưa diễn ra' },
  { id:'LH-03',title:'Rà soát ngân sách tháng 10',host:'Nguyễn Văn An',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Orchid 02',date:'22/10/2024',start:'14:00',end:'15:30',status:'Chưa diễn ra' },
  { id:'LH-04',title:'Họp triển khai tính năng chấm công AI',host:'Trần Minh Quân',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Rose 03',date:'22/10/2024',start:'15:30',end:'16:30',status:'Chưa diễn ra' },
  { id:'LH-05',title:'Đánh giá hiệu suất quý III',host:'Hoàng Thùy Linh',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Lotus 02',date:'23/10/2024',start:'09:00',end:'11:00',status:'Chưa diễn ra' },
  { id:'LH-06',title:'Phỏng vấn ứng viên Frontend Dev',host:'Nguyễn Văn Hùng',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng phỏng vấn 1',date:'23/10/2024',start:'14:00',end:'15:00',status:'Chưa diễn ra' },
  { id:'LH-07',title:'Họp giao ban bộ phận Kỹ thuật',host:'Phạm Minh Tuấn',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Orchid 01',date:'21/10/2024',start:'08:30',end:'09:30',status:'Đã diễn ra' },
  { id:'LH-08',title:'Tổng kết Sprint 14 & Planning Sprint 15',host:'Lê Hoàng Dũng',participants:['Trần Thị Mai','Nguyễn Văn Hùng','Phạm Minh Tuấn'],room:'Phòng họp Polaris (Tầng 4)',date:'20/10/2024',start:'16:00',end:'17:30',status:'Đã hủy' },
];

const GUEST_MEETINGS_KEY = 'acs_guest_meetings';
const loadGuestMeetings = (): Meeting[] => {
  try { return JSON.parse(localStorage.getItem(GUEST_MEETINGS_KEY) || '[]') as Meeting[] } catch { return [] }
};
const saveGuestMeeting = (meeting: Meeting) => {
  localStorage.setItem(GUEST_MEETINGS_KEY, JSON.stringify([meeting, ...loadGuestMeetings()]));
};

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

      <div className="mx-auto max-w-7xl px-5 py-8 lg:py-10">
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

        <form onSubmit={e => { e.preventDefault(); const f=new FormData(e.currentTarget); const start=String(f.get('start')); const end=String(f.get('end')); const host=String(f.get('host')).split(' — ')[0]; saveGuestMeeting({id:`LH-KH-${Date.now().toString().slice(-4)}`,title:String(f.get('purpose')),host,participants:[String(f.get('guestName'))],room:String(f.get('room')),date:start.slice(0,10).split('-').reverse().join('/'),start:start.slice(11),end:end.slice(11),status:'Chờ xác nhận'}); setDone(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="grid items-start gap-8 xl:grid-cols-[1fr_385px]">
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
              <Field label="Mục đích cuộc họp" required><textarea name="purpose" required rows={4} className="form-input resize-none" placeholder="Ví dụ: Trao đổi hồ sơ hợp tác và kế hoạch triển khai..." /></Field>
            </section>

            <section className="card p-5 md:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">Thời gian và địa điểm</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Chọn khung giờ và cơ sở văn phòng phù hợp</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Thời gian bắt đầu" required><input name="start" required type="datetime-local" className="form-input" /></Field>
                <Field label="Thời gian kết thúc" required><input name="end" required type="datetime-local" className="form-input" /></Field>
                <div className="sm:col-span-2">
                  <Field label="Địa điểm diễn ra" required>
                    <div className="grid grid-cols-[1fr_160px] gap-3">
                      <select name="room" required className="form-input" defaultValue="Trụ sở chính ACS Hà Nội (Tòa nhà ACS, Cầu Giấy, Hà Nội)">
                        <option>Trụ sở chính ACS Hà Nội (Tòa nhà ACS, Cầu Giấy, Hà Nội)</option>
                        <option>Chi nhánh ACS Hồ Chí Minh</option>
                        <option>Văn phòng ACS Đà Nẵng</option>
                      </select>
                      <input name="guestCount" required min={1} type="number" className="form-input" placeholder="Số lượng khách" />
                    </div>
                  </Field>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500"><span className="material-symbols-outlined text-[14px]">schedule</span>Lễ tân tại cơ sở sẽ bố trí phòng họp phù hợp với số lượng khách dự kiến.</p>
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
                  <p className="mt-0.5 text-xs text-slate-500">Chọn cán bộ bạn cần gặp (Quản lý các phòng ban hoặc Admin/HR)</p>
                </div>
              </div>
              <Field label="Cán bộ chủ trì" required>
                <select name="host" required className="form-input" defaultValue="Trần Thị Mai — Chuyên viên Tuyển dụng & Quản trị Nhân sự">
                  <option>Trần Thị Mai — Chuyên viên Tuyển dụng & Quản trị Nhân sự</option>
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
                  <p className="mt-0.5 text-xs text-slate-500">Thông tin dùng để gửi xác nhận lịch hẹn và chuẩn bị đón tiếp</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Họ và tên" required><input name="guestName" required autoComplete="name" className="form-input" placeholder="Nhập họ tên đầy đủ" /></Field>
                <Field label="Công ty (Không bắt buộc)"><input name="company" className="form-input" placeholder="Tên công ty hoặc tổ chức công tác" /></Field>
                <Field label="Email khách" required><input name="email" required type="email" autoComplete="email" className="form-input" placeholder="email@example.com" /></Field>
                <Field label="Số điện thoại" required><input name="phone" required type="tel" autoComplete="tel" className="form-input" placeholder="09xxxxxxxx" /></Field>
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
          </aside>
        </form>
      </div>
      <footer className="mt-8 border-t border-slate-200 bg-white px-5 py-6 text-xs text-slate-500"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><span>© 2026 ACS Meeting Management System. All rights reserved.</span><div className="flex gap-7"><a href="#">Điều khoản sử dụng</a><a href="#">Chính sách bảo mật</a><a href="#">Trung tâm trợ giúp</a></div></div></footer>
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
      status: editing?.status || 'Chưa diễn ra'
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
          [shown.filter(x => x.status === 'Chưa diễn ra').length, 'Chưa diễn ra', 'schedule', 'amber'],
          [shown.filter(x => x.status === 'Chờ xác nhận').length, 'Chờ xác nhận', 'hourglass_top', 'emerald']
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
                    <span className={`badge ${m.status === 'Chờ xác nhận' ? 'badge-amber' : m.status === 'Chưa diễn ra' ? 'badge-blue' : m.status === 'Đã từ chối' ? 'badge-red' : 'badge-slate'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">Không tìm thấy cuộc họp nào.</td>
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
  const [tab, setTab] = useState<'Tất cả' | Meeting['status']>('Tất cả');
  const [detail, setDetail] = useState<Meeting | null>(null);
  const [uploadedMinutes, setUploadedMinutes] = useState('');
  
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
  
  const rows = INITIAL_MEETINGS.filter(m => tab === 'Tất cả' || m.status === tab);

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
            {(['Tất cả', 'Chờ xác nhận', 'Chưa diễn ra', 'Đã diễn ra', 'Đã hủy', 'Đã từ chối'] as const).map(x => (
              <button
                key={x}
                onClick={() => setTab(x)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${tab === x ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {x} ({x === 'Tất cả' ? INITIAL_MEETINGS.length : INITIAL_MEETINGS.filter(m => m.status === x).length})
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
                    <span className={`badge ${m.status === 'Chờ xác nhận' ? 'badge-amber' : m.status === 'Chưa diễn ra' ? 'badge-blue' : m.status === 'Đã từ chối' ? 'badge-red' : 'badge-slate'}`}>
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
                  <p className="mt-1 text-xs text-slate-500">SĐT: {detail.host==='Lê Hoàng Dũng'?'0903 456 788':'0903 456 789'}</p>
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
                {detail.status === 'Đã diễn ra' && <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  {uploadedMinutes || 'Tải biên bản cuộc họp lên'}
                  <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={e => setUploadedMinutes(e.target.files?.[0]?.name || '')} />
                </label>}
                <p className="mt-1.5 text-[11px] text-slate-400">Thư ký chỉ được tải biên bản sau khi cuộc họp đã diễn ra.</p>
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
  const [meetings, setMeetings] = useState<Meeting[]>(() => [...loadGuestMeetings(), ...INITIAL_MEETINGS]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState<Meeting | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [meetingType, setMeetingType] = useState<'internal'|'guest'>('internal');
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);
  const [memberQuery, setMemberQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['Lê Hoàng Dũng','Trần Thị Mai']);
  const [memberRoles, setMemberRoles] = useState<Record<string,string>>({'Lê Hoàng Dũng':'Chủ trì','Trần Thị Mai':'Thư ký cuộc họp'});

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
    .filter(m => role === 'MANAGER' ? (m.host === 'Lê Hoàng Dũng' || m.id.startsWith('LH-KH-')) : m.participants.includes('Trần Thị Mai'))
    .filter(m => `${m.title} ${m.host} ${m.room}`.toLowerCase().includes(query.toLowerCase())), 
  [meetings, query, role]);
  
  if (role === 'GUEST') return <GuestBooking />;
  if (role === 'ADMIN') return <AdminMeetings />;
  if (role === 'EMPLOYEE' || role === 'HR') return <EmployeeMeetings />;
  
  const canManage = role === 'MANAGER';
  const updateMeetingStatus = (id: string, status: Meeting['status']) => setMeetings(current => {
    const next = current.map(m => m.id === id ? {...m, status} : m);
    localStorage.setItem(GUEST_MEETINGS_KEY, JSON.stringify(next.filter(m => m.id.startsWith('LH-KH-'))));
    return next;
  });
  const cancelMeeting = (id: string) => updateMeetingStatus(id, 'Đã hủy');
  const rejectMeeting = (id: string) => updateMeetingStatus(id, 'Đã từ chối');
  const confirmMeeting = (id: string) => updateMeetingStatus(id, 'Chưa diễn ra');

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Quản lý lịch họp</h1>
          <p className="mt-1 text-sm text-slate-500">Quản lý các cuộc họp do bạn chủ trì</p>
        </div>
        {canManage && (
          <button onClick={() => { setEditingMeeting(null); setShowForm(true) }} className="btn-primary">
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
            <p className="text-2xl font-bold text-slate-900">{visible.filter(x => x.status === 'Chưa diễn ra').length}</p>
            <p className="mt-0.5 text-xs text-slate-500">Chưa diễn ra</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-blue-50 p-2.5 text-xl text-blue-600">schedule</span>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <div>
            <p className="text-2xl font-bold text-slate-900">{visible.filter(x => x.status === 'Chờ xác nhận').length}</p>
            <p className="mt-0.5 text-xs text-slate-500">Chờ xác nhận</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-emerald-50 p-2.5 text-xl text-emerald-600">hourglass_top</span>
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
                    <span className={`badge ${m.status === 'Chờ xác nhận' ? 'badge-amber' : m.status === 'Chưa diễn ra' ? 'badge-blue' : m.status === 'Đã từ chối' ? 'badge-red' : 'badge-slate'}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-500">Không có lịch họp phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Meeting detail modal — same structure as employee */}
      {detail && role === 'MANAGER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) closeManagerDetail() }}>
          <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Chi tiết lịch họp</h2>
              <button onClick={closeManagerDetail} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
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
                  <p className="mt-1 text-xs text-slate-500">SĐT: {detail.host==='Lê Hoàng Dũng'?'0903 456 788':'0903 456 789'}</p>
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

              <div className="mt-5"><p className="text-sm font-bold text-slate-900">Nội dung cuộc họp</p><div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">• Rà soát tiến độ triển khai các tính năng mới trong sprint 42.<br/>• Đánh giá kết quả kiểm thử và thống nhất phương án xử lý các lỗi tồn đọng.<br/>• Phân công nhiệm vụ chuẩn bị nghiệm thu giai đoạn 1.</div></div>

              <div className="mt-5">
                <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-900">Biên bản cuộc họp</p><span className="text-xs text-slate-400">Cập nhật 22/10/2024</span></div>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 p-3"><div className="flex items-center gap-3"><span className="material-symbols-outlined rounded-lg bg-blue-50 p-2 text-[20px] text-blue-600">description</span><div><p className="text-sm font-semibold text-slate-900">Biên bản cuộc họp tiến độ dự án ACS_221</p><p className="mt-0.5 text-[11px] text-slate-500">245 KB • Cập nhật bởi Thư ký</p></div></div><button onClick={() => window.alert('Đang mở biên bản cuộc họp')} className="btn-secondary px-3 py-1.5 text-blue-600"><span className="material-symbols-outlined text-[16px]">visibility</span>Xem</button></div>
              </div>

              <div className="mt-5"><p className="text-sm font-bold text-slate-900">Người tham gia ({detail.participants.length})</p><div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">{detail.participants.map((p, i) => <div key={p} className="flex items-center justify-between px-4 py-3"><div><p className="text-sm font-semibold text-slate-900">{p}</p><p className="text-xs text-slate-500">0{3+i}2 545 1548</p></div><span className={`badge ${i === 0 ? 'badge-amber' : i === 2 ? 'badge-purple' : 'badge-slate'}`}>{i === 0 ? 'Thư ký' : i === 2 ? 'Giám đốc' : 'Nhân viên'}</span></div>)}</div></div>
            </div>
            <footer className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              {detail.status === 'Chờ xác nhận' && <>
                <button onClick={() => { rejectMeeting(detail.id); closeManagerDetail() }} className="btn-danger text-xs">
                  <span className="material-symbols-outlined text-[16px]">close</span>Từ chối
                </button>
                <button onClick={() => { confirmMeeting(detail.id); closeManagerDetail() }} className="btn-primary text-xs">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>Chấp nhận
                </button>
              </>}
              {detail.status === 'Chưa diễn ra' && <>
                <button onClick={() => { cancelMeeting(detail.id); closeManagerDetail() }} className="btn-danger text-xs">
                  <span className="material-symbols-outlined text-[16px]">event_busy</span>Hủy lịch họp
                </button>
                <button onClick={() => { setEditingMeeting(detail); closeManagerDetail(); setShowForm(true) }} className="btn-secondary text-xs">
                  <span className="material-symbols-outlined text-[16px]">edit_calendar</span>Chỉnh sửa
                </button>
              </>}
              {(detail.status === 'Đã diễn ra' || detail.status === 'Đã hủy' || detail.status === 'Đã từ chối') && <button onClick={closeManagerDetail} className="btn-secondary text-xs">Đóng</button>}
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
            const nextMeeting: Meeting = { 
              id: editingMeeting?.id || `LH-${Date.now().toString().slice(-4)}`, 
              title: String(f.get('title')), 
              host: role === 'MANAGER' ? 'Lê Hoàng Dũng' : String(f.get('host')), 
              participants: selectedMembers.filter(x => x !== 'Lê Hoàng Dũng'),
              room: String(f.get('room')), 
              date: String(f.get('date')), 
              start: String(f.get('start')), 
              end: String(f.get('end')), 
              status: editingMeeting?.status || 'Chưa diễn ra'
            };
            setMeetings(editingMeeting ? meetings.map(m => m.id === editingMeeting.id ? nextMeeting : m) : [nextMeeting, ...meetings]);
            setShowForm(false); setEditingMeeting(null)
          }} className="flex max-h-[94vh] w-full max-w-[670px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3"><span className="material-symbols-outlined rounded-xl border border-blue-100 bg-blue-50 p-2 text-[20px] text-blue-600">event</span><h2 className="text-lg font-bold text-slate-900">{editingMeeting ? 'Chỉnh sửa lịch họp' : 'Tạo lịch họp'}</h2></div>
              <button type="button" onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="grid flex-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Tên cuộc họp" required><input name="title" required defaultValue={editingMeeting?.title} className="form-input mt-1.5" /></Field>
              </div>
              <div className="sm:col-span-2">
                <p className="form-label">Thể loại họp <span className="text-red-500">*</span></p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setMeetingType('internal')} className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left ${meetingType==='internal'?'border-blue-600 bg-blue-50':'border-slate-200'}`}><span className={`material-symbols-outlined rounded-lg p-2 ${meetingType==='internal'?'bg-blue-600 text-white':'bg-slate-100 text-slate-500'}`}>groups</span><span><b className="block text-sm text-slate-800">Nội bộ công ty</b><small className="text-slate-400">Chỉ nhân viên nội bộ</small></span></button>
                  <button type="button" onClick={() => setMeetingType('guest')} className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left ${meetingType==='guest'?'border-blue-600 bg-blue-50':'border-slate-200'}`}><span className={`material-symbols-outlined rounded-lg p-2 ${meetingType==='guest'?'bg-blue-600 text-white':'bg-slate-100 text-slate-500'}`}>handshake</span><span><b className="block text-sm text-slate-800">Có khách mời</b><small className="text-slate-400">Đối tác / Khách ngoài</small></span></button>
                </div>
              </div>
              {meetingType==='guest' && <div className="sm:col-span-2 rounded-xl border border-blue-200 bg-blue-50/60 p-3"><div className="mb-2 flex items-center justify-between"><b className="text-xs uppercase text-blue-800">Danh sách khách / Đối tác <span className="text-red-500">*</span></b><span className="text-xs text-blue-600">1 người đã thêm</span></div><div className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-blue-600">business_center</span><input name="guest" required defaultValue="Ông Trần Đình Trọng - Giám đốc Công nghệ Công ty FPT Software" className="form-input bg-white" /></div></div>}
              <Field label="Ngày họp" required><input name="date" type="date" required defaultValue={editingMeeting ? editingMeeting.date.split('/').reverse().join('-') : '2024-10-24'} className="form-input mt-1.5" /></Field>
              <Field label="Phòng họp" required>
                <select name="room" defaultValue={editingMeeting?.room} className="form-input mt-1.5">
                  <option>Phòng họp Lotus 01 (Tầng 2 - 12 chỗ)</option>
                  <option>Phòng họp Orchid 02 (Tầng 3 - 8 chỗ)</option>
                  <option>Phòng họp Polaris (Tầng 4)</option>
                </select>
              </Field>
              <Field label="Bắt đầu" required><input name="start" type="time" required defaultValue={editingMeeting?.start || '09:00'} className="form-input mt-1.5" /></Field>
              <Field label="Kết thúc" required><input name="end" type="time" required defaultValue={editingMeeting?.end || '10:30'} className="form-input mt-1.5" /></Field>
              <div className="sm:col-span-2"><div className="mb-2 flex items-center justify-between"><span className="form-label mb-0">Cán bộ / Nhân viên tham gia <span className="text-red-500">*</span></span><span className="text-xs text-slate-500">Đã chọn: <b className="text-blue-600">{selectedMembers.length} thành viên</b></span></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">{selectedMembers.map((name,i)=><div key={name} className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 last:border-0"><span className={`h-2 w-2 rounded-full ${i===0?'bg-blue-600':'bg-slate-300'}`}/><b className="text-sm text-slate-800">{name}</b><span className="text-slate-300">—</span><span className="text-xs text-slate-500">{MEETING_STAFF.find(x=>x.name===name)?.dept}</span>{i===0?<span className="ml-auto badge badge-blue">Host</span>:<button type="button" onClick={()=>setSelectedMembers(v=>v.filter(x=>x!==name))} className="ml-auto text-slate-400">×</button>}</div>)}<button type="button" onClick={()=>setMemberPickerOpen(true)} className="px-5 py-3 text-xs font-semibold text-blue-600">+ Thêm nhân viên</button></div></div>
              <div className="sm:col-span-2"><Field label="Ghi chú / Nội dung cuộc họp"><textarea name="notes" rows={2} defaultValue="Trao đổi demo giải pháp tích hợp API hệ thống ACS và bàn giao hạ tầng thử nghiệm đợt 1." className="form-input mt-1.5 resize-none" /></Field></div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[16px]">save</span>
                {editingMeeting ? 'Lưu thay đổi' : 'Tạo lịch họp'}
              </button>
            </footer>
          </form>
        </div>
      )}

      {memberPickerOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/55 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setMemberPickerOpen(false)}}>
          <section className="flex max-h-[90vh] w-full max-w-[670px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b px-6 py-4"><div className="flex items-center gap-3"><span className="material-symbols-outlined rounded-xl bg-blue-50 p-2 text-blue-600">group_add</span><h2 className="text-lg font-bold">Thêm nhân viên tham gia</h2></div><button onClick={()=>setMemberPickerOpen(false)} className="text-slate-400"><span className="material-symbols-outlined">close</span></button></header>
            <div className="grid grid-cols-2 gap-3 px-6 pt-5"><label><span className="form-label">Họ tên</span><input value={memberQuery} onChange={e=>setMemberQuery(e.target.value)} className="form-input" placeholder="Tìm theo họ tên nhân viên..." /></label><label><span className="form-label">Phòng ban</span><select className="form-input"><option>Phòng Công nghệ thông tin (IT)</option><option>Phòng Nhân sự (HR)</option></select></label></div>
            <div className="flex items-center justify-between px-6 py-3 text-xs text-slate-500"><span>Hiển thị <b>7</b> / 10.450 nhân sự</span><button onClick={()=>setSelectedMembers(MEETING_STAFF.map(x=>x.name))} className="font-semibold text-blue-600">Chọn cả phòng ban (IT)</button></div>
            <div className="mx-6 flex-1 overflow-y-auto rounded-xl border">{MEETING_STAFF.filter(x=>x.name.toLowerCase().includes(memberQuery.toLowerCase())).map((person,i)=>{const checked=selectedMembers.includes(person.name);return <div key={person.name} className="flex items-center gap-3 border-b px-3 py-3 last:border-0"><input type="checkbox" checked={checked} disabled={i===0} onChange={()=>setSelectedMembers(v=>checked?v.filter(x=>x!==person.name):[...v,person.name])} className="h-4 w-4 accent-blue-600"/><span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${person.color}`}>{person.initials}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><b className="text-sm">{person.name}</b>{i===0&&<span className="badge badge-blue">Chủ trì</span>}{memberRoles[person.name]==='Thư ký cuộc họp'&&<span className="badge badge-purple">Thư ký</span>}</div><p className="truncate text-xs text-slate-500">{person.email} • {person.dept}</p></div><select disabled={i===0} value={memberRoles[person.name] || 'Người tham gia'} onChange={e=>setMemberRoles(v=>({...v,[person.name]:e.target.value}))} className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"><option>Người tham gia</option><option>Thư ký cuộc họp</option></select></div>})}</div>
            <footer className="mt-5 flex items-center justify-between border-t bg-slate-50 px-6 py-4"><span className="text-sm text-slate-600">Đã chọn: <b>{selectedMembers.length} nhân viên</b></span><div className="flex gap-3"><button onClick={()=>setMemberPickerOpen(false)} className="btn-secondary">Hủy</button><button onClick={()=>setMemberPickerOpen(false)} className="btn-primary"><span className="material-symbols-outlined text-[17px]">check</span>Xác nhận thêm ({selectedMembers.length})</button></div></footer>
          </section>
        </div>
      )}
    </div>
  );
}

