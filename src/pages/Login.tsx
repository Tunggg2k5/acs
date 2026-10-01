import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Role, useRole } from '../context/RoleContext';

type LoginRole = Exclude<Role, 'GUEST'>;

const accounts: Record<LoginRole, { label: string; username: string; password: string; name: string; dept: string }> = {
  ADMIN:    { label: 'Admin',       username: 'admin@acs.vn',    password: 'Admin@123',    name: 'Nguyễn Tuấn Kiên', dept: 'Super Admin' },
  HR:       { label: 'Nhân sự',     username: 'hr@acs.vn',       password: 'HR@123456',    name: 'Trần Thị Mai',   dept: 'Phòng Nhân sự' },
  MANAGER:  { label: 'Quản lý',    username: 'manager@acs.vn',  password: 'Manager@123',  name: 'Lê Hoàng Dũng', dept: 'Trưởng phòng IT' },
  EMPLOYEE: { label: 'Nhân viên',  username: 'employee@acs.vn', password: 'Employee@123', name: 'Trần Thị Mai',   dept: 'Phòng Kế toán' },
};

const ROLE_ICONS: Record<LoginRole, string> = {
  ADMIN:    'admin_panel_settings',
  HR:       'badge',
  MANAGER:  'manage_accounts',
  EMPLOYEE: 'person',
};

