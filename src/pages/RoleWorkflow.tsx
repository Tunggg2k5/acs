import { useState } from 'react';

type Permission = 'checked' | 'unchecked' | 'level1View' | 'level1Edit' | 'level2';

type MatrixRow = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  employee: Permission;
  manager: Permission;
  hr: Permission;
  admin: Permission;
};

const INITIAL_MATRIX: MatrixRow[] = [
  { id:'p1', icon:'bar_chart', title:'Tổng quan', desc:'Tra cứu số liệu điều hành, dashboard tổng thể', employee:'checked',manager:'checked',hr:'checked',admin:'level2'},
  { id:'p2', icon:'login', title:'Nhật ký ra vào', desc:'Lịch sử check-in/out thực tế, máy chấm công & FaceID', employee:'level1View',manager:'level1View',hr:'level2',admin:'level2'},
  { id:'p3', icon:'table_chart', title:'Bảng công', desc:'Tổng hợp ngày công, giờ làm và tính công', employee:'level1View',manager:'level1Edit',hr:'level2',admin:'level2'},
  { id:'p4', icon:'calendar_month', title:'Lịch làm việc', desc:'Theo dõi ca làm việc, phân lịch tuần/tháng', employee:'checked',manager:'checked',hr:'checked',admin:'level2'},
  { id:'p5', icon:'request_quote', title:'Phiếu & Đơn từ', desc:'Tạo và duyệt các loại đơn xin phép, giải trình, đổi ca', employee:'checked',manager:'level1Edit',hr:'level2',admin:'level2'},
  { id:'p6', icon:'groups', title:'Danh sách nhân viên', desc:'Quản lý hồ sơ nhân sự, phòng ban, chức vụ', employee:'unchecked',manager:'level1View',hr:'level2',admin:'level2'},
  { id:'p7', icon:'settings', title:'Quản lý người dùng / tổ chức / cấu hình', desc:'Cấu hình hệ thống, tài khoản và cơ cấu tổ chức', employee:'unchecked',manager:'unchecked',hr:'unchecked',admin:'level2'},
  { id:'p8', icon:'event', title:'Lịch họp', desc:'Xem lịch, phòng họp và danh sách người tham gia', employee:'checked',manager:'checked',hr:'checked',admin:'level2'},
  { id:'p9', icon:'assignment_turned_in', title:'Danh sách công việc', desc:'Theo dõi và cập nhật tiến độ công việc cá nhân/phòng ban', employee:'checked',manager:'checked',hr:'checked',admin:'level2'},
  { id:'p10', icon:'format_list_bulleted', title:'Quản lý nhiệm vụ', desc:'Giao việc, điều phối và giám sát nhiệm vụ trọng tâm', employee:'unchecked',manager:'level1Edit',hr:'unchecked',admin:'level2'},
  { id:'p11', icon:'warning_amber', title:'Danh sách vi phạm', desc:'Ghi nhận và xử lý vi phạm đi muộn, về sớm, nghỉ sai quy định', employee:'level1View',manager:'level1Edit',hr:'level2',admin:'level2'},
  { id:'p12', icon:'history', title:'Xem Audit Log', desc:'Theo dõi lịch sử truy cập, thay đổi dữ liệu hệ thống và bảng công', employee:'unchecked',manager:'unchecked',hr:'unchecked',admin:'level2'},
];

type MatrixState = Record<string, { employee: Permission; manager: Permission; hr: Permission; admin: Permission }>;

const initState = (): MatrixState => {
  const s: MatrixState = {};
  INITIAL_MATRIX.forEach(r => { s[r.id] = { employee: r.employee, manager: r.manager, hr:r.hr, admin: r.admin }; });
  return s;
};

