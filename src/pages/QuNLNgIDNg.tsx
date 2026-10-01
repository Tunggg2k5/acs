import { useMemo, useState } from "react";
type Account = {
  id: number;
  name: string;
  email: string;
  dept: string;
  title: string;
  date: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Từ chối" | "Đã khóa";
};
const seed: Account[] = [
  {
    id: 1,
    name: "Trần Thị Lan",
    email: "lan.tt@acs.vn",
    dept: "Phòng Nhân sự",
    title: "Chuyên viên Tuyển dụng",
    date: "24/10/2024 08:30",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    name: "Hoàng Văn Quân",
    email: "quan.hv@acs.vn",
    dept: "Ban Công nghệ (IT)",
    title: "Phó phòng Hạ tầng",
    date: "24/10/2024 09:15",
    status: "Chờ duyệt",
  },
  {
    id: 3,
    name: "Đỗ Đức Mạnh",
    email: "manh.dd@acs.vn",
    dept: "Ban Vận hành & An ninh",
    title: "Kỹ thuật viên Tòa nhà",
    date: "23/10/2024 16:40",
    status: "Chờ duyệt",
  },
  {
    id: 4,
    name: "Lê Thu Hà",
    email: "ha.lt@acs.vn",
    dept: "Ban Công nghệ (IT)",
    title: "UI/UX Designer",
    date: "22/10/2024 10:00",
    status: "Đã duyệt",
  },
  {
    id: 5,
    name: "Vũ Minh Tuấn",
    email: "tuan.vm@acs.vn",
    dept: "Phòng Kinh doanh",
    title: "Thực tập sinh",
    date: "21/10/2024 14:20",
    status: "Từ chối",
  },
  {
    id: 6,
    name: "Nguyễn Tuấn Kiên",
    email: "kien.nt@acs.vn",
    dept: "Ban Công nghệ (IT)",
    title: "Kỹ sư mạng",
    date: "15/05/2023",
    status: "Đã khóa",
  },
];
const color = (s: Account["status"]) =>
  s === "Chờ duyệt"
    ? "border-amber-200 bg-amber-50 text-amber-600"
    : s === "Đã duyệt"
      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
      : s === "Từ chối"
        ? "border-rose-200 bg-rose-50 text-rose-600"
        : "border-slate-200 bg-slate-100 text-slate-500";