const ROLE_COLORS: Record<LoginRole, { bg: string; text: string; border: string; avatar: string }> = {
  ADMIN:    { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-300',   avatar: 'bg-blue-600' },
  HR:       { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-300', avatar: 'bg-purple-600' },
  MANAGER:  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-300', avatar: 'bg-indigo-600' },
  EMPLOYEE: { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-300',   avatar: 'bg-teal-600' },
};

export default function Login() {
  const { login, setRole: setSystemRole } = useRole();
  const navigate = useNavigate();
  const [role, setRole] = useState<LoginRole>('EMPLOYEE');
  const [show, setShow] = useState(false);
  const [forgotOpen,setForgotOpen]=useState(false);
  const [forgotStep,setForgotStep]=useState(1);
  const [forgotVisible,setForgotVisible]=useState({next:false,confirm:false});
  const account = accounts[role];
  const colors = ROLE_COLORS[role];

  const submit = (e: React.FormEvent) => { e.preventDefault(); login(role); navigate(role === 'ADMIN' ? '/qu-n-l-ng-i-d-ng' : '/dashboard'); };
  const backHome = () => { setSystemRole('GUEST'); navigate('/'); };

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">

      {/* ── Left Panel – Branding ─────────────────────────── */}
      <section className="relative hidden flex-col overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 lg:flex">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-blue-300/30 blur-3xl" />
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col p-12">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm ring-1 ring-white/30">
              <span className="material-symbols-outlined text-white text-2xl">fingerprint</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ACS System</h1>
              <p className="text-sm text-blue-200">Chấm công & Nhân sự</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="mt-auto max-w-lg">
            <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200">
              Cổng thông tin nội bộ
            </span>
            <h2 className="mt-6 text-4xl font-bold leading-snug tracking-tight text-white">
              Quản lý công việc và thời gian{' '}
              <span className="text-blue-200">hiệu quả hơn</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blue-100/90">
              Theo dõi chấm công, phiếu đề xuất, lịch họp và công việc trên một hệ thống thống nhất.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { value: '120+', label: 'Nhân sự' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4 Chi nhánh', label: 'Hệ thống' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm ring-1 ring-white/20">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-xs text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="mt-10 text-xs text-blue-300">© 2026 ACS System. All rights reserved.</p>
        </div>
      </section>

      {/* ── Right Panel – Login Form ──────────────────────── */}
      <section className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">

          {/* Back button */}
          <button type="button" onClick={backHome}
            className="mb-8 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Về trang chính
          </button>

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <span className="material-symbols-outlined text-white text-xl">fingerprint</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">ACS System</h1>
              <p className="text-xs text-slate-500">Chấm công & Nhân sự</p>
            </div>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">Đăng nhập</h2>
            <p className="mt-1.5 text-sm text-slate-500">Chọn vai trò để sử dụng tài khoản minh họa.</p>

            {/* Role selector */}
            <div className="mt-6">
              <p className="form-label">Chọn vai trò</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.entries(accounts) as [LoginRole, typeof accounts[LoginRole]][]).map(([r, acc]) => {
                  const c = ROLE_COLORS[r];
                  const selected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition ${
                        selected ? `${c.border} ${c.bg} ${c.text}` : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-2xl ${selected ? c.text : 'text-slate-400'}`}>
                        {ROLE_ICONS[r]}
                      </span>
                      <span className="text-xs font-semibold leading-tight">{acc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              {/* Account info card */}
              <div className={`flex items-center gap-3 rounded-xl border p-3 ${colors.bg} ${colors.border}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${colors.avatar}`}>
                  {account.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`font-semibold ${colors.text}`}>{account.name}</p>
                  <p className="text-xs text-slate-500">{account.dept}</p>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="form-label">Tài khoản</label>
                <input
                  key={`${role}-user`}
                  defaultValue={account.username}
                  readOnly
                  className="form-input bg-slate-50 text-slate-500 cursor-default"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between"><label className="form-label">Mật khẩu</label><button type="button" onClick={()=>{setForgotStep(1);setForgotOpen(true)}} className="text-xs font-semibold text-blue-600">Quên mật khẩu?</button></div>
                <div className="relative">
                  <input
                    key={`${role}-pass`}
                    value={account.password}
                    readOnly
                    type={show ? 'text' : 'password'}
                    className="form-input bg-slate-50 text-slate-500 cursor-default pr-12"
                  />
                  <button
                    type="button"
                    aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    onClick={() => setShow(v => !v)}
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-lg">{show ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-button transition hover:bg-blue-700 active:bg-blue-800"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                Đăng nhập
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p className="mt-5 text-center text-xs text-slate-400">
            Tài khoản và mật khẩu được tự động điền khi đổi vai trò.
          </p>
          <p className="mt-3 text-center text-sm text-slate-500">Chưa có tài khoản? <button onClick={()=>navigate('/dang-ky')} className="font-semibold text-blue-600">Đăng ký ngay</button></p>
        </div>
      </section>
      {forgotOpen&&<div onMouseDown={e=>{if(e.target===e.currentTarget)setForgotOpen(false)}} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4"><form onSubmit={e=>{e.preventDefault();forgotStep<3?setForgotStep(forgotStep+1):setForgotOpen(false)}} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b px-6 py-4"><div><h2 className="font-bold">Đặt lại mật khẩu</h2><p className="mt-1 text-xs text-slate-500">{forgotStep===1?'Nhận OTP qua email công việc':forgotStep===2?'Xác thực mã OTP':'Tạo mật khẩu mới'}</p></div><button type="button" onClick={()=>setForgotOpen(false)} className="text-slate-400"><span className="material-symbols-outlined">close</span></button></header><div className="space-y-4 p-6">{forgotStep===1&&<label><span className="form-label">Email công việc</span><input required type="email" className="form-input" placeholder="name@acs.vn"/></label>}{forgotStep===2&&<label><span className="form-label">Mã OTP</span><input required inputMode="numeric" maxLength={6} className="form-input text-center tracking-[.5em]" placeholder="000000"/><small className="mt-2 block text-slate-400">OTP có thời hạn theo cấu hình hệ thống.</small></label>}{forgotStep===3&&<>{(['next','confirm'] as const).map((key,i)=><label key={key}><span className="form-label">{i===0?'Mật khẩu mới':'Nhập lại mật khẩu mới'}</span><span className="relative block"><input required minLength={8} type={forgotVisible[key]?'text':'password'} className="form-input pr-12"/><button type="button" aria-label={forgotVisible[key]?'Ẩn mật khẩu':'Xem mật khẩu'} onClick={()=>setForgotVisible(v=>({...v,[key]:!v[key]}))} className="absolute inset-y-1 right-1 flex w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"><span className="material-symbols-outlined text-lg">{forgotVisible[key]?'visibility_off':'visibility'}</span></button></span></label>)}</>}</div><footer className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4"><button type="button" onClick={()=>setForgotOpen(false)} className="btn-secondary">Hủy</button><button className="btn-primary">{forgotStep===1?'Gửi OTP':forgotStep===2?'Xác nhận':'Đổi mật khẩu'}</button></footer></form></div>}
    </main>
  );
}
