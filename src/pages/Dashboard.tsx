import { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { Link, Navigate } from 'react-router-dom';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const EMPLOYEE_DATA = {
  name: 'Trần Thị Mai', empId: 'NV003', dept: 'Phòng Kế toán', position: 'Nhân viên',
  todayShift: { name: 'Ca Hành chính', time: '08:00 – 17:00', checkIn: '08:15', checkOut: null as string | null },
  monthStats: { totalDays: 18, workedDays: 15, lateDays: 1, absentDays: 0, otHours: 4.5, remainLeave: 8 },
  pendingRequests: [
    { id: 'PH-2024-015', type: 'Nghỉ phép', from: '25/10', to: '26/10', status: 'Chờ duyệt' },
  ],
  recentLogs: [
    { date: '21/10', checkIn: '07:55', checkOut: '--:--', status: 'Đang làm' },
    { date: '18/10', checkIn: '08:02', checkOut: '17:15', status: 'Đi muộn' },
    { date: '17/10', checkIn: '07:50', checkOut: '17:05', status: 'Đúng giờ' },
    { date: '16/10', checkIn: '07:58', checkOut: '17:00', status: 'Đúng giờ' },
    { date: '15/10', checkIn: '07:45', checkOut: '17:30', status: 'Đúng giờ' },
  ],
  upcomingShifts: [
    { day: 'T2 - 21/10', shift: 'Ca HC', time: '08:00-17:00' },
    { day: 'T3 - 22/10', shift: 'Ca HC', time: '08:00-17:00' },
    { day: 'T4 - 23/10', shift: 'Ca HC', time: '08:00-17:00' },
    { day: 'T5 - 24/10', shift: 'Ca Chiều', time: '14:00-22:00' },
    { day: 'T6 - 25/10', shift: 'Nghỉ phép', time: '--' },
  ],
};

// ─── Employee Dashboard ──────────────────────────────────────────────────────

function EmployeeDashboard() {
  const d = EMPLOYEE_DATA;
  const [weekOffset, setWeekOffset] = useState(0);
  const scheduleRows = [
    {
      shift: 'Ca Sáng', time: '08:30 - 12:00', days: [
        { state: 'Đúng giờ', tone: 'emerald', timeLog: '08:25 - 12:02', task: 'Rà soát tài liệu', deadline: 'Hạn: 11:30' },
        { state: 'Đi muộn', tone: 'amber', timeLog: '08:42 - 12:05', event: '09:00', note: 'Phòng họp 201', task: 'Cập nhật', deadline: 'Hạn: 12:00' },
        { state: 'Có phép', tone: 'emerald', timeLog: '-- : --', task: 'Chuẩn bị báo...', deadline: 'Hạn: 10:30' },
        { state: 'Không phép', tone: 'rose', timeLog: '-- : --' },
        { state: 'Chưa xảy ra', tone: 'slate', timeLog: '-- : --', task: 'Tổng hợp chấm', deadline: 'Hạn: 11:45' },
        { state: 'Chưa diễn ra', tone: 'slate', timeLog: '-- : --' },
        { state: 'Ngày nghỉ', tone: 'muted' },
      ]
    },
    {
      shift: 'Ca Chiều', time: '13:00 - 17:30', days: [
        { state: 'Đúng giờ', tone: 'emerald', timeLog: '12:55 - 17:35' },
        { state: 'Đúng giờ', tone: 'emerald', timeLog: '12:58 - 17:32', task: 'Kiểm tra log ra...', deadline: 'Hạn: 16:30' },
        { state: 'Có phép', tone: 'emerald', timeLog: '-- : --', event: '14:00', note: 'Phòng họp Polaris' },
        { state: 'Không phép', tone: 'rose', timeLog: '-- : --', task: 'Phối hợp...', deadline: 'Hạn: 17:00' },
        { state: 'Chưa xảy ra', tone: 'slate', timeLog: '-- : --' },
        { state: 'Ngày nghỉ', tone: 'muted' },
        { state: 'Ngày nghỉ', tone: 'muted' },
      ]
    },
  ];

  const toneClass: Record<string, string> = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-500',
    rose: 'text-rose-600',
    slate: 'text-slate-400',
    muted: 'text-slate-300',
  };
  const toneBg: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    rose: 'bg-rose-50 border-rose-100',
    slate: 'bg-slate-50 border-slate-100',
    muted: 'bg-slate-50/50 border-transparent',
  };

  const displayedScheduleRows = weekOffset === 0 ? scheduleRows : weekOffset < 0
    ? scheduleRows.map(row => ({ ...row, days: row.days.map((day, index) => index < 5 ? { state: index === 2 ? 'Đi muộn' : 'Đúng giờ', tone: index === 2 ? 'amber' : 'emerald', timeLog: index === 2 ? '08:39 - 12:03' : '08:20 - 12:01' } : { state: 'Ngày nghỉ', tone: 'muted' }) }))
    : scheduleRows.map(row => ({ ...row, days: row.days.map((_, index) => index < 5 ? { state: 'Chưa xảy ra', tone: 'slate', timeLog: '-- : --' } : { state: 'Ngày nghỉ', tone: 'muted' }) }));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: 'login', label: 'Check-in: 08:15', value: '', sub: 'Check-out: 05:40', color: 'blue' },
          { icon: 'calendar_month', label: '15', value: '', sub: 'Ngày công tháng 10', color: 'blue' },
          { icon: 'schedule', label: '1', value: '', sub: 'Đi muộn', color: 'amber' },
          { icon: 'event_available', label: '0/8', value: '', sub: 'Ngày vắng', color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className={`card p-5 flex items-center justify-between border-l-4 ${stat.color === 'blue' ? 'border-l-blue-500' : stat.color === 'amber' ? 'border-l-amber-500' : 'border-l-emerald-500'}`}>
            <div>
              <p className="text-xl font-bold text-slate-900">{stat.label}</p>
              <p className="mt-1 text-[11px] text-slate-400">{stat.sub}</p>
            </div>
            <span className={`material-symbols-outlined rounded-xl p-2.5 text-xl ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {stat.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Schedule grid */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-blue-600">calendar_view_week</span>
            <h2 className="text-sm font-bold text-slate-900">Lịch làm việc</h2>
            <select
              aria-label="Chọn tuần"
              value={weekOffset}
              onChange={e => setWeekOffset(Number(e.target.value))}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 outline-none"
            >
              <option value={0}>Tuần 23/10 – 29/10</option>
              <option value={-1}>Tuần 16/10 – 22/10</option>
              <option value={1}>Tuần 30/10 – 05/11</option>
            </select>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-slate-200">
            <button aria-label="Tuần trước" onClick={() => setWeekOffset(v => Math.max(-1, v - 1))} className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50">‹</button>
            <button aria-label="Tuần sau" onClick={() => setWeekOffset(v => Math.min(1, v + 1))} className="border-l border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50">›</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-[140px_repeat(7,minmax(90px,1fr))] text-xs">
            {/* Header row */}
            <div className="border-r border-b border-slate-100 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Ca làm</div>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
              <div key={day} className="border-r border-b border-slate-100 bg-slate-50 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 last:border-r-0">{day}</div>
            ))}
            {/* Data rows */}
            {displayedScheduleRows.map(row => (
              <div key={row.shift} className="contents">
                <div className="flex min-h-[120px] flex-col justify-center border-r border-b border-slate-100 bg-slate-50/50 px-4">
                  <b className="text-[12px] font-semibold text-slate-700">{row.shift}</b>
                  <span className="mt-0.5 text-[10px] text-slate-400">{row.time}</span>
                </div>
                {row.days.map((day, index) => (
                  <div key={`${row.shift}-${index}`} className={`flex min-h-[120px] flex-col items-start justify-start border-r border-b border-slate-100 p-2 last:border-r-0 ${day.tone === 'muted' ? 'bg-slate-50/30' : 'bg-white'}`}>
                    <div className={`w-full rounded-lg border p-2 ${toneBg[day.tone]}`}>
                      <span className={`block text-[11px] font-semibold ${toneClass[day.tone]}`}>{day.state}</span>
                      {'timeLog' in day && day.timeLog && (
                        <span className="mt-0.5 block text-[10px] text-slate-400">{day.timeLog}</span>
                      )}
                    </div>
                    {(day as { event?: string; note?: string }).event && (
                      <Link
                        aria-label={`Mở lịch họp ${(day as { note?: string }).note}`}
                        title="Mở chi tiết lịch họp"
                        to={`/lich-hop?meeting=${(day as { note?: string }).note?.includes('Google') ? 'LH-08' : 'LH-02'}`}
                        className="mt-1.5 w-full rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-left text-[10px] text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                      >
                        <b className="block text-[10px]">📅 {(day as { event?: string }).event}</b>
                        <span className="text-[9px] text-blue-600">{(day as { note?: string }).note}</span>
                      </Link>
                    )}
                    {('task' in day && (day as { task?: string }).task) && (
                      <Link
                        aria-label={`Mở công việc ${(day as { task?: string }).task}`}
                        title="Mở chi tiết công việc"
                        to={`/cong-viec?task=${(day as { task?: string }).task === 'Rà soát tài liệu' ? 1 : 2}`}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left text-[10px] text-slate-600 transition hover:border-blue-200 hover:bg-blue-50"
                      >
                        <b className="block truncate">{(day as { task?: string }).task}</b>
                        <span className="mt-0.5 block text-[9px] text-slate-400">{(day as { deadline?: string }).deadline}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pending requests */}
      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-500">pending_actions</span>
            <h2 className="text-sm font-bold text-slate-900">Đơn từ đang chờ duyệt</h2>
            <span className="h-2 w-2 rounded-full bg-amber-400" />
          </div>
          <Link to="/qu-n-l-phi-u" className="text-xs font-semibold text-blue-600 hover:underline">Xem tất cả →</Link>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <span className="material-symbols-outlined mt-0.5 text-[18px] text-amber-600">event_busy</span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Nghỉ phép</p>
              <p className="mt-1 text-xs text-slate-500">25/10/2026 – 26/10/2026 · Giải quyết việc gia đình</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full border border-amber-200 bg-white px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">Chờ duyệt</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Manager Dashboard ───────────────────────────────────────────────────────

function ManagerDashboard() {
  const requests = [
    { id: 'PH-2024-015', name: 'Lê Thanh Bình', initials: 'LB', type: 'Nghỉ phép năm', shortType: 'Nghỉ phép', date: '25/10 - 26/10', sub: '2 ngày ca ngày', period: '25/10 - 26/10/2024 (2 ngày)', created: '18/10/2024 14:30', reason: 'Giải quyết việc gia đình cá nhân tại quê', handover: 'Vũ Khánh Linh (Hỗ trợ bàn giao)', attachment: 'Don_xin_phep_Lê_Thanh_Binh.pdf (142 KB)' },
    { id: 'PH-2024-018', name: 'Nguyễn Văn Hùng', initials: 'NH', type: 'Đổi ca trực', shortType: 'Đổi ca', date: '22/10/2024', sub: 'Sáng ➔ Chiều', period: '22/10/2024 (Ca Sáng ➔ Ca Chiều)', created: '19/10/2024 09:15', reason: 'Trùng lịch khám sức khỏe định kỳ buổi sáng', handover: 'Phạm Minh Tuấn (Nhận ca sáng thay thế)', attachment: 'Biên_ban_thoa_thuan_doi_ca.pdf (88 KB)' },
    { id: 'PH-2024-025', name: 'Vũ Khánh Linh', initials: 'KL', type: 'Nghỉ nửa ngày (chiều)', shortType: 'Nghỉ nửa ngày', date: '23/10/2024', sub: '13:30 - 17:30', period: '23/10/2024 (13:30 - 17:30)', created: '21/10/2024 08:30', reason: 'Khám bệnh theo lịch hẹn bác sĩ', handover: 'Lê Thanh Bình (Bàn giao trực dự án)', attachment: 'Lich_kham_benh_vien.pdf (115 KB)' },
    { id: 'PH-2024-027', name: 'Đỗ Quốc Bảo', initials: 'QB', type: 'Giải trình quên chấm công', shortType: 'Quên chấm công', date: '21/10/2024', sub: 'Check-in sáng', period: '21/10/2024 (Check-in sáng)', created: '21/10/2024 09:05', reason: 'Cửa quét vân tay sảnh 1 bảo trì đột xuất', handover: 'Bùi Thanh Tùng (Xác nhận đi cùng thang máy)', attachment: 'Hinh_anh_loi_may_cham_cong.jpg (320 KB)' },
    { id: 'PH-2024-031', name: 'Nguyễn Thị Ngọc', initials: 'NN', type: 'Nghỉ phép năm', shortType: 'Nghỉ phép', date: '27/10/2024', sub: '1 ngày', period: '27/10/2024 (1 ngày)', created: '22/10/2024 08:40', reason: 'Giải quyết việc gia đình', handover: 'Trần Đức Thắng', attachment: '—' },
    { id: 'PH-2024-032', name: 'Trần Đức Thắng', initials: 'TT', type: 'Nghỉ phép năm', shortType: 'Nghỉ phép', date: '28/10/2024', sub: '1 ngày', period: '28/10/2024 (1 ngày)', created: '22/10/2024 09:20', reason: 'Việc cá nhân', handover: 'Hoàng Mai Anh', attachment: '—' },
    { id: 'PH-2024-033', name: 'Hoàng Mai Anh', initials: 'HA', type: 'Giải trình quên chấm công', shortType: 'Quên chấm công', date: '22/10/2024', sub: 'Check-out chiều', period: '22/10/2024', created: '22/10/2024 17:40', reason: 'Thiết bị chấm công mất kết nối', handover: '—', attachment: '—' },
    { id: 'PH-2024-034', name: 'Nguyễn Văn Hùng', initials: 'NH', type: 'Nghỉ phép năm', shortType: 'Nghỉ phép', date: '24/10/2024', sub: '1 ngày', period: '24/10/2024', created: '23/10/2024 08:10', reason: 'Khám sức khỏe', handover: 'Bùi Thanh Tùng', attachment: '—' },
  ];
  const violations = [
    { name: 'Nguyễn Văn Hùng', position: 'Kỹ sư phần mềm', issue: 'Đi muộn', frequency: '2 lần/tháng', tone: 'amber' },
    { name: 'Lê Thị Hoa', position: 'Chuyên viên QA', issue: 'Vắng không phép', frequency: '1 lần/tháng', tone: 'rose' },
    { name: 'Bùi Thanh Tùng', position: 'DevOps Engineer', issue: 'Quên check-out', frequency: '1 lần/tháng', tone: 'slate' },
    { name: 'Trần Minh Đức', position: 'Tester viên', issue: 'Về sớm', frequency: '2 lần/tháng', tone: 'amber' },
    { name: 'Đặng Tuấn Anh', position: 'Frontend Dev', issue: 'Đi muộn', frequency: '2 lần/tháng', tone: 'amber' },
    { name: 'Hoàng Thu Thảo', position: 'Business Analyst', issue: 'Quên check-out', frequency: '1 lần/tháng', tone: 'slate' },
    { name: 'Phạm Hoàng Nam', position: 'Backend Dev', issue: 'Đi muộn', frequency: '1 lần/tháng', tone: 'slate' },
    { name: 'Vũ Hải Yến', position: 'Product Designer', issue: 'Quên check-in', frequency: '1 lần/tháng', tone: 'slate' },
  ];
  const meetings = [
    { time: '09:30 - 10:30', status: 'Chưa diễn ra', title: 'Họp Daily Scrum phòng IT & Rà soát tiến độ Sprint 42', place: 'Phòng họp Polaris (Tầng 4)', people: 'Lê Hoàng Dũng (Chủ trì), cùng 7 thành viên IT' },
    { time: '14:00 - 15:00', status: 'Chờ xác nhận', title: 'Phỏng vấn ứng viên Senior Frontend Developer', place: 'Phòng phỏng vấn 02 • Phối hợp cùng BP Nhân sự (HR)', people: 'Lê Hoàng Dũng, Trần Thu Hà (HR)' },
    { time: '16:30 - 17:30', status: 'Chưa diễn ra', title: 'Báo cáo định kỳ tuần & Đánh giá năng suất công với Ban Giám đốc', place: 'Phòng họp Hội đồng A • Trực tiếp', people: 'Trưởng các phòng ban, Ban Giám đốc' },
  ];
  const [selected, setSelected] = useState<(typeof requests)[number] | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<(typeof meetings)[number] | null>(null);
  const [selectedViolation, setSelectedViolation] = useState<(typeof violations)[number] | null>(null);
  const [activeRange, setActiveRange] = useState(() => localStorage.getItem('acs-manager-dashboard-range') || 'Tháng này');
  const [requestRows, setRequestRows] = useState(requests);
  const [meetingPage, setMeetingPage] = useState(1);
  const [meetingRows, setMeetingRows] = useState(meetings);
  const decideRequest = (id: string) => { setRequestRows(rows => rows.filter(x => x.id !== id)); setSelected(null); };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <section className="order-1">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-blue-600">analytics</span>
            <h2 className="text-xl font-bold text-slate-800">Thống kê điểm danh & Hiện diện</h2>
          </div>
          <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'].map(x => (
              <button key={x} onClick={() => { setActiveRange(x); localStorage.setItem('acs-manager-dashboard-range', x); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${activeRange === x ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ['6', 'Có mặt hôm nay / 8', 'group', 'emerald'],
            ['1', 'Đi muộn hôm nay', 'schedule', 'amber'],
            ['1', 'Vắng không phép', 'person_off', 'rose'],
            ['1', 'Nghỉ phép hôm nay', 'beach_access', 'indigo'],
          ].map(([v, l, i, c]) => (
            <div key={l} className={`card min-h-[96px] p-5 border-l-4 ${c === 'emerald' ? 'border-l-emerald-500' : c === 'amber' ? 'border-l-amber-500' : c === 'rose' ? 'border-l-rose-500' : 'border-l-indigo-500'}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{v}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase text-slate-500">{l}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly schedule */}
      <section className="order-3 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-900">Lịch làm việc</h2>
            <button className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">▣ Tuần 23/10 – 29/10⌄</button>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-slate-200"><button className="px-3 py-1.5 text-slate-500 hover:bg-slate-50">‹</button><button className="border-l border-slate-200 px-3 py-1.5 text-slate-500 hover:bg-slate-50">›</button></div>
        </div>
        <div className="overflow-x-auto"><div className="grid min-w-[980px] grid-cols-7 text-xs">
          {[
            { day: 'T2', date: '23/10', status: 'Đúng giờ', time: '08:25 - 12:02', items: [['task', 'Rà soát tài liệu', 'Hạn: 11:30'], ['task', 'Kiểm tra log ra vào', 'Hạn: 16:30']] },
            { day: 'T3', date: '24/10', status: 'Đi muộn', time: '08:42 - 12:05', items: [['meeting', 'Phòng họp 201', '09:00 · Họp tuần'], ['meeting', 'Phòng họp Polaris', '14:00']] },
            { day: 'T4', date: '25/10', status: 'Có phép', time: '-- : --', items: [['task', 'Chuẩn bị báo cáo', 'Hạn: 10:30'], ['leave', 'Nghỉ phép định kỳ', 'Đã phê duyệt']] },
            { day: 'T5', date: '26/10', status: 'Không phép', time: '-- : --', items: [] },
            { day: 'T6', date: '27/10', status: 'Chưa diễn ra', time: '-- : --', items: [['task', 'Tổng hợp chấm công', 'Hạn: 11:45']] },
            { day: 'T7', date: '28/10', status: 'Chưa diễn ra', time: '-- : --', items: [] },
            { day: 'CN', date: '29/10', status: 'Ngày nghỉ tuần', time: '', items: [] },
          ].map((d, dayIndex) => <div key={d.day} className="min-h-[188px] border-r border-slate-200 last:border-r-0"><div className="border-b bg-slate-50 px-3 py-3 text-center font-bold text-slate-700">{d.day} <span className="ml-1 font-normal text-slate-400">{d.date}</span></div><div className="p-3"><div className={`flex items-center justify-between font-semibold ${d.status === 'Đúng giờ' || d.status === 'Có phép' ? 'text-emerald-600' : d.status === 'Đi muộn' ? 'text-amber-600' : d.status === 'Không phép' ? 'text-rose-600' : 'text-slate-500'}`}><span>● {d.status}</span><span className="font-mono text-[10px] font-normal">{d.time}</span></div><div className="mt-3 space-y-2">{d.items.map((item, i) => item[0] === 'meeting' ? <button key={item[1]} onClick={() => setSelectedMeeting(meetingRows[Math.min(dayIndex, meetingRows.length - 1)])} className="w-full border-l-2 border-blue-400 bg-blue-50/50 px-2 py-1.5 text-left hover:bg-blue-100"><b className="block text-[11px] text-slate-800">{item[1]}</b><span className="text-[10px] text-blue-600">{item[2]}</span></button> : item[0] === 'task' ? <Link key={item[1]} to={`/cong-viec?task=${dayIndex * 2 + i + 1}`} className="block border-l-2 border-emerald-400 px-2 py-1.5 text-left hover:bg-emerald-50"><b className="block text-[11px] text-slate-800">{item[1]}</b><span className="text-[10px] text-slate-400">{item[2]}</span></Link> : <div key={item[1]} className="border-l-2 border-blue-400 px-2 py-1.5"><b className="block text-[11px]">{item[1]}</b><span className="text-[10px] text-blue-600">{item[2]}</span></div>)}</div>{!d.items.length && <p className="mt-6 text-center italic text-slate-400">Không có sự kiện</p>}</div></div>)}
        </div></div>
      </section>

      {/* Requests + Violations */}
      <div className="order-2 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Requests */}
        <section className="card flex flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-600">pending_actions</span>
              <h2 className="text-sm font-bold text-slate-900">Yêu cầu chờ duyệt</h2>
            </div>
            <Link to="/qu-n-l-phi-u?scope=team" className="flex items-center gap-1 text-xs font-semibold text-blue-600">
              Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="table-header">
                  <th className="px-4 py-3">Nhân viên</th>
                  <th className="px-4 py-3">Loại đơn</th>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {requestRows.slice(0, 8).map(x => (
                  <tr key={x.id} onClick={() => setSelected(x)} className="group cursor-pointer transition hover:bg-blue-50/40">
                    <td className="px-4 py-3 font-semibold text-slate-800 group-hover:text-blue-700">{x.name}</td>
                    <td className="px-4 py-3 text-slate-600">{x.shortType}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{x.date}</p>
                      <p className="text-[10px] text-slate-400">{x.sub}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <button onClick={e => { e.stopPropagation(); decideRequest(x.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                        <button onClick={e => { e.stopPropagation(); decideRequest(x.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <footer className="mt-auto flex justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs">
            <span className="text-slate-500">Hiển thị {Math.min(requestRows.length, 8)} / {requestRows.length} yêu cầu</span>
            <Link to="/qu-n-l-phi-u?scope=team" className="font-semibold text-blue-600">Xem tất cả phiếu →</Link>
          </footer>
        </section>

        {/* Violations */}
        <section className="card flex flex-col overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-rose-500">warning</span>
              <h2 className="text-sm font-bold text-slate-900">Danh sách vi phạm</h2>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-slate-400">search</span>
              <input className="h-8 w-36 rounded-lg border border-slate-200 pl-8 pr-2 text-xs outline-none focus:border-blue-400" placeholder="Tìm nhân viên..." />
            </div>
          </header>
          <table className="w-full text-left">
            <thead>
              <tr className="table-header">
                <th className="px-4 py-3">Nhân viên</th>
                <th className="px-4 py-3">Hình thức</th>
                <th className="px-4 py-3 text-center">Tần suất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {violations.map(x => (
                <tr key={x.name} onClick={() => setSelectedViolation(x)} className="cursor-pointer transition hover:bg-rose-50/40 text-xs">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{x.name}</p>
                    <p className="text-[10px] text-slate-400">{x.position}</p>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${x.tone === 'rose' ? 'text-rose-600' : x.tone === 'amber' ? 'text-amber-600' : 'text-slate-600'}`}>{x.issue}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">{x.frequency}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer className="mt-auto flex justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs">
            <span className="text-slate-500">Hiển thị 3 / 3 trường hợp</span>
            <Link to="/nh-t-k-ra-v-o" className="font-semibold text-blue-600">Xem toàn bộ nhật ký vi phạm →</Link>
          </footer>
        </section>
      </div>

      {/* Meetings */}
      <section className="hidden">
        <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <span className="material-symbols-outlined text-[18px] text-blue-600">event</span>
            </div>
            <h2 className="text-sm font-bold text-slate-900">Lịch họp & Sự kiện trong ngày</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/lich-hop" className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">
              <span className="material-symbols-outlined text-[14px]">add</span>Thêm lịch họp
            </Link>
            <Link to="/lich-hop" className="text-xs font-semibold text-blue-600">Xem toàn bộ lịch →</Link>
          </div>
        </header>
        <div className="divide-y divide-slate-100 px-6">
          {meetingRows.map((x, i) => (
            <div key={x.time} onClick={() => setSelectedMeeting(x)} className="flex cursor-pointer items-center gap-4 py-4 transition hover:bg-blue-50/30">
              <div className="w-36 shrink-0">
                <p className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <span className={`material-symbols-outlined text-[16px] ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>schedule</span>
                  {x.time}
                </p>
                <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${i === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                  {x.status}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-800 hover:text-blue-700 truncate">{x.title}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-400">
                  <span>📍 {x.place}</span>
                  <span>👤 {x.people}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-300">chevron_right</span>
            </div>
          ))}
        </div>
      </section>

      {/* Meeting detail modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={e => { if (e.target === e.currentTarget) setSelectedMeeting(null); }}>
          <div className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined rounded-xl border border-blue-100 bg-blue-50 p-2 text-[20px] text-blue-600">event</span>
                <h2 className="text-base font-bold text-slate-900">Chi tiết cuộc họp</h2>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">• {selectedMeeting.status}</span>
              </div>
              <button onClick={() => setSelectedMeeting(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900">{selectedMeeting.title}</h3>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm text-blue-600">verified</span>
                Tổ chức bởi <b className="text-slate-700 ml-1">Lê Hoàng Dũng</b>&nbsp;(Trưởng phòng IT) • 0903 456 788
              </p>
              <div className="my-5 border-t border-slate-100" />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="flex items-center gap-1 text-xs text-slate-500"><span className="material-symbols-outlined text-[14px] text-blue-600">schedule</span>Thời gian diễn ra</p>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">Hôm nay, Thứ Hai 21/10/2024</p>
                  <p className="text-xs text-slate-500">{selectedMeeting.time} <span className="text-slate-400">(60 phút)</span></p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="flex items-center gap-1 text-xs text-slate-500"><span className="material-symbols-outlined text-[14px] text-blue-600">apartment</span>Địa điểm</p>
                  <p className="mt-1.5 text-sm font-bold text-slate-800">{selectedMeeting.place.split(' • ')[0]}</p>
                </div>
              </div>
              <p className="mb-2 mt-5 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                <span className="material-symbols-outlined text-[14px]">group</span>Thành phần tham gia (8 người) – Trang 1/2
              </p>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Thành viên</th>
                      <th className="px-4 py-3">Vai trò</th>
                      <th className="px-4 py-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ['LD', 'Lê Hoàng Dũng', 'Trưởng phòng IT', 'Chủ trì (Host)'],
                      ['LB', 'Lê Thanh Bình', 'Frontend Developer', 'Thành viên dự án'],
                      ['NH', 'Nguyễn Văn Hùng', 'Kỹ sư phần mềm', 'Thành viên dự án'],
                      ['KL', 'Vũ Khánh Linh', 'Senior Dev', 'Thành viên dự án'],
                      ['TH', 'Trần Thu Hà', 'Khách', 'Khách mời HR'],
                    ].map((m, i) => (
                      <tr key={m[1]}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700'}`}>{m[0]}</span>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{m[1]}</p>
                              <p className="text-[9px] text-slate-400">⌕ 091{i + 3}.456.{i + 7}8</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <p className="text-xs font-medium text-slate-700">{m[2]}</p>
                          <p className={`text-[9px] ${i === 0 ? 'text-blue-600' : 'text-slate-400'}`}>{m[3]}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[9px] font-medium text-blue-700">✉ Đã gửi lời mời</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[10px] text-slate-500">
                  <span>{meetingPage === 1 ? 'Hiển thị 1 – 5 trong số 8 người' : 'Hiển thị 6 – 8 trong số 8 người'}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setMeetingPage(1)} className="h-6 w-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100">‹</button>
                    <button onClick={() => setMeetingPage(1)} className={`h-6 w-6 rounded text-xs font-semibold ${meetingPage === 1 ? 'bg-blue-600 text-white' : 'border border-slate-200'}`}>1</button>
                    <button onClick={() => setMeetingPage(2)} className={`h-6 w-6 rounded text-xs font-semibold ${meetingPage === 2 ? 'bg-blue-600 text-white' : 'border border-slate-200'}`}>2</button>
                    <button onClick={() => setMeetingPage(2)} className="h-6 w-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100">›</button>
                  </div>
                </div>
              </div>
            </div>
            <footer className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => { setMeetingRows(rows => rows.filter(x => x.time !== selectedMeeting.time)); setSelectedMeeting(null); }}
                className="btn-danger text-xs">
                Hủy lịch họp
              </button>
              <Link to="/lich-hop" className="btn-secondary text-xs">Chỉnh sửa</Link>
            </footer>
          </div>
        </div>
      )}

      {/* Request detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined rounded-full bg-blue-50 p-2 text-[20px] text-blue-600">gavel</span>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Chi tiết yêu cầu chờ duyệt</h2>
                  <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">• Chờ duyệt</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="space-y-4 p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 text-sm sm:grid-cols-[150px_1fr_150px_1fr]">
                  <div className="border-b border-r bg-slate-50 p-4 text-slate-600">♙　Họ tên</div>
                  <div className="border-b border-r p-4 font-semibold text-slate-900">{selected.name}</div>
                  <div className="border-b border-r bg-slate-50 p-4 text-slate-600">▥　Phòng ban</div>
                  <div className="border-b p-4">Phòng IT</div>
                  <div className="border-b border-r bg-slate-50 p-4 text-slate-600">◇　Loại phiếu</div>
                  <div className="border-b border-r p-4 font-semibold">{selected.shortType}</div>
                  <div className="border-b border-r bg-slate-50 p-4 text-slate-600">⊖　Trạng thái</div>
                  <div className="border-b p-4"><span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">● Chờ duyệt</span></div>
                  <div className="border-b border-r bg-slate-50 p-4 text-slate-600">▣　Thời gian</div>
                  <div className="border-b p-4 sm:col-span-3">{selected.period}</div>
                  <div className="border-r bg-slate-50 p-4 text-slate-600">▧　Lý do</div>
                  <div className="bg-amber-50 p-4 text-slate-700 sm:col-span-3">{selected.reason}</div>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-800">Ý kiến / Ghi chú phản hồi</p>
                <textarea rows={2} className="form-input resize-none" placeholder="Nhập ghi chú hoặc lý do phản hồi (tùy chọn)..." />
              </div>
            </div>
            <footer className="flex gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => decideRequest(selected.id)} className="btn-danger text-xs">✕ Từ chối đơn</button>
              <button onClick={() => decideRequest(selected.id)} className="btn-primary text-xs">◉ Phê duyệt đơn</button>
            </footer>
          </div>
        </div>
      )}

      {/* Violation detail modal */}
      {selectedViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={e => { if (e.target === e.currentTarget) setSelectedViolation(null); }}>
          <div className="w-full max-w-[780px] overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-start justify-between border-b border-slate-100 px-7 py-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Tổng quan chuyên cần</h2>
              </div>
              <button onClick={() => setSelectedViolation(null)} aria-label="Đóng" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><span className="material-symbols-outlined">close</span></button>
            </header>
            <div className="space-y-6 p-7">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500 text-xs font-bold text-white">LH</span><div><b className="text-sm text-slate-900">{selectedViolation.name}</b><p className="text-xs text-slate-500">✉ hoa.lt@acs.vn</p></div></div>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500">▣ Tháng 10/2024</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[['1', 'Vắng không phép', 'rose'], ['1', 'Đi muộn', 'amber'], ['0', 'Về sớm', 'slate'], ['0', 'Quên check-in', 'slate'], ['0', 'Quên check-out', 'slate']].map(([val, label, tone]) => <div key={label} className={`rounded-lg border p-3 text-center ${tone === 'rose' ? 'border-rose-200' : tone === 'amber' ? 'border-amber-200' : 'border-slate-200'}`}><b className={`text-base ${tone === 'rose' ? 'text-rose-500' : tone === 'amber' ? 'text-amber-500' : 'text-slate-600'}`}>{val}</b><p className="mt-1 text-[10px] text-slate-500">{label}</p></div>)}
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Ngày</th>
                      <th className="p-4">Vi phạm</th>
                      <th className="p-4">Ghi nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-4 text-sm text-slate-700">21/10/2024</td>
                      <td className={`p-4 text-sm font-semibold ${selectedViolation.tone === 'rose' ? 'text-rose-600' : selectedViolation.tone === 'amber' ? 'text-amber-600' : 'text-slate-700'}`}>{selectedViolation.issue}</td>
                      <td className="p-4 text-sm text-slate-500">Ghi nhận từ hệ thống chấm công</td>
                    </tr>
                    <tr><td className="p-4 text-sm text-slate-700">15/10/2024</td><td className="p-4 text-sm font-semibold text-amber-600">Đi muộn · 22 phút</td><td className="p-4 text-sm text-slate-500">Check-in lúc 08:22 tại sảnh Tầng 1</td></tr>
                  </tbody>
                </table>
                <div className="border-t border-slate-100 px-4 py-3 text-right"><button className="text-xs font-semibold text-blue-600">Xem toàn bộ lịch sử →</button></div>
              </div>
            </div>
            <footer className="flex justify-end border-t border-slate-100 bg-slate-50 px-7 py-5">
              <button onClick={() => setSelectedViolation(null)} className="btn-primary px-7">Đóng</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

function AdminDashboard() {
  const violations = [
    ['21/10/2024 14:23', 'Nguyễn Văn Hùng', 'HungNV - DEV', 'Đi muộn', 'Mới ghi nhận', 'rose'],
    ['21/10/2024 11:08', 'Phùng Văn Tùng', 'TungPV - FE', 'Nghỉ không phép', 'Đã xử lý', 'emerald'],
    ['21/10/2024 09:15', 'Trần Minh Đức', 'DucTM - QA', 'Về sớm', 'Đang xác minh', 'amber'],
    ['21/10/2024 08:42', 'Trần Thị Mai', 'MaiTT - HR', 'Đi muộn', 'Đã xử lý', 'emerald'],
  ];
  const requests = [
    ['person_add', 'Đăng ký khách', 'Khách vãng lai & nhà thầu dịch vụ', '12', 'amber'],
    ['calendar_month', 'Cuộc họp có khách', 'Đăng ký phòng họp và danh sách dự kiến', '5', 'violet'],
    ['key', 'Cấp quyền ra/vào', 'Quyền truy cập khu vực máy chủ & hạn chế', '3', 'blue'],
    ['description', 'Điều chỉnh lịch sử', 'Bổ sung check-in sót và giải trình', '2', 'teal'],
  ];
  const meetings = [
    ['Họp triển khai dự án', 'Nội bộ', 'Phòng họp A1', '09:00 - 10:00', 'Sắp diễn ra', 'amber'],
    ['Tiếp đón đối tác ABC', 'Có khách', 'Phòng họp B1', '10:30 - 11:30', 'Đang đón khách', 'amber'],
    ['Họp định kỳ Ban quản lý', 'Nội bộ', 'Phòng họp A2', '14:00 - 15:00', 'Chờ xác nhận', 'amber'],
    ['Trao đổi giải pháp an ninh', 'Có khách', 'Phòng họp B2', '16:00 - 17:00', 'Đã kết thúc', 'slate'],
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ['108', 'Nhân sự đang có mặt', 'groups', 'emerald'],
          ['8', 'Cuộc họp hôm nay', 'calendar_month', 'rose'],
          ['6', 'Tổng vi phạm', 'shield', 'indigo'],
          ['10', 'Yêu cầu chờ xử lý', 'task', 'cyan'],
        ].map(([v, l, i, c]) => (
          <div key={l} className={`card p-5 border-t-4 ${c === 'emerald' ? 'border-t-emerald-500' : c === 'rose' ? 'border-t-rose-400' : c === 'indigo' ? 'border-t-indigo-500' : 'border-t-cyan-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{l}</p>
                <p className="mt-1.5 text-2xl font-bold text-slate-900">{v}</p>
              </div>
              <span className={`material-symbols-outlined rounded-xl p-2.5 text-xl ${c === 'emerald' ? 'bg-emerald-50 text-emerald-600' : c === 'rose' ? 'bg-rose-50 text-rose-500' : c === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-cyan-50 text-cyan-600'}`}>
                {i}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Violations table */}
      <section className="card overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Vi phạm gần đây
            </h2>
            <span className="text-xs text-slate-400">Ghi nhận tự động từ cổng kiểm soát</span>
          </div>
          <Link to="/danh-sach-vi-pham" className="text-xs font-semibold text-blue-600">Xem tất cả →</Link>
        </header>
        <table className="w-full text-left">
          <thead>
            <tr className="table-header">
              <th className="px-6 py-3">Thời gian</th>
              <th className="px-6 py-3">Tên nhân viên</th>
              <th className="px-6 py-3">Hành vi vi phạm</th>
              <th className="px-6 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {violations.map(x => (
              <tr key={x[0]} className="text-sm hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-500">{x[0]}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{x[1]}</p>
                  <p className="text-xs text-slate-400">{x[2]}</p>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">{x[3]}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${x[5] === 'rose' ? 'border-rose-200 bg-rose-50 text-rose-700' : x[5] === 'amber' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {x[4]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Requests + Meetings */}
      <div className="grid gap-5 xl:grid-cols-2">
        {/* Requests */}
        <section className="card p-5">
          <header className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              Yêu cầu chờ xử lý
            </h2>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">22 chờ duyệt</span>
          </header>
          <div className="space-y-2">
            {requests.map(x => (
              <Link to="/qu-n-l-phi-u" key={x[1]} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:border-blue-300 hover:bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined rounded-lg bg-white p-2 text-[18px] text-blue-600 shadow-sm border border-slate-100">{x[0]}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{x[1]}</p>
                    <p className="text-xs text-slate-400">{x[2]}</p>
                  </div>
                </div>
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{x[3]}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Meetings */}
        <section className="card p-5">
          <header className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              Lịch họp hôm nay
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>📅 21/10/2024</span>
              <span className="rounded-full bg-blue-100 px-2.5 py-1 font-semibold text-blue-700">4 cuộc họp</span>
            </div>
          </header>
          <div className="space-y-2">
            {meetings.map(x => (
              <Link to="/lich-hop" key={x[0]} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition hover:border-blue-300 hover:bg-blue-50/30">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {x[0]}
                    <span className={`ml-2 rounded-md px-2 py-0.5 text-[10px] font-semibold ${x[1] === 'Nội bộ' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}>{x[1]}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">📍 {x[2]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">{x[3]}</p>
                  <p className={`mt-0.5 text-xs ${x[5] === 'emerald' ? 'text-emerald-600' : x[5] === 'amber' ? 'text-amber-600' : 'text-slate-400'}`}>● {x[4]}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4 text-right">
            <Link to="/lich-hop" className="text-xs font-semibold text-blue-600">Xem lịch tuần →</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { role } = useRole();

  if (role === 'ADMIN') return <Navigate to="/c-u-h-nh-audit-log" replace />;

  return (
    <div className="space-y-4">
      {role === 'EMPLOYEE' ? <EmployeeDashboard /> : (role === 'MANAGER' || role === 'HR') ? <ManagerDashboard /> : <AdminDashboard />}
    </div>
  );
}
