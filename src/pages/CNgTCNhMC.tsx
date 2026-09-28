import { useState } from 'react';
import { useRole } from '../context/RoleContext';

const rows = [
  { type: 'Công tác dài ngày', from: 'Văn phòng chính (Hà Nội)', to: 'Hà Nội (Trụ sở Cầu Giấy)', date: '21/09/2026 → 25/09/2026', sub: '(5 ngày làm việc)', reason: 'Bàn giao hệ thống & đào tạo Q3', status: 'Chờ duyệt', tone: 'blue' },
  { type: 'Công tác liên văn phòng', from: 'Trụ sở chính Hà Nội', to: 'TP. Hồ Chí Minh (VP Quận 1)', date: '15/11/2026 → 16/11/2026', sub: '(2 ngày)', reason: 'Kiểm toán nội bộ & rà soát Q4', status: 'Chờ duyệt', tone: 'violet' },
  { type: 'Công tác trong ngày', from: 'Văn phòng Hà Nội', to: 'Bắc Ninh (Nhà máy KCN Quế Võ)', date: '28/09/2026', sub: '(Trong ngày: 08:00 - 17:30)', reason: 'Khảo sát máy quét thẻ nhân sự xưởng', status: 'Đã duyệt', tone: 'sky' }
];

export default function CNgTCNhMC() {
  useRole();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('Tất cả (3)');
  const [category, setCategory] = useState('Tất cả loại');
  const [items, setItems] = useState(rows);
  const [detail, setDetail] = useState<(typeof rows)[number] | null>(null);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">Công tác & Đề xuất</h1>
            <span className="badge-blue">{items.length} đề xuất</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Quản lý và tạo mới các đề xuất đi công tác</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Đề xuất công tác
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="stat-card border-l-4 border-l-amber-500">
          <div>
            <p className="text-2xl font-bold text-slate-900">2</p>
            <p className="mt-0.5 text-xs text-slate-500">Chờ duyệt</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-amber-50 p-2.5 text-xl text-amber-600">hourglass_empty</span>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <div>
            <p className="text-2xl font-bold text-slate-900">1</p>
            <p className="mt-0.5 text-xs text-slate-500">Đã duyệt thành công</p>
          </div>
          <span className="material-symbols-outlined rounded-xl bg-emerald-50 p-2.5 text-xl text-emerald-600">check_circle</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="card flex flex-col overflow-hidden">
        {/* Filters */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {['Tất cả (3)', 'Chờ duyệt (2)', 'Đã duyệt (1)', 'Từ chối (0)'].map(x => (
                <button
                  key={x}
                  onClick={() => setTab(x)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${tab === x ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {x}
                </button>
              ))}
            </div>
            <button onClick={() => { setTab('Tất cả (3)'); setCategory('Tất cả loại'); }} className="text-xs font-medium text-slate-400 hover:text-slate-600">
              ↻ Đặt lại bộ lọc
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-600">Phân loại:</span>
            {['Tất cả loại', 'Công tác trong ngày', 'Công tác dài ngày', 'Công tác liên văn phòng'].map(x => (
              <button
                key={x}
                onClick={() => setCategory(x)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${category === x ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[250px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">search</span>
              <input className="form-input pl-9" placeholder="Tìm kiếm theo nơi đi, nơi đến, lý do..." />
            </div>
            <input type="date" className="form-input w-auto" />
            <button className="btn-secondary">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3">STT</th>
                <th className="px-5 py-3">Loại công tác</th>
                <th className="px-5 py-3">Nơi đi</th>
                <th className="px-5 py-3">Nơi đến</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3">Lý do</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((x, i) => (
                <tr key={`${x.type}-${i}`} className="text-sm transition hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-500">{i + 1}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${x.tone === 'violet' ? 'badge-purple' : x.tone === 'sky' ? 'badge-blue' : 'badge-slate'}`}>
                      {x.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">{x.from}</td>
                  <td className="px-5 py-4 font-medium text-slate-700">✈ {x.to}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{x.date}</p>
                    <p className="text-xs text-slate-400">{x.sub}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{x.reason}</td>
                  <td className="px-5 py-4">
                    <span className={`badge ${x.status === 'Đã duyệt' ? 'badge-green' : 'badge-amber'}`}>
                      {x.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-1">
                      <button title="Xem chi tiết" onClick={() => setDetail(x)} className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button title="Chỉnh sửa" onClick={() => setOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button title="Xóa" onClick={() => setItems(v => v.filter((_, index) => index !== i))} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs text-slate-500">
          <span>Hiển thị 1 - {items.length} trên tổng số {items.length} đề xuất</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 font-bold text-white">1</span>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) setDetail(null) }}>
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-bold text-slate-900">Chi tiết đề xuất công tác</h2>
              <button onClick={() => setDetail(null)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Loại</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.type}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Trạng thái</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    <span className={`badge ${detail.status === 'Đã duyệt' ? 'badge-green' : 'badge-amber'}`}>{detail.status}</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Nơi đi</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.from}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Nơi đến</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.to}</p>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Thời gian</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.date}</p>
                </div>
                <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500">Lý do</p>
                  <p className="mt-1 font-semibold text-slate-900">{detail.reason}</p>
                </div>
              </div>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button onClick={() => setDetail(null)} className="btn-secondary">Đóng</button>
            </footer>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <form onSubmit={e => { e.preventDefault(); setOpen(false) }} className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl animate-scale-in">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Đề xuất công tác</h2>
                <p className="mt-0.5 text-xs text-slate-500">Điền thông tin chuyến công tác</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </header>
            <div className="space-y-4 p-6">
              <label className="form-label">Loại công tác <span className="text-red-500">*</span>
                <select className="form-input mt-1.5">
                  <option>Công tác trong ngày</option>
                  <option>Công tác dài ngày</option>
                  <option>Công tác liên văn phòng</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="form-label">Nơi đi <span className="text-red-500">*</span>
                  <input required className="form-input mt-1.5" />
                </label>
                <label className="form-label">Điểm đến / Nơi đến <span className="text-red-500">*</span>
                  <input required className="form-input mt-1.5" />
                </label>
                <label className="form-label">Từ ngày / giờ <span className="text-red-500">*</span>
                  <input required type="datetime-local" className="form-input mt-1.5" />
                </label>
                <label className="form-label">Đến ngày / giờ <span className="text-red-500">*</span>
                  <input required type="datetime-local" className="form-input mt-1.5" />
                </label>
              </div>
              <label className="form-label">Lý do / Mục đích công tác <span className="text-red-500">*</span>
                <textarea required rows={3} className="form-input mt-1.5 resize-none" />
              </label>
              <label className="form-label">Chuyển xử lý (Người duyệt) <span className="text-red-500">*</span>
                <select className="form-input mt-1.5">
                  <option>Chọn người xử lý / Người duyệt</option>
                </select>
              </label>
            </div>
            <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
              <button type="button" onClick={() => setOpen(false)} className="btn-secondary">Hủy</button>
              <button type="submit" className="btn-primary">
                <span className="material-symbols-outlined text-[16px]">send</span>
                Gửi đề xuất
              </button>
            </footer>
          </form>
        </div>
      )}
    </div>
  );
}
