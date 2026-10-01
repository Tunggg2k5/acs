import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type AuditLog = {
  id: string; time: string; date: string; user: string; userRole: string;
  module: string; action: string; target: string; ip: string; status: string;
  reason?: string; oldValue?: Record<string, string>; newValue?: Record<string, string>;
};

const LOGS: AuditLog[] = [
  { id: 'AUDIT-893240', time: '14:25', date: '18/10/2023', user: 'nguyenvanan', userRole: 'Admin', module: 'Chấm công', action: 'Điều chỉnh giờ vào', target: 'NV0092', ip: '192.168.1.45', status: 'Thành công', reason: 'Nhân viên quên quẹt thẻ vào ca sáng do hệ thống cửa vận tay bảo trì lúc 08:30.', oldValue: { checkin_time: 'NULL (Chưa quẹt)', status_code: 'ABSENT', work_credit: '0.0', modified_by_admin: 'false', approval_ticket_id: 'NULL' }, newValue: { checkin_time: '08:28:14', status_code: 'ON_TIME', work_credit: '1.0 công', modified_by_admin: 'true', approval_ticket_id: 'ADJ-2023-1082' } },
  { id: 'AUDIT-893201', time: '09:12', date: '18/10/2023', user: 'tranthimai', userRole: 'Manager', module: 'Phê duyệt', action: 'Duyệt phiếu nghỉ phép', target: 'NP2023-881', ip: '10.0.0.32', status: 'Thành công', reason: 'Phê duyệt đơn nghỉ phép theo đúng quy trình.', oldValue: { status: 'PENDING' }, newValue: { status: 'APPROVED' } },
  { id: 'AUDIT-893155', time: '08:45', date: '18/10/2023', user: 'nguyenvanan', userRole: 'Admin', module: 'Hệ thống', action: 'Cập nhật tham số đi muộn', target: 'sys_config', ip: '192.168.1.45', status: 'Thành công', reason: 'Điều chỉnh ngưỡng đi muộn từ 5 phút lên 10 phút theo chính sách mới.', oldValue: { late_threshold: '5 phút' }, newValue: { late_threshold: '10 phút' } },
  { id: 'AUDIT-893100', time: '07:55', date: '18/10/2023', user: 'SYSTEM_DAEMON', userRole: 'Service', module: 'Chấm công', action: 'Đồng bộ máy chấm công', target: 'TERMINAL-04', ip: '10.10.0.4', status: 'Thành công', reason: 'Tác vụ tự động đồng bộ dữ liệu.', oldValue: {}, newValue: { synced_records: '142', last_sync: '07:55:00' } },
  { id: 'AUDIT-892998', time: '17:40', date: '17/10/2023', user: 'hoangminh', userRole: '—', module: 'Bảo mật', action: 'Sai mật khẩu quá 5 lần', target: 'USR_hoangminh', ip: '203.113.44.2', status: 'Thất bại', reason: 'Tài khoản bị khóa tạm thời 30 phút.', oldValue: { login_attempts: '4' }, newValue: { login_attempts: '5', account_locked: 'true' } },
  { id: 'AUDIT-892940', time: '16:30', date: '17/10/2023', user: 'lethanhhung', userRole: 'Manager', module: 'Phê duyệt', action: 'Từ chối phiếu công tác', target: 'CT-1088', ip: '10.0.0.21', status: 'Thành công', reason: 'Đề xuất không đầy đủ thông tin tài chính.', oldValue: { status: 'PENDING' }, newValue: { status: 'REJECTED' } },
  { id: 'AUDIT-892890', time: '14:10', date: '17/10/2023', user: 'nguyenvanan', userRole: 'Admin', module: 'Tổ chức', action: 'Thêm phòng ban mới', target: 'Phòng R&D', ip: '192.168.1.45', status: 'Thành công', reason: 'Mở rộng cơ cấu tổ chức theo kế hoạch Q4.', oldValue: {}, newValue: { dept_code: 'DEPT-RD', dept_name: 'Phòng R&D', manager: 'Trần Văn Nam' } },
];

const MODULES = ['Tất cả phân hệ', 'Chấm công', 'Phê duyệt', 'Hệ thống', 'Bảo mật', 'Tổ chức'];

