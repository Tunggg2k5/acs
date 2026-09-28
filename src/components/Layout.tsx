import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'GUEST';

const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/qu-n-l-ng-i-d-ng':       ['ADMIN'],
  '/qu-n-l-t-ch-c':          ['ADMIN'],
  '/role-workflow':           ['ADMIN'],
  '/c-u-h-nh-audit-log':     ['ADMIN'],
  '/danh-m-c-ca-ph-n-ca':    ['ADMIN', 'MANAGER'],
  '/l-ch-l-m-vi-c':          ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/l-ch-tr-c-ph-n-c-ng-tr-c': ['ADMIN', 'MANAGER'],
  '/i-ca':                   ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/nh-t-k-ra-v-o':          ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/nh-t-k-ra-v-o-quan-ly':  ['MANAGER'],
  '/b-ng-c-ng':              ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/danh-sach-vi-pham':      ['MANAGER', 'EMPLOYEE'],
  '/i-u-ch-nh-c-ng':         ['ADMIN'],
  '/qu-n-l-phi-u':           ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/c-ng-t-c-nh-m-c':       ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/h-s-c-nh-n':             ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  '/danh-s-ch-nh-n-vi-n':   ['ADMIN', 'MANAGER'],
  '/lich-hop':               ['ADMIN', 'MANAGER', 'EMPLOYEE', 'GUEST'],
  '/cong-viec':              ['EMPLOYEE'],
};

// ─── Nav Section Label ────────────────────────────────────────────────────────
function NavSection({ label }: { label: string }) {
  return (
    <p className="mb-1 mt-4 px-3 text-[10px] font-bold uppercase tracking-widest text-blue-300 first:mt-0">
      {label}
    </p>
  );
}