export default function RoleWorkflow() {
  const [matrix, setMatrix] = useState<MatrixState>(initState());
  const [saved, setSaved] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggle = (id: string, col: 'employee' | 'manager' | 'hr' | 'admin') => {
    setMatrix(prev => {
      const cur = prev[id][col];
      let next: Permission;
      
      if (cur === 'unchecked') next = 'checked';
      else if (cur === 'checked') next = 'level1View';
      else if (cur === 'level1View') next = 'level1Edit';
      else if (cur === 'level1Edit') next = 'level2';
      else next = 'unchecked';

      return { ...prev, [id]: { ...prev[id], [col]: next } };
    });
    setSaved(false);
  };

  const handleApply = () => {
    setSaved(true);
    setActiveModal('saved');
    setTimeout(() => setActiveModal(null), 2000);
  };

  const handleReset = () => {
    setMatrix(initState());
    setSaved(false);
  };

  const CellContent = ({ perm }: { perm: Permission }) => {
    if (perm === 'checked') return (
      <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center mx-auto shadow-sm">
        <span className="material-symbols-outlined text-white text-sm">check</span>
      </div>
    );
    if (perm === 'unchecked') return (
      <div className="w-6 h-6 rounded border-2 border-slate-200 bg-slate-50 mx-auto" />
    );
    if (perm === 'level1View') return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-blue-300 text-blue-600 bg-blue-50 text-xs font-semibold mx-auto">
        <span className="material-symbols-outlined text-sm">visibility</span>Cấp 1 xem
      </div>
    );
    if (perm === 'level1Edit') return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-indigo-300 text-indigo-600 bg-indigo-50 text-xs font-semibold mx-auto">
        <span className="material-symbols-outlined text-sm">edit</span>Cấp 1 chỉnh sửa
      </div>
    );
    if (perm === 'level2') return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold mx-auto shadow-sm">
        <span className="material-symbols-outlined text-sm">verified</span>Cấp 2 / Toàn quyền
      </div>
    );
    return null;
  };

  const roleColumns = [
    { key: 'employee' as const, label: 'Nhân viên', sub: 'Employee', count: '128 tv', color: 'text-slate-700' },
    { key: 'manager' as const, label: 'Quản lý', sub: 'Manager', count: '14 tv', color: 'text-indigo-700' },
    { key: 'hr' as const, label: 'Nhân sự (HR)', sub: 'HR Role', count: '4 tv', color: 'text-emerald-700' },
    { key: 'admin' as const, label: 'Quản trị viên', sub: 'Admin', count: '2 tv', color: 'text-blue-700' },
  ];

  return (
    <div className="flex flex-col w-full gap-6 p-6 bg-[#F8FAFC] min-h-screen relative">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Role</h1>
          <p className="mt-1 text-sm text-slate-500">Cấu hình phân quyền chức năng theo từng vai trò trong hệ thống ACS</p>
        </div>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
          <span className="material-symbols-outlined text-[18px]">add</span>Thêm vai trò
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>Đã lưu thay đổi
          </span>
        )}
      </div>

      {/* Role column headers info */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {roleColumns.map(col => (
          <div key={col.key} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${col.key === 'admin' ? 'bg-blue-600' : col.key === 'manager' ? 'bg-indigo-500' : col.key==='hr'?'bg-emerald-600':'bg-slate-400'}`}>
              {col.key === 'admin' ? 'A' : col.key === 'manager' ? 'M' : col.key==='hr'?'HR':'E'}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-bold ${col.color}`}>{col.label}</div>
              <div className="text-xs text-slate-500">{col.sub}</div>
            </div>
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600">{col.count}</span>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-blue-600">grid_view</span>
          <h2 className="text-sm font-bold text-slate-900">Ma trận phân quyền chức năng</h2>
          <span className="ml-auto text-xs text-slate-400">Nhấn vào ô để thay đổi quyền</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3.5 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/2">Chức năng / Module nghiệp vụ</th>
                {roleColumns.map(col => (
                  <th key={col.key} className="py-3.5 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-l border-slate-200">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_MATRIX.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-blue-600 text-[20px]">{row.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{row.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{row.desc}</div>
                      </div>
                    </div>
                  </td>
                  {(['employee', 'manager', 'hr', 'admin'] as const).map(col => (
                    <td key={col} className="py-4 px-4 text-center border-l border-slate-100">
                      <button
                        type="button"
                        onClick={() => toggle(row.id, col)}
                        className="flex items-center justify-center w-full min-h-[40px] hover:scale-110 transition-transform focus:outline-none relative group"
                        title={`Thay đổi quyền cho ${col}`}
                      >
                        <CellContent perm={matrix[row.id]?.[col] ?? 'unchecked'} />
                        <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">Nhấn để đổi quyền</span>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Actions */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex flex-wrap items-center gap-6">
          <span className="text-sm font-bold text-slate-700">Chú giải:</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xs">check</span>
            </div>
            <span className="text-sm text-slate-600">Có quyền</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border-2 border-slate-200 bg-slate-50" />
            <span className="text-sm text-slate-600">Không có quyền</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-300 text-blue-600 bg-blue-50 text-xs font-semibold">Cấp 1 xem</div>
            <span className="text-sm text-slate-600">Chỉ xem</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-indigo-300 text-indigo-600 bg-indigo-50 text-xs font-semibold">Cấp 1 chỉnh sửa</div>
            <span className="text-sm text-slate-600">Xem và chỉnh sửa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold">Cấp 2</div>
            <span className="text-sm text-slate-600">Toàn quyền</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Khôi phục mặc định
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Áp dụng thay đổi
          </button>
        </div>
      </div>

      {/* Success toast */}
      {activeModal === 'saved' && (
        <div className="fixed bottom-6 right-6 z-50 bg-white shadow-xl px-6 py-4 flex items-center gap-4 rounded-xl border border-slate-200 border-l-4 border-l-emerald-500 animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-emerald-500 text-[28px]">check_circle</span>
          <div>
            <div className="text-sm font-bold text-slate-900">Áp dụng thành công</div>
            <div className="text-xs text-slate-500">Ma trận phân quyền đã được cập nhật.</div>
          </div>
        </div>
      )}
    </div>
  );
}