const roleColor = (r: string) => {
  if (r === 'Admin') return 'bg-blue-600 text-white';
  if (r === 'Manager') return 'bg-indigo-100 text-indigo-700';
  if (r === 'Service') return 'bg-slate-200 text-slate-700';
  return 'bg-red-100 text-red-700';
};

const moduleIcon: Record<string, string> = {
  'Chấm công': 'fingerprint',
  'Phê duyệt': 'approval',
  'Hệ thống': 'settings',
  'Bảo mật': 'security',
  'Tổ chức': 'corporate_fare',
};

export default function CUHNhAuditLog() {
  const [params, setParams] = useSearchParams();
  const isAudit = params.get('tab') === 'audit';
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(isAudit ? 3 : 1);
  const [filterUser, setFilterUser] = useState('');
  const [filterModule, setFilterModule] = useState('Tất cả phân hệ');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  useEffect(() => setActiveTab(isAudit ? 3 : 1), [isAudit]);

  const visibleLogs = LOGS.filter(l =>
    (filterUser === '' || l.user.toLowerCase().includes(filterUser.toLowerCase()) || l.target.toLowerCase().includes(filterUser.toLowerCase())) &&
    (filterModule === 'Tất cả phân hệ' || l.module === filterModule) &&
    (filterStatus === 'ALL' || l.status === filterStatus)
  );

  const tabs = [
    { id: 1 as const, label: 'Cấu hình chung', icon: 'settings' },
    { id: 3 as const, label: 'Audit Log', icon: 'history' },
  ];

  return (
    <div className="flex flex-col w-full gap-6 p-6 bg-[#F8FAFC] min-h-screen">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{isAudit ? 'Audit Log' : 'Cấu hình hệ thống'}</h1>
          <p className="mt-1 text-sm text-slate-500">{isAudit ? 'Theo dõi lịch sử truy cập và thay đổi dữ liệu trong hệ thống.' : 'Quản lý các tham số vận hành chung của hệ thống ACS.'}</p>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Tabs */}
        {false && <div className="flex border-b border-slate-200 px-4">
          {tabs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setActiveTab(t.id); setParams(t.id === 3 ? { tab: 'audit' } : {}) }}
              className={`h-12 px-5 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>}

        {/* Tab 1: Config */}
        {activeTab === 1 && (
          <div className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-blue-600">tune</span>
              <h2 className="text-sm font-bold text-slate-900">Cấu hình hệ thống chung</h2>
            </div>
            <div className="grid grid-cols-2 gap-5 max-w-3xl">
              {[
                { l: 'Ngưỡng đi muộn (phút)', v: '10', icon: 'schedule' },
                { l: 'Ngưỡng về sớm (phút)', v: '15', icon: 'schedule' },
                { l: 'Số lần sai mật khẩu tối đa', v: '5', icon: 'password' },
                { l: 'Thời gian khóa tài khoản (phút)', v: '30', icon: 'lock_clock' },
                { l: 'Múi giờ hệ thống', v: 'Asia/Ho_Chi_Minh (UTC+7)', icon: 'public' },
                { l: 'Số ngày nghỉ phép năm mặc định', v: '12 ngày', icon: 'event_available' },
                { l: 'Tự động đăng xuất (Session Timeout)', v: '60 phút', icon: 'timer' },
                { l: 'Hạn nộp đơn nghỉ trước ca', v: '24 giờ', icon: 'event' },
              ].map(cfg => (
                <div key={cfg.l} className="flex flex-col gap-1.5">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{cfg.l}</label>
                  <input defaultValue={cfg.v} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                </div>
              ))}
            </div>
            <div className="flex mt-8 pt-5 border-t border-slate-100">
              <button type="button" onClick={() => window.alert('Đã lưu cấu hình hệ thống')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                <span className="material-symbols-outlined text-[18px]">save</span>Lưu cấu hình
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Catalog */}
        {activeTab === 2 && (
          <div className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-blue-600">category</span>
              <h2 className="text-sm font-bold text-slate-900">Danh mục dùng chung</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['Loại phiếu', 'Loại ca làm việc', 'Phòng ban', 'Chức vụ', 'Điểm máy chấm công', 'Lý do điều chỉnh'].map(cat => (
                <button key={cat} type="button" className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex flex-col justify-between gap-3 group text-left">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-slate-500 group-hover:text-blue-600 text-[20px] transition-colors">folder</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{cat}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <span>Quản lý danh mục</span>
                      <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Audit Log */}
        {activeTab === 3 && (
          <div className="flex border-t border-slate-100">
            {/* Main table section */}
            <div className={`flex flex-col flex-1 min-w-0 transition-all ${selectedLog ? 'w-2/3 border-r border-slate-200' : 'w-full'}`}>

              {/* Filter bar */}
              <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Người thực hiện / Đối tượng</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400">search</span>
                    <input
                      value={filterUser}
                      onChange={e => setFilterUser(e.target.value)}
                      placeholder="Tên, ID..."
                      className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
                <div className="w-[160px]">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phân hệ</label>
                  <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                    {MODULES.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="w-[140px]">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Trạng thái</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10">
                    <option value="ALL">Tất cả</option>
                    <option>Thành công</option>
                    <option>Thất bại</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => { setFilterUser(''); setFilterModule('Tất cả phân hệ'); setFilterStatus('ALL'); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>Xóa lọc
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Thời gian</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người thực hiện</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
                      <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visibleLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-16 text-center">
                          <span className="material-symbols-outlined text-slate-300 text-4xl block mb-2">history</span>
                          <span className="text-sm text-slate-400">Không có bản ghi nào</span>
                        </td>
                      </tr>
                    )}
                    {visibleLogs.map(log => (
                      <tr
                        key={log.id}
                        className={`text-sm transition-colors cursor-pointer ${selectedLog?.id === log.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-slate-50'}`}
                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      >
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900">{log.time}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{log.date}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${roleColor(log.userRole)}`}>
                              {log.userRole === 'Admin' ? 'A' : log.userRole === 'Manager' ? 'M' : log.userRole === 'Service' ? 'S' : '!'}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900">{log.user}</div>
                              <div className="text-xs text-slate-400">{log.userRole}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-[16px]">{moduleIcon[log.module] || 'info'}</span>
                            <div>
                              <div className="font-semibold text-slate-900">{log.action}</div>
                              <div className="text-xs text-slate-400 font-mono mt-0.5">{log.module} → {log.target}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${log.status === 'Thành công' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Thành công' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Split view detail panel */}
            {selectedLog && (
              <div className="w-1/3 shrink-0 bg-slate-50 flex flex-col self-start sticky top-0 h-[600px] overflow-y-auto">
                <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10 shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Chi tiết Log</h3>
                    <p className="text-xs text-slate-400 font-mono">{selectedLog.id}</p>
                  </div>
                  <button onClick={() => setSelectedLog(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="p-4 space-y-5">
                  {/* Meta */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border border-slate-100 p-3">
                      <span className="block text-xs text-slate-400 mb-0.5">Phân hệ</span>
                      <span className="text-sm font-semibold text-slate-900">{selectedLog.module}</span>
                    </div>
                    <div className="bg-white rounded-lg border border-slate-100 p-3">
                      <span className="block text-xs text-slate-400 mb-0.5">IP Address</span>
                      <span className="text-xs font-semibold font-mono text-slate-900">{selectedLog.ip}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  {selectedLog.reason && (
                    <div>
                      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Lý do điều chỉnh</span>
                      <div className="p-3 bg-white border-l-2 border-blue-500 rounded-r-lg text-sm text-slate-700 italic shadow-sm">
                        "{selectedLog.reason}"
                      </div>
                    </div>
                  )}

                  {/* Diff view */}
                  {selectedLog.oldValue && Object.keys(selectedLog.oldValue).length > 0 && (
                    <div>
                      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Dữ liệu thay đổi (Diff)</span>
                      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="py-2 px-3 text-xs font-semibold text-slate-600">Trường</th>
                              <th className="py-2 px-3 text-xs font-semibold text-red-600">Cũ</th>
                              <th className="py-2 px-3 text-xs font-semibold text-emerald-600">Mới</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {Object.entries(selectedLog.oldValue!).map(([key, old]) => (
                              <tr key={key}>
                                <td className="py-2 px-3 text-xs font-mono text-slate-600">{key}</td>
                                <td className="py-2 px-3 text-xs text-red-600 bg-red-50/50">{old}</td>
                                <td className="py-2 px-3 text-xs font-medium text-emerald-700 bg-emerald-50/50">{selectedLog.newValue?.[key] ?? '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Verified */}
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Toàn vẹn dữ liệu:</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      <span className="material-symbols-outlined text-[14px]">verified</span> VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