export default function QuNLNgIDNg() {
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("Tất cả phòng ban");
  const [status, setStatus] = useState("Chờ duyệt (4)");
  const [selected, setSelected] = useState<Account | null>(null);
  const [modalMode,setModalMode]=useState<'approve'|'edit'>('approve');
  const visible = useMemo(
    () =>
      rows.filter(
        (x) =>
          `${x.name} ${x.email}`.toLowerCase().includes(q.toLowerCase()) &&
          (dept === "Tất cả phòng ban" || x.dept === dept) &&
          (status.startsWith("Chờ duyệt") ? true : x.status === status),
      ),
    [rows, q, dept, status],
  );
  const update = (s: Account["status"]) => {
    if (!selected) return;
    setRows((v) =>
      v.map((x) => (x.id === selected.id ? { ...x, status: s } : x)),
    );
    setSelected(null);
  };
  return (
    <div className="min-h-full space-y-6 bg-[#f7f9fc] p-8">
      <h1 className="text-3xl font-bold">Duyệt tài khoản & Phân quyền</h1>
      <div className="flex gap-3 rounded-2xl border bg-white p-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="form-input max-w-sm"
          placeholder="Tìm kiếm theo tên, email, mã nhân viên..."
        />
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="form-input max-w-[280px]"
        >
          <option>Tất cả phòng ban</option>
          {[...new Set(rows.map((x) => x.dept))].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form-input max-w-[190px]"
        >
          <option>Chờ duyệt (4)</option>
          <option>Đã duyệt</option>
          <option>Từ chối</option>
          <option>Đã khóa</option>
        </select>
        <button
          onClick={() => {
            setQ("");
            setDept("Tất cả phòng ban");
            setStatus("Chờ duyệt (4)");
          }}
          className="ml-auto h-9 w-9 rounded-full border"
        >
          ↻
        </button>
      </div>
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <header className="flex justify-between border-b px-5 py-4">
          <b>Danh sách tài khoản đăng ký</b>
          <button className="btn-secondary">⇩ Xuất danh sách</button>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {[
                  "Họ và tên",
                  "Email / Account",
                  "Phòng ban",
                  "Chức vụ",
                  "Ngày đăng ký",
                  "Trạng thái",
                  "Thao tác",
                ].map((x) => (
                  <th key={x} className="px-4 py-3">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.map((x) => (
                <tr key={x.id} tabIndex={x.status==='Chờ duyệt'?0:undefined} role={x.status==='Chờ duyệt'?'button':undefined} onClick={()=>{if(x.status==='Chờ duyệt'){setSelected(x);setModalMode('approve')}}} onKeyDown={e=>{if(x.status==='Chờ duyệt'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setSelected(x);setModalMode('approve')}}} className={`text-sm ${x.status==='Chờ duyệt'?'cursor-pointer hover:bg-blue-50/60 focus:bg-blue-50 focus:outline-none':''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                        {x.name
                          .split(" ")
                          .slice(-2)
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <b>{x.name}</b>
                    </div>
                  </td>
                  <td className="px-4 py-4">{x.email}</td>
                  <td className="px-4 py-4 text-slate-600">{x.dept}</td>
                  <td className="px-4 py-4 text-slate-600">{x.title}</td>
                  <td className="px-4 py-4 text-slate-500">{x.date}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${color(x.status)}`}
                    >
                      {x.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {x.status === "Chờ duyệt" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {e.stopPropagation();setSelected(x);setModalMode('approve')}}
                          className="h-9 w-9 rounded-lg bg-blue-600 font-bold text-white"
                        >
                          ✓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRows((v) =>
                              v.map((r) =>
                                r.id === x.id ? { ...r, status: "Từ chối" } : r,
                              ),
                            );
                          }}
                          className="h-9 w-9 rounded-lg border border-rose-200 text-rose-500"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {e.stopPropagation();setSelected(x);setModalMode('edit')}}
                        className="btn-secondary"
                      >
                        ✎ Chỉnh sửa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="flex justify-between border-t px-5 py-4 text-xs text-slate-500">
          <span>Đang xem 1 - {visible.length} trong tổng số 47 bản ghi</span>
          <span>
            Trước　<b className="rounded bg-blue-600 px-3 py-2 text-white">1</b>
            　2　3　Sau
          </span>
        </footer>
      </section>
      {selected && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4"
        >
          <section className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <header className="flex justify-between border-b p-6">
              <div>
                <h2 className="flex items-center gap-3 text-xl font-bold"><span className="material-symbols-outlined rounded-lg bg-blue-50 p-2 text-blue-600">manage_accounts</span>Cài đặt tài khoản</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Cập nhật hồ sơ thông tin và phân quyền ra vào của nhân viên
                </p>
              </div>
              <button onClick={() => setSelected(null)}>✕</button>
            </header>
            <form id="account-settings" onSubmit={e=>{e.preventDefault();modalMode==='approve'?update('Đã duyệt'):setSelected(null)}} className="space-y-6 p-7">
              <div className="grid grid-cols-2 gap-6 rounded-2xl border bg-slate-50 p-5">
                <div><span className="form-label">Ảnh đại diện</span><div className="mt-2 flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">{selected.name.split(' ').slice(-2).map(x=>x[0]).join('')}</div></div>
                <div><span className="form-label">Ảnh CMND/CCCD</span><div className="mt-2 flex h-20 w-28 flex-col items-center justify-center rounded-xl border bg-white text-xs text-slate-500"><span className="material-symbols-outlined">badge</span>001186040007</div></div>
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <label>
                  <span className="form-label">Họ và tên</span>
                  <input disabled defaultValue={selected.name} className="form-input bg-slate-100 text-slate-500" />
                </label>
                <label>
                  <span className="form-label">Email</span>
                  <input defaultValue={selected.email} className="form-input" />
                </label>
                <label><span className="form-label">Số điện thoại</span><input disabled defaultValue="0772350268" className="form-input bg-slate-100 text-slate-500"/></label>
                <label><span className="form-label">Số CCCD</span><input disabled defaultValue="001186040007" className="form-input bg-slate-100 text-slate-500"/></label>
                <label><span className="form-label">Tên tài khoản valley</span><input disabled defaultValue={`BOS_${selected.email.split('@')[0].replace('.','')}`} className="form-input bg-slate-100 text-slate-500"/></label>
                <label><span className="form-label">Ngày sinh</span><input disabled type="date" defaultValue="1986-08-17" className="form-input bg-slate-100 text-slate-500"/></label>
                <label><span className="form-label">Ngày cấp CCCD</span><input disabled type="date" defaultValue="2026-05-26" className="form-input bg-slate-100 text-slate-500"/></label>
                <label><span className="form-label">Giới tính</span><div className="form-input flex items-center gap-4 bg-slate-100 text-slate-500"><label><input disabled type="radio" name="gender" defaultChecked/> Nam</label><label><input disabled type="radio" name="gender"/> Nữ</label></div></label>
                <label className="lg:col-span-4"><span className="form-label">Địa chỉ</span><input disabled defaultValue="SN78A ngõ 3 Xuân Phương, Nam Từ Liêm, HN" className="form-input bg-slate-100 text-slate-500"/></label>
                <label><span className="form-label">Trạng thái</span><select className="form-input" defaultValue={selected.status==='Chờ duyệt'?'Đang hoạt động':selected.status}><option>Đang hoạt động</option><option>Đã khóa</option></select></label>
                <label><span className="form-label">Cấp phép ra vào</span><select className="form-input"><option>Cho phép ra vào</option><option>Từ chối ra vào</option></select></label>
                <label><span className="form-label">Nhóm quyền</span><select className="form-input"><option>chưa chọn</option><option>Nhân viên</option><option>Quản lý</option></select></label>
                <button type="button" onClick={()=>window.alert('Mở cấu hình phân quyền cửa')} className="form-input mt-5 flex items-center justify-between bg-white font-semibold">▥ Phân quyền cửa (0)<span>›</span></button>
                <label>
                  <span className="form-label">Phòng ban</span>
                  <select className="form-input" defaultValue={selected.dept}>
                    <option>{selected.dept}</option>
                    <option>Phòng Nhân sự</option>
                    <option>Ban Công nghệ (IT)</option>
                  </select>
                </label>
                <label>
                  <span className="form-label">Chức vụ/Chức danh</span>
                  <select className="form-input" defaultValue={selected.title}><option>{selected.title}</option><option>Chuyên viên</option><option>Trưởng phòng</option></select>
                </label>
                <label><span className="form-label">Vị trí làm việc</span><select className="form-input"><option>chưa chọn</option><option>Văn phòng Hà Nội</option><option>Chi nhánh TP.HCM</option></select></label>
                <button type="button" onClick={()=>window.alert('Đã thêm cấu hình phụ')} className="mt-5 h-11 rounded-lg border bg-slate-50 text-2xl text-slate-600">＋</button>
              </div>
            </form>
            <footer className="flex gap-3 border-t bg-slate-50 p-5">{modalMode==='approve'?<><button onClick={()=>update('Từ chối')} className="btn-secondary">Từ chối</button><button type="submit" form="account-settings" className="btn-primary">Duyệt</button></>:<><button onClick={()=>setSelected(null)} className="btn-secondary">Đóng</button><button type="submit" form="account-settings" className="btn-primary">Lưu thay đổi</button></>}</footer>
          </section>
        </div>
      )}
    </div>
  );
}
