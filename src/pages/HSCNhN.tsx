import React, { useState } from 'react';

export default function HSCNhN() {
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[#F8FAFC] min-h-full">
      {/* Page Header */}
      <div className="mb-2 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Hồ sơ cá nhân</h1>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              ID: NV-0001
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Xem thông tin định danh nhân sự và tài khoản đăng nhập</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Hồ sơ đã đồng bộ với Core HR
          </span>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm" type="button">
            <span className="material-symbols-outlined text-[18px]">print</span>
            In trích lục
          </button>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Profile Summary Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                NA
              </div>
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white" title="Trạng thái tài khoản">
                  <span className="material-symbols-outlined text-[12px]">check</span>
                </span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Nguyễn Văn An</h2>
            <p className="text-sm text-blue-600 font-semibold mt-1">NV-0001</p>
            <p className="text-sm text-slate-500 mt-1.5">
              Trưởng phòng Kỹ thuật &amp; Quản trị hệ thống
            </p>

            <div className="mt-5 pt-4 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 text-xs uppercase font-semibold tracking-wide">Vai trò hệ thống</span>
                <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-1 rounded-md">
                  Admin / HR
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 text-xs uppercase font-semibold tracking-wide">Trạng thái</span>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Đang hoạt động
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 text-xs uppercase font-semibold tracking-wide">Cấp quản lý</span>
                <span className="text-sm text-slate-800 font-medium">Bậc 4 (Quản lý)</span>
              </div>
            </div>

            <div className="w-full mt-4 flex flex-col gap-3 text-left text-sm text-slate-600">
              <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[20px] text-slate-400">verified_user</span>
                <span>Xác thực 2 lớp (2FA):</span>
                <span className="ml-auto text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Đã bật</span>
              </div>
              <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                <span className="material-symbols-outlined text-[20px] text-slate-400">schedule</span>
                <span>Đăng nhập gần nhất:</span>
                <span className="ml-auto text-slate-800 font-medium text-xs">Hôm nay, 08:14</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <span className="material-symbols-outlined text-[20px] text-slate-400">dns</span>
                <span>IP định danh:</span>
                <span className="ml-auto font-mono text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs">192.168.10.42</span>
              </div>
            </div>
          </div>

          {/* Compact System Access Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-blue-600 text-xl shrink-0 mt-0.5">info</span>
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-blue-900">Quyền hạn tài khoản</span>
              <p className="text-blue-800 text-xs leading-relaxed">
                Tài khoản có toàn quyền quản trị phân ca và duyệt phiếu theo sơ đồ tổ chức được phân cấp.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Form (Read-only + Editable) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <form className="flex flex-col gap-5" id="profileForm" onSubmit={handleUpdate}>
            {/* Section 1: Read-Only Organizational Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">corporate_fare</span>
                  Thông tin tổ chức &amp; Công tác
                </div>
                <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Dữ liệu quản trị (Chỉ xem)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mã định danh nhân sự</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 font-medium">
                    ACS-2022-001
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ngày vào công ty</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 font-medium">
                    15/03/2022 <span className="text-slate-400 font-normal">(Thâm niên: 2 năm 7 tháng)</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phòng ban</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 font-medium">
                    Phòng Công nghệ &amp; Kỹ thuật (IT-DEPT)
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chức vụ nội bộ</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 font-medium">
                    Quản lý kỹ thuật (Manager Cấp 2)
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quản lý trực tiếp (Manager)</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 font-medium">
                    Ban Giám đốc — Nguyễn Hữu Thắng (BOD-002)
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa điểm làm việc mặc định</label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 font-medium">
                    Trụ sở Hà Nội (Keangnam Landmark 72)
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Account Info (Editable) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">manage_accounts</span>
                  Thông tin liên hệ &amp; Tài khoản cá nhân
                </div>
                <span className="text-xs text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded font-medium">
                  * Trường bắt buộc
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    <span className="flex items-center justify-between">
                      <span>Tên đăng nhập SSO</span>
                      <span className="text-slate-400 text-xs font-normal">Cố định</span>
                    </span>
                  </label>
                  <div className="relative">
                    <input className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400 pl-9 outline-none cursor-not-allowed" disabled readOnly type="text" defaultValue="an.nv"/>
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">lock</span>
                  </div>
                  <span className="text-xs text-slate-500">Liên kết trực tiếp với email doanh nghiệp Google Workspace</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="emailInput">
                    Địa chỉ Email công việc <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm pl-9 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition" id="emailInput" required type="email" defaultValue="an.nv@company.com"/>
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">mail</span>
                  </div>
                  <span className="text-xs text-slate-500">Hộp thư nhận thông báo phân ca và bảng lương</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="phoneInput">
                    Số điện thoại di động <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm pl-9 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition" id="phoneInput" required type="tel" defaultValue="0988 123 456"/>
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">call</span>
                  </div>
                  <span className="text-xs text-slate-500">Dùng cho xác thực mã OTP khi cần khôi phục quyền</span>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="addressInput">
                    Địa chỉ liên hệ khẩn cấp / Nơi cư trú
                  </label>
                  <div className="relative">
                    <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm pl-9 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition" id="addressInput" type="text" defaultValue="72 Phạm Hùng, Nam Từ Liêm, Hà Nội"/>
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">home_pin</span>
                  </div>
                  <span className="text-xs text-slate-500">Sử dụng trong trường hợp cơ quan cần gửi hồ sơ chứng từ giấy tờ pháp lý</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Policy Guidance Footer */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-2 max-w-lg">
                <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">policy</span>
                <span className="text-xs text-slate-600 leading-relaxed">
                  <strong>Lưu ý:</strong> Mọi thay đổi về phòng ban, chức danh, mức quyền hạn và mã nhân sự cần liên hệ phòng HR để được phê duyệt theo quy trình điều chỉnh.
                </span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button onClick={() => setActiveModal(true)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap" type="button">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  Đổi mật khẩu
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 whitespace-nowrap" type="submit">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Cập nhật thông tin
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">lock_reset</span>
                <h2 className="text-base font-bold text-slate-900">Đổi mật khẩu tài khoản</h2>
              </div>
              <button onClick={() => setActiveModal(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu hiện tại</label>
                <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="••••••••" type="password"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu mới</label>
                <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="Tối thiểu 8 ký tự" type="password"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
                <input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" placeholder="Nhập lại mật khẩu mới" type="password"/>
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => setActiveModal(false)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50" type="button">
                Hủy bỏ
              </button>
              <button onClick={() => { setActiveModal(false); setShowToast(true); setTimeout(() => setShowToast(false), 3000); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" type="button">
                Lưu mật khẩu mới
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
          <div className="flex flex-col pr-2">
            <span className="text-sm font-bold">Cập nhật thành công</span>
            <span className="text-xs text-emerald-100">Dữ liệu cá nhân đã được lưu vào hệ thống.</span>
          </div>
          <button onClick={() => setShowToast(false)} className="text-emerald-200 hover:text-white transition-colors ml-2">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
