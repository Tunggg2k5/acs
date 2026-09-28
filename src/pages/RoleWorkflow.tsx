import { useState } from 'react';

type Permission = 'checked' | 'unchecked' | 'level1' | 'level2';

type MatrixRow = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  employee: Permission;
  manager: Permission;
  admin: Permission;
};

const INITIAL_MATRIX: MatrixRow[] = [
  { id:'p1', icon:'calendar_month',    title:'Xem lịch làm việc & lịch trực cá nhân',    desc:'Tra cứu phân ca, thời gian làm và chấm công bản thân',         employee:'checked',   manager:'checked',   admin:'checked'   },
  { id:'p2', icon:'group_work',        title:'Xem & phân ca cho phòng ban / team',        desc:'Xếp lịch tuần/tháng theo danh sách nhân sự trực thuộc',         employee:'unchecked', manager:'checked',   admin:'checked'   },
  { id:'p3', icon:'event_available',   title:'Phân công trực ca',                         desc:'Gán nhiệm vụ trực ca lẻ, trực đêm và trực chuyên môn',          employee:'unchecked', manager:'checked',   admin:'checked'   },
  { id:'p4', icon:'assignment_add',    title:'Tự tạo phiếu & khiếu nại công',            desc:'Tạo đơn phép, đề xuất đổi ca hoặc khiếu nại chấm công',         employee:'checked',   manager:'checked',   admin:'checked'   },
  { id:'p5', icon:'approval',          title:'Phê duyệt phiếu công tác / nghỉ phép',     desc:'Phê chuẩn đơn theo phân cấp thẩm quyền quy định',              employee:'unchecked', manager:'level1',    admin:'level2'    },
  { id:'p6', icon:'edit_calendar',     title:'Điều chỉnh chấm công nhân viên',            desc:'Ghi đè giờ vào/ra, bổ sung ngày công bất thường',               employee:'unchecked', manager:'unchecked', admin:'checked'   },
  { id:'p7', icon:'corporate_fare',    title:'Quản trị hệ thống, tổ chức, danh mục',     desc:'Thiết lập phòng ban, điểm máy chấm công, loại ca',              employee:'unchecked', manager:'unchecked', admin:'checked'   },
  { id:'p8', icon:'history',           title:'Xem Audit Log',                             desc:'Theo dõi lịch sử truy cập, thay đổi dữ liệu bảng công',         employee:'unchecked', manager:'unchecked', admin:'checked'   },
];

type MatrixState = Record<string, { employee: Permission; manager: Permission; admin: Permission }>;

const initState = (): MatrixState => {
  const s: MatrixState = {};
  INITIAL_MATRIX.forEach(r => { s[r.id] = { employee: r.employee, manager: r.manager, admin: r.admin }; });
  return s;
};

export default function RoleWorkflow() {
  const [matrix, setMatrix] = useState<MatrixState>(initState());
  const [saved, setSaved] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const toggle = (id: string, col: 'employee' | 'manager' | 'admin') => {
    setMatrix(prev => {
      const cur = prev[id][col];
      let next: Permission;
      
      if (cur === 'unchecked') next = 'checked';
      else if (cur === 'checked') next = 'level1';
      else if (cur === 'level1') next = 'level2';
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
    if (perm === 'level1') return (
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-blue-300 text-blue-600 bg-blue-50 text-xs font-semibold mx-auto">
        <span className="material-symbols-outlined text-sm">approval</span>Cấp 1
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
    { key: 'employee' as const, label: 'Nhân viên', sub: 'Employee (Cấp 3)', color: 'text-slate-700' },
    { key: 'manager' as const, label: 'Quản lý', sub: 'Manager (Cấp 2)', color: 'text-indigo-700' },
    { key: 'admin' as const, label: 'Quản trị viên', sub: 'Admin / HR (Cấp 1)', color: 'text-blue-700' },
  ];

  return (
    <div className="flex flex-col w-full gap-6 p-6 bg-[#F8FAFC] min-h-screen relative">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Role &amp; Workflow</h1>
          <p className="mt-1 text-sm text-slate-500">Cấu hình phân quyền chức năng theo từng vai trò trong hệ thống ACS</p>
        </div>
        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-200">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>Đã lưu thay đổi
          </span>
        )}
      </div>

      {/* Role column headers info */}
      <div className="grid grid-cols-3 gap-4">
        {roleColumns.map(col => (
          <div key={col.key} className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${col.key === 'admin' ? 'bg-blue-600' : col.key === 'manager' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
              {col.key === 'admin' ? 'A' : col.key === 'manager' ? 'M' : 'E'}
            </div>
            <div>
              <div className={`text-sm font-bold ${col.color}`}>{col.label}</div>
              <div className="text-xs text-slate-500">{col.sub}</div>
            </div>
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
                  {(['employee', 'manager', 'admin'] as const).map(col => (
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
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-300 text-blue-600 bg-blue-50 text-xs font-semibold">Cấp 1</div>
            <span className="text-sm text-slate-600">Phê duyệt cấp 1</span>
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