// ─── Nav Dropdown ─────────────────────────────────────────────────────────────
const NavDropdown = ({ label, icon, children, defaultOpen = false }: {
  label: string; icon: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  useEffect(() => setIsOpen(defaultOpen), [defaultOpen]);
  const childrenArray = React.Children.toArray(children);
  const hasVisibleChildren = childrenArray.some(child => child != null);
  if (!hasVisibleChildren) return null;

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13.5px] font-medium text-blue-100 transition-colors hover:bg-white/10 focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[17px] text-blue-300">{icon}</span>
          <span>{label}</span>
        </div>
        <span className={`material-symbols-outlined text-[14px] text-blue-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div className={`flex flex-col gap-0.5 overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-0.5 ml-2 pl-4 border-l border-white/20' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

// ─── Password Field ───────────────────────────────────────────────────────────
type PasswordFieldProps = {
  name: string;
  label: string;
  visible: boolean;
  autoComplete: string;
  onToggle: () => void;
};

function PasswordField({ name, label, visible, autoComplete, onToggle }: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="form-label">{label} <span className="text-red-500">*</span></span>
      <span className="relative block">
        <input
          name={name}
          required
          minLength={6}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          className="form-input pr-12"
        />
        <button
          type="button"
          aria-label={visible ? `Ẩn ${label.toLowerCase()}` : `Hiện ${label.toLowerCase()}`}
          title={visible ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}
          aria-pressed={visible}
          onMouseDown={event => event.preventDefault()}
          onClick={onToggle}
          className="absolute inset-y-1 right-1 z-20 flex w-9 cursor-pointer items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
        >
          {visible
            ? <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3l18 18M10.6 10.7a2 2 0 002.7 2.7M9.9 4.4A10.8 10.8 0 0112 4c5.5 0 9 5 9 5a15.6 15.6 0 01-3 3.4M6.2 6.2C4.2 7.5 3 9 3 9s3.5 5 9 5c1.1 0 2.1-.2 3-.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z"/><circle cx="12" cy="12" r="2.5"/></svg>
          }
        </button>
      </span>
    </label>
  );
}

// ─── Account Menu ─────────────────────────────────────────────────────────────
type UserInfo = { name: string; title: string; initials: string; color: string };

function AccountMenu({ userInfo, showSettings = false }: { userInfo: UserInfo; showSettings?: boolean }) {
  const { logout: signOut } = useRole();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [message, setMessage] = useState('');

  const goToProfile = () => { setOpen(false); navigate('/h-s-c-nh-n'); };
  const logout = () => { setOpen(false); signOut(); navigate('/login'); };

  const submitPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = String(data.get('newPassword'));
    const confirm = String(data.get('confirmPassword'));
    if (next !== confirm) { setMessage('Mật khẩu nhập lại chưa trùng khớp.'); return; }
    setMessage('Đổi mật khẩu thành công.');
    event.currentTarget.reset();
  };

  return (
    <div className="relative">
      {/* User button at sidebar bottom */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/10"
        aria-expanded={open}
      >
        <span className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${userInfo.color}`}>
          {userInfo.initials}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-blue-900 bg-emerald-400" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-white">{userInfo.name}</span>
          <span className="truncate text-[11px] text-blue-200">{userInfo.title}</span>
        </span>
        <span className={`material-symbols-outlined text-[16px] text-blue-300 transition-transform ${open ? 'rotate-180' : ''}`}>unfold_more</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <button aria-label="Đóng menu tài khoản" onClick={() => setOpen(false)} className="fixed inset-0 z-40 cursor-default" />
          <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-scale-in">
            {/* User info header */}
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${userInfo.color}`}>
                {userInfo.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">{userInfo.name}</p>
                <p className="truncate text-xs text-slate-500">{userInfo.title}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-1.5">
              <button onClick={goToProfile} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                Thay đổi thông tin cá nhân
              </button>
              <button onClick={() => { setOpen(false); setMessage(''); setPasswordOpen(true); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700">
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Đổi mật khẩu
              </button>
              {showSettings && (
                <>
                  <button onClick={() => setSettingsOpen(v => !v)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-blue-700 transition hover:bg-blue-50">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    <span className="flex-1">Cài đặt hệ thống</span>
                    <span className={`material-symbols-outlined text-sm transition-transform ${settingsOpen ? 'rotate-90' : ''}`}>chevron_right</span>
                  </button>
                  {settingsOpen && (
                    <div className="mx-1 mb-1 rounded-xl border border-slate-100 bg-slate-50 p-1.5">
                      {[
                        ['/qu-n-l-t-ch-c', 'corporate_fare', 'Quản lý tổ chức'],
                        ['/role-workflow', 'account_tree', 'Role & Workflow'],
                        ['/c-u-h-nh-audit-log', 'history', 'Cấu hình & Audit Log'],
                        ['/danh-s-ch-nh-n-vi-n', 'badge', 'Danh sách nhân viên'],
                      ].map(([path, itemIcon, label]) => (
                        <button key={path} onClick={() => { setOpen(false); setSettingsOpen(false); navigate(path); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-white hover:text-blue-700">
                          <span className="material-symbols-outlined text-[15px]">{itemIcon}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 p-1.5">
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      )}

      {/* Change Password Modal */}
      {passwordOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onMouseDown={event => { if (event.target === event.currentTarget) setPasswordOpen(false); }}>
          <form onSubmit={submitPassword} className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Đổi mật khẩu</h2>
                <p className="mt-0.5 text-xs text-slate-500">Cập nhật mật khẩu đăng nhập của bạn</p>
              </div>
              <button type="button" onClick={() => setPasswordOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </header>
            <div className="space-y-4 p-6">
              <PasswordField name="currentPassword" label="Mật khẩu cũ" visible={visible.current} autoComplete="current-password" onToggle={() => setVisible(v => ({ ...v, current: !v.current }))} />
              <PasswordField name="newPassword" label="Mật khẩu mới" visible={visible.next} autoComplete="new-password" onToggle={() => setVisible(v => ({ ...v, next: !v.next }))} />
              <PasswordField name="confirmPassword" label="Nhập lại mật khẩu mới" visible={visible.confirm} autoComplete="new-password" onToggle={() => setVisible(v => ({ ...v, confirm: !v.confirm }))} />
              <button type="button" onClick={() => setMessage('Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn.')}
                className="text-sm font-semibold text-blue-600 hover:underline">Quên mật khẩu?</button>
              {message && (
                <p className={`rounded-xl p-3 text-sm ${message.includes('thành công') || message.includes('đã được gửi') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </p>
              )}
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setPasswordOpen(false)} className="btn-secondary">Hủy</button>
              <button className="btn-primary">Cập nhật mật khẩu</button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function Layout({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Close modal on backdrop click
  useEffect(() => {
    const closeOnBackdrop = (event: MouseEvent) => {
      const backdrop = event.target as HTMLElement | null;
      if (!backdrop || !backdrop.classList.contains('fixed') || !backdrop.classList.contains('inset-0')) return;
      if (!backdrop.querySelector('form, [role="dialog"], section, .shadow-2xl')) return;
      const buttons = Array.from(backdrop.querySelectorAll<HTMLButtonElement>('button'));
      const closeButton = buttons.find(button => {
        const text = button.textContent?.trim().toLowerCase();
        const label = button.getAttribute('aria-label')?.toLowerCase();
        return text === '×' || text === '✕' || text === 'đóng' || text === 'hủy' || label?.includes('đóng');
      });
      closeButton?.click();
    };
    document.addEventListener('mousedown', closeOnBackdrop);
    return () => document.removeEventListener('mousedown', closeOnBackdrop);
  }, []);

  if (location.pathname === '/login') return <>{children}</>;

  const canAccess = (path: string) => {
    const allowed = ROUTE_PERMISSIONS[path];
    if (!allowed) return true;
    return allowed.includes(role as Role);
  };

  const isActive = (path: string) => {
    const [pathname, search = ''] = path.split('?');
    if (location.pathname !== pathname) return false;
    return search ? location.search === `?${search}` : !location.search;
  };

  const NavLink = ({ to, icon, label, badge, forceInactive = false }: {
    to: string; icon: string; label: string; badge?: string; forceInactive?: boolean;
  }) => {
    const active = !forceInactive && isActive(to);
    return (
      <Link
        to={to}
        className={`flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] font-medium transition-colors relative ${
          active
            ? 'bg-blue-800 text-white font-semibold'
            : 'text-blue-100 hover:bg-white/10 hover:text-white'
        }`}
      >
        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />}
        <span className={`material-symbols-outlined text-[17px] ${active ? 'text-white' : 'text-blue-300'}`}>{icon}</span>
        <span className="flex-1">{label}</span>
        {badge && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // Page title from current route
  const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'Tổng quan',
    '/lich-hop': 'Quản lý lịch họp',
    '/qu-n-l-ng-i-d-ng': 'Quản lý người dùng',
    '/qu-n-l-t-ch-c': 'Quản lý tổ chức',
    '/role-workflow': 'Role & Workflow',
    '/c-u-h-nh-audit-log': 'Cấu hình & Audit Log',
    '/danh-m-c-ca-ph-n-ca': 'Danh mục ca & Phân ca',
    '/l-ch-l-m-vi-c': 'Lịch làm việc',
    '/l-ch-tr-c-ph-n-c-ng-tr-c': 'Lịch trực & Phân công',
    '/i-ca': 'Đổi ca',
    '/nh-t-k-ra-v-o': 'Nhật ký ra vào',
    '/nh-t-k-ra-v-o-quan-ly': 'Nhật ký ra vào (Quản lý)',
    '/b-ng-c-ng': 'Bảng công',
    '/danh-sach-vi-pham': 'Danh sách vi phạm',
    '/i-u-ch-nh-c-ng': 'Điều chỉnh công',
    '/qu-n-l-phi-u': 'Phiếu & Đơn từ',
    '/c-ng-t-c-nh-m-c': 'Công tác & Đề xuất',
    '/h-s-c-nh-n': 'Hồ sơ cá nhân',
    '/danh-s-ch-nh-n-vi-n': 'Danh sách nhân viên',
    '/cong-viec': 'Danh sách công việc',
    '/quan-ly-nhiem-vu': 'Quản lý nhiệm vụ',
  };
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'ACS System';

  const userInfo = {
    ADMIN:    { name: 'Trần Thị Mai',   title: 'Quản trị viên / Nhân sự', initials: 'TM', color: 'bg-blue-600' },
    MANAGER:  { name: 'Lê Hoàng Dũng', title: 'Trưởng phòng IT',          initials: 'LD', color: 'bg-indigo-600' },
    EMPLOYEE: { name: 'Trần Thị Mai',   title: 'Nhân viên',                initials: 'TM', color: 'bg-teal-600' },
    GUEST:    { name: 'Khách',           title: 'Chưa đăng nhập',           initials: 'K',  color: 'bg-slate-500' },
  }[role as Role] ?? { name: 'User', title: '', initials: 'U', color: 'bg-slate-500' };

  // GUEST layout – minimal
  if (role === 'GUEST') {
    return (
      <div className="min-h-screen bg-slate-50" data-role={role}>
        {children}
      </div>
    );
  }

  const isEmployee = role === 'EMPLOYEE';
  const isManager = role === 'MANAGER';
  const isAdmin = role === 'ADMIN';

  // Role badge
  const roleBadge = isAdmin
    ? { label: 'Admin', cls: 'bg-blue-50 text-blue-700 border-blue-200' }
    : isManager
    ? { label: 'Manager', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
    : { label: 'Nhân viên', cls: 'bg-teal-50 text-teal-700 border-teal-200' };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" data-role={role}>

      {/* ── SIDEBAR ────────────────────────────────── */}
      <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-blue-900 text-white shadow-xl">

        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-blue-800 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
            <span className="material-symbols-outlined text-blue-900 text-[19px]">fingerprint</span>
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white">ACS System</span>
            <span className="block text-[10px] text-blue-200">Chấm công & Nhân sự</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="custom-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3">

          {isEmployee ? (
            <>
              <NavSection label="Chức năng chính" />
              <NavLink to="/dashboard" icon="space_dashboard" label="Tổng quan" />
              <NavLink to="/nh-t-k-ra-v-o" icon="login" label="Nhật ký ra vào" />
              <NavLink to="/qu-n-l-phi-u" icon="request_quote" label="Phiếu & Đơn từ" badge="2" />
              <NavLink to="/lich-hop" icon="event" label="Quản lý lịch họp" />
              <NavLink to="/cong-viec" icon="assignment_turned_in" label="Danh sách công việc" />
              <NavLink to="/danh-sach-vi-pham" icon="warning_amber" label="Vi phạm của tôi" />
            </>
          ) : isAdmin ? (
            <>
              <NavLink to="/dashboard" icon="space_dashboard" label="Tổng quan" />
              <NavLink to="/qu-n-l-ng-i-d-ng" icon="group" label="Người dùng" />

              <NavSection label="Chấm công" />
              <NavLink to="/nh-t-k-ra-v-o" icon="rule" label="Nhật ký ra vào" />
              <NavLink to="/b-ng-c-ng" icon="table_chart" label="Bảng công" />
              <NavLink to="/i-u-ch-nh-c-ng" icon="edit_calendar" label="Điều chỉnh công" />

              <NavSection label="Phiếu & Đơn từ" />
              <NavLink to="/qu-n-l-phi-u" icon="assignment" label="Quản lý phiếu" />
              <NavLink to="/lich-hop" icon="event" label="Quản lý lịch họp" />
            </>
          ) : isManager ? (
            <>
              <NavSection label="Chức năng chính" />
              <NavLink to="/dashboard" icon="space_dashboard" label="Tổng quan" />
              <NavLink to="/nh-t-k-ra-v-o" icon="login" label="Nhật ký ra vào" />
              <NavLink to="/qu-n-l-phi-u?scope=mine" icon="request_quote" label="Phiếu & đơn từ" badge="2" />
              <NavLink to="/lich-hop" icon="event" label="Danh sách lịch họp" />
              <NavLink to="/cong-viec" icon="assignment_turned_in" label="Danh sách nhiệm vụ" />
              <NavLink to="/danh-sach-vi-pham" icon="warning_amber" label="Danh sách vi phạm của tôi" />

              <NavSection label="Quản lý" />
              <NavLink to="/l-ch-l-m-vi-c" icon="calendar_month" label="Quản lý lịch làm việc" />
              <NavLink to="/qu-n-l-phi-u?scope=team" icon="assignment" label="Quản lý phiếu" />
              <NavLink to="/quan-ly-nhiem-vu" icon="task_alt" label="Quản lý nhiệm vụ" />
              <NavLink to="/b-ng-c-ng" icon="table_chart" label="Bảng công" />
              <NavLink to="/nh-t-k-ra-v-o-quan-ly" icon="login" label="Nhật ký ra vào" />
              <NavLink to="/danh-s-ch-nh-n-vi-n" icon="groups" label="Danh sách nhân viên" />
              <NavLink to="/danh-sach-vi-pham?scope=team" icon="warning_amber" label="Danh sách vi phạm" />
            </>
          ) : (
            <>
              <NavLink to="/dashboard" icon="space_dashboard" label="Tổng quan" />
              {!isManager && <NavLink to="/lich-hop" icon="event" label="Quản lý lịch họp" />}

              <NavDropdown label="Hệ thống" icon="settings">
                {canAccess('/qu-n-l-ng-i-d-ng') && <NavLink to="/qu-n-l-ng-i-d-ng" icon="group" label="Quản lý người dùng" />}
                {canAccess('/qu-n-l-t-ch-c') && <NavLink to="/qu-n-l-t-ch-c" icon="corporate_fare" label="Quản lý tổ chức" />}
                {canAccess('/role-workflow') && <NavLink to="/role-workflow" icon="account_tree" label="Role & Workflow" />}
                {canAccess('/c-u-h-nh-audit-log') && <NavLink to="/c-u-h-nh-audit-log" icon="history" label="Cấu hình & Audit Log" />}
              </NavDropdown>

              <NavDropdown label="Ca & Lịch trực" icon="calendar_month">
                {canAccess('/l-ch-l-m-vi-c') && <NavLink to="/l-ch-l-m-vi-c" icon="event_note" label="Lịch làm việc" />}
                {canAccess('/danh-m-c-ca-ph-n-ca') && <NavLink to="/danh-m-c-ca-ph-n-ca" icon="work_history" label="Danh mục & Phân ca" />}
                {canAccess('/l-ch-tr-c-ph-n-c-ng-tr-c') && <NavLink to="/l-ch-tr-c-ph-n-c-ng-tr-c" icon="event_available" label="Lịch trực & Phân công" />}
                {canAccess('/i-ca') && <NavLink to="/i-ca" icon="swap_horiz" label="Đổi ca" />}
              </NavDropdown>

              <NavDropdown label="Chấm công" icon="fingerprint">
                {canAccess('/nh-t-k-ra-v-o') && <NavLink to="/nh-t-k-ra-v-o" icon="login" label="Nhật ký ra vào" />}
                {canAccess('/b-ng-c-ng') && <NavLink to="/b-ng-c-ng" icon="table_chart" label="Bảng công" />}
                {canAccess('/i-u-ch-nh-c-ng') && <NavLink to="/i-u-ch-nh-c-ng" icon="edit_calendar" label="Điều chỉnh công" />}
              </NavDropdown>

              <NavDropdown label="Phiếu & Đơn từ" icon="assignment">
                {canAccess('/qu-n-l-phi-u') && <NavLink to="/qu-n-l-phi-u" icon="description" label="Quản lý phiếu" />}
              </NavDropdown>

              <NavDropdown label="Công tác" icon="flight_takeoff">
                {canAccess('/c-ng-t-c-nh-m-c') && <NavLink to="/c-ng-t-c-nh-m-c" icon="work" label="Công tác & Đề xuất" />}
              </NavDropdown>

              <NavDropdown label="Nhân sự" icon="badge">
                {canAccess('/danh-s-ch-nh-n-vi-n') && <NavLink to="/danh-s-ch-nh-n-vi-n" icon="groups" label="Danh sách nhân viên" />}
              </NavDropdown>
            </>
          )}
        </nav>

        {/* Sidebar Footer – User */}
        <div className="border-t border-blue-800 px-3 py-3">
          <AccountMenu userInfo={userInfo} showSettings={isAdmin} />
        </div>
      </aside>

      {/* ── MAIN AREA ───────────────────────────────── */}
      <div className="ml-64 flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Content */}
        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
