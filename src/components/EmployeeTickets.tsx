import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  loadTickets,
  saveTickets,
  type SharedTicket,
  type TicketKind,
} from "../data/ticketStore";

export type FormKind = "Công tác" | "Nghỉ phép" | "Khiếu nại" | "Đổi ca";
const control =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500";
const displayStatus = (s: SharedTicket["status"]) =>
  s === "Đã duyệt" ? "Được duyệt" : s === "Từ chối" ? "Bị từ chối" : s;
const statusClass = (s: SharedTicket["status"]) =>
  s === "Đã duyệt"
    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
    : s === "Từ chối"
      ? "border-rose-200 bg-rose-50 text-rose-600"
      : s === "Đã thu hồi"
        ? "border-slate-200 bg-slate-100 text-slate-600"
        : "border-amber-300 bg-amber-50 text-amber-600";
const start = (t: SharedTicket) =>
  t.fields.start ||
  t.fields["Từ ngày"] ||
  t.fields["Ngày giải trình"] ||
  t.createdAt;
const end = (t: SharedTicket) => t.fields.end || t.fields["Đến ngày"];
const period = (t: SharedTicket) =>
  end(t) && end(t) !== start(t) ? `${start(t)} - ${end(t)}` : start(t);
const reason = (t: SharedTicket) =>
  t.fields.reason ||
  t.fields["Lý do"] ||
  t.fields["Nội dung"] ||
  t.fields["Nội dung công việc"] ||
  "Yêu cầu nhân sự";
const mode = (t: SharedTicket) =>
  t.fields.mode ||
  t.fields["Chế độ"] ||
  t.fields["Loại sai lệch"] ||
  t.fields.tripType ||
  "";

export function TicketModal({
  kind,
  onKindChange,
  onClose,
  onSubmit,
  violation,
}: {
  kind: FormKind;
  onKindChange: (k: FormKind) => void;
  onClose: () => void;
  onSubmit: (k: FormKind, f: HTMLFormElement) => void;
  violation?: { id: string; type: string; date: string; detail: string };
}) {
  if (kind === "Khiếu nại")
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(kind, e.currentTarget);
          }}
          className="w-full max-w-[620px] rounded-xl bg-white p-6 shadow-2xl"
        >
          <header className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-blue-900">
              Khiếu nại thời gian làm việc
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl text-slate-400"
            >
              ×
            </button>
          </header>
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-semibold">
              Chọn loại vi phạm
              <input
                name="complaintType"
                readOnly
                value={`${violation?.type || "Đi muộn / Về sớm"} (08:42)`}
                className={`${control} bg-slate-100`}
              />
            </label>
            <label className="block text-sm font-semibold">
              Ngày khiếu nại <span className="text-rose-500">*</span>
              <input
                name="date"
                readOnly
                value={violation?.date || "18/09/2026"}
                className={`${control} bg-slate-100`}
              />
            </label>
            <label className="block text-sm font-semibold">
              Thời gian hệ thống thông báo{" "}
              <span className="text-rose-500">*</span>
              <textarea
                readOnly
                rows={2}
                value="08:42:00 (Đi muộn 12 phút - Ca sáng 08:30)"
                className={`${control} resize-none bg-slate-100`}
              />
            </label>
            <label className="block text-sm font-semibold">
              Thời gian thực tế <span className="text-rose-500">*</span>
              <textarea
                name="actualTime"
                required
                rows={3}
                placeholder="Nhập thời gian thực tế... (Bạn cần ghi rõ địa điểm, khoảng thời gian quẹt thẻ xác nhận.)"
                className={`${control} resize-none`}
              />
            </label>
            <label className="block text-sm font-semibold">
              Lý do <span className="text-rose-500">*</span>
              <textarea
                name="reason"
                required
                rows={3}
                placeholder="Nhập lý do khiếu nại..."
                className={`${control} resize-none`}
              />
            </label>
          </div>
          <footer className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-blue-700 px-7 py-2.5 font-semibold text-blue-800"
            >
              Hủy
            </button>
            <button className="rounded-lg bg-blue-800 px-7 py-2.5 font-semibold text-white">
              Gửi khiếu nại
            </button>
          </footer>
        </form>
      </div>
    );
  const leave = kind === "Nghỉ phép";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(kind, e.currentTarget);
        }}
        className="w-full max-w-[840px] overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between px-7 py-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined rounded-xl bg-blue-50 p-3 text-blue-600">
              {leave ? "flight" : "description"}
            </span>
            <h2 className="text-2xl font-bold">Tạo phiếu mới</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400"
          >
            ×
          </button>
        </header>
        <div className="flex gap-2 border-b px-7">
          <button
            type="button"
            onClick={() => onKindChange("Công tác")}
            className={`px-3 py-3 text-sm ${!leave ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-slate-500"}`}
          >
            ✈　Đề xuất công tác
          </button>
          <button
            type="button"
            onClick={() => onKindChange("Nghỉ phép")}
            className={`px-3 py-3 text-sm ${leave ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-slate-500"}`}
          >
            ▣　Phiếu nghỉ phép
          </button>
        </div>
        <div className="p-7">
          {leave ? (
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase">
                Thông tin nghỉ
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <label className="col-span-2 text-sm">
                  Thời gian nghỉ <span className="text-rose-500">*</span>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <input
                      name="start"
                      required
                      type="datetime-local"
                      className={control}
                    />
                    <span>→</span>
                    <input
                      name="end"
                      required
                      type="datetime-local"
                      className={control}
                    />
                  </div>
                </label>
                <label className="text-sm">
                  Buổi nghỉ <span className="text-rose-500">*</span>
                  <select name="part" className={control}>
                    <option>Cả ngày</option>
                    <option>Buổi sáng</option>
                    <option>Buổi chiều</option>
                  </select>
                </label>
                <label className="col-span-3 text-sm">
                  Chế độ <span className="text-rose-500">*</span>
                  <select name="mode" className={control}>
                    <option>Nghỉ tính phép</option>
                    <option>Nghỉ không lương</option>
                    <option>Nghỉ ốm</option>
                  </select>
                </label>
                <label className="col-span-3 text-sm">
                  Lý do <span className="text-rose-500">*</span>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    placeholder="Nhập lý do nghỉ phép..."
                    className={`${control} resize-none`}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y py-5">
              <label className="text-sm">
                Loại công tác <span className="text-rose-500">*</span>
                <select name="tripType" className={control}>
                  <option>Công tác trong ngày</option>
                  <option>Công tác nhiều ngày</option>
                </select>
              </label>
              <label className="text-sm">
                Phương tiện di chuyển
                <select name="transport" className={control}>
                  <option>Xe công ty đưa đón</option>
                  <option>Tự túc</option>
                </select>
              </label>
              <label className="text-sm">
                Nơi đi <span className="text-rose-500">*</span>
                <input
                  name="from"
                  defaultValue="Văn phòng chính (Hà Nội)"
                  className={control}
                />
              </label>
              <label className="text-sm">
                Điểm đến / Nơi đến <span className="text-rose-500">*</span>
                <input
                  name="to"
                  defaultValue="Bắc Ninh (Nhà máy KCN Quế Võ)"
                  className={control}
                />
              </label>
              <label className="text-sm">
                Từ ngày / giờ <span className="text-rose-500">*</span>
                <input
                  name="start"
                  required
                  type="datetime-local"
                  className={control}
                />
              </label>
              <label className="text-sm">
                Đến ngày / giờ <span className="text-rose-500">*</span>
                <input
                  name="end"
                  required
                  type="datetime-local"
                  className={control}
                />
              </label>
              <label className="col-span-2 text-sm">
                Lý do / Mục đích công tác{" "}
                <span className="text-rose-500">*</span>
                <textarea
                  name="reason"
                  rows={2}
                  defaultValue="Khảo sát máy quét thẻ nhân sự xưởng 2 và kiểm tra đường truyền mạng chấm công nội bộ."
                  className={`${control} resize-none`}
                />
              </label>
            </div>
          )}
        </div>
        <footer className="flex justify-between border-t px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-6 py-2.5 font-semibold text-slate-600"
          >
            Hủy
          </button>
          <button className="rounded-lg bg-blue-600 px-7 py-2.5 font-semibold text-white">
            ➤　{leave ? "Gửi phiếu" : "Gửi đề xuất"}
          </button>
        </footer>
      </form>
    </div>
  );
}

export default function EmployeeTickets({
  ownerName = "Trần Thị Mai",
  ownerDepartment = "Kinh doanh",
}: { ownerName?: string; ownerDepartment?: string } = {}) {
  const [params, setParams] = useSearchParams();
  const violation =
    params.get("create") === "complaint"
      ? {
          id: params.get("violation") || "",
          type: params.get("type") || "",
          date: params.get("date") || "",
          detail: params.get("detail") || "",
        }
      : undefined;
  const [tickets, setTickets] = useState(loadTickets);
  const [kind, setKind] = useState<FormKind | null>(
    violation ? "Khiếu nại" : null,
  );
  const [status, setStatus] = useState("Tất cả");
  const [detail, setDetail] = useState<SharedTicket | null>(null);
  const mine = useMemo(
    () =>
      tickets.filter(
        (t) =>
          t.employee === ownerName &&
          (t.kind === "Nghỉ phép" ||
            t.kind === "Công tác" ||
            t.kind === "Giải trình" ||
            t.kind === "Khiếu nại"),
      ),
    [tickets, ownerName],
  );
  const shown = mine.filter(
    (t) => status === "Tất cả" || displayStatus(t.status) === status,
  );
  const save = (next: SharedTicket[]) => {
    setTickets(next);
    saveTickets(next);
  };
  const submit = (k: FormKind, form: HTMLFormElement) => {
    const data = new FormData(form);
    const fields = Object.fromEntries(
      [...data.entries()]
        .filter(([, v]) => typeof v === "string")
        .map(([key, v]) => [key, String(v)]),
    );
    save([
      {
        id: `PH-${Date.now()}`,
        kind: (k === "Khiếu nại" ? "Giải trình" : k) as TicketKind,
        employee: ownerName,
        status: "Chờ duyệt",
        createdAt: new Date().toLocaleDateString("vi-VN"),
        fields,
      },
      ...tickets,
    ]);
    setKind(null);
    setParams({});
  };
  const recall = (t: SharedTicket) => {
    if (!confirm(`Thu hồi phiếu ${t.id}?`)) return;
    save(
      tickets.map((x) => (x.id === t.id ? { ...x, status: "Đã thu hồi" } : x)),
    );
  };
  const pending = mine.filter((t) => t.status === "Chờ duyệt").length,
    approved = mine.filter((t) => t.status === "Đã duyệt").length,
    rejected = mine.filter((t) => t.status === "Từ chối").length;
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between rounded-2xl border bg-white px-6 py-3.5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Phiếu & Đơn từ</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi phiếu nghỉ phép và đề xuất của bạn
          </p>
        </div>
        <button
          onClick={() => setKind("Công tác")}
          className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
        >
          ＋　Tạo phiếu mới
        </button>
      </header>
      <div className="grid grid-cols-3 gap-5">
        {[
          [pending, "CHỜ DUYỆT", "amber"],
          [approved, "ĐƯỢC DUYỆT", "emerald"],
          [rejected, "BỊ TỪ CHỐI / HỦY", "rose"],
        ].map(([v, l, c]) => (
          <div
            key={String(l)}
            className={`flex h-[88px] items-center gap-5 rounded-xl border-l-[6px] bg-white p-5 shadow-sm ${c === "amber" ? "border-amber-400" : c === "emerald" ? "border-emerald-500" : "border-rose-500"}`}
          >
            <span
              className={`material-symbols-outlined rounded-xl p-3 ${c === "amber" ? "bg-amber-50 text-amber-500" : c === "emerald" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}
            >
              schedule
            </span>
            <b className="text-2xl">
              {v} <small className="text-xs text-slate-500">{l}</small>
            </b>
          </div>
        ))}
      </div>
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3 text-xs">
            <b>Trạng thái:</b>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-44 rounded-lg border px-3 py-2"
            >
              <option>Tất cả</option>
              <option>Chờ duyệt</option>
              <option>Được duyệt</option>
              <option>Bị từ chối</option>
              <option>Đã thu hồi</option>
            </select>
            <b>Thời gian:</b>
            <input type="date" className="rounded-lg border px-3 py-2" />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-[#1d4384] text-[11px] uppercase text-white">
            <tr>
              {[
                "STT",
                "Loại phiếu / Chế độ",
                "Thời gian",
                "Lý do",
                "Trạng thái",
              ].map((x) => (
                <th key={x} className="px-6 py-4">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {shown.map((t, i) => (
              <tr
                key={t.id}
                tabIndex={0}
                onClick={() => setDetail(t)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDetail(t);
                  }
                }}
                className="cursor-pointer text-sm hover:bg-blue-50/40 focus:bg-blue-50/40 focus:outline-none"
              >
                <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                <td className="px-6 py-4">
                  <b>
                    {t.kind === "Công tác"
                      ? "Đề xuất"
                      : t.kind === "Giải trình" || t.kind === "Khiếu nại"
                        ? "Khiếu nại"
                        : t.kind}
                  </b>
                  <p className="mt-1 text-xs text-slate-400">{mode(t)}</p>
                </td>
                <td className="px-6 py-4">{period(t)}</td>
                <td className="px-6 py-4 text-slate-600">{reason(t)}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs ${statusClass(t.status)}`}
                  >
                    {displayStatus(t.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <footer className="flex justify-end gap-2 border-t p-4">
          <button className="rounded border px-3 text-slate-300">‹</button>
          <button className="rounded border border-blue-600 px-3 py-1 text-blue-600">
            1
          </button>
          <button className="rounded border px-3 text-slate-300">›</button>
        </footer>
      </section>
      {kind && (
        <TicketModal
          kind={kind}
          onKindChange={setKind}
          onClose={() => {
            setKind(null);
            setParams({});
          }}
          onSubmit={submit}
          violation={violation}
        />
      )}{" "}
      {detail && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDetail(null);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/55 p-4"
        >
          <section className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between border-b px-6 py-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">
                    {detail.kind === "Công tác"
                      ? "Chi tiết đề xuất công tác"
                      : detail.kind === "Giải trình" ||
                          detail.kind === "Khiếu nại"
                        ? "Chi tiết khiếu nại thời gian"
                        : "Chi tiết yêu cầu nghỉ phép"}
                  </h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${statusClass(detail.status)}`}
                  >
                    {displayStatus(detail.status)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold">{ownerName}</p>
                <p className="text-xs text-slate-500">
                  Phòng ban: {ownerDepartment}　•　Chức vụ: Nhân viên chính thức
                </p>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="p-6">
              <h3 className="mb-4 border-l-4 border-blue-600 pl-3 text-sm font-bold uppercase">
                Thông tin phiếu
              </h3>
              {detail.kind === "Công tác" ? (
                <div className="rounded-2xl border bg-slate-50 p-5">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <TicketInfo label="Loại phiếu" value="Đề xuất" blue />
                    <TicketInfo
                      label="Loại đề xuất"
                      value={detail.fields.tripType || "Công tác trong ngày"}
                    />
                    <TicketInfo
                      label="Phương tiện"
                      value={detail.fields.transport || "Xe công ty đưa đón"}
                    />
                  </div>
                  <div className="my-4 border-t" />
                  <TicketInfo
                    label="Hành trình"
                    value={`${detail.fields.from || "Văn phòng chính"} → ${detail.fields.to || "Địa điểm công tác"}`}
                  />
                  <div className="mt-4">
                    <TicketInfo label="Thời gian" value={period(detail)} />
                  </div>
                  <div className="my-4 border-t" />
                  <TicketInfo
                    label="Mục đích / Nội dung"
                    value={reason(detail)}
                    box
                  />
                </div>
              ) : detail.kind === "Giải trình" ||
                detail.kind === "Khiếu nại" ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-slate-50 p-4">
                      <TicketInfo
                        label="Loại hình vi phạm"
                        value={
                          detail.fields.complaintType ||
                          "Đi muộn / Về sớm (08:42)"
                        }
                        danger
                      />
                    </div>
                    <div className="rounded-2xl border bg-slate-50 p-4">
                      <TicketInfo
                        label="Ngày khiếu nại & phát sinh"
                        value={detail.fields.date || start(detail)}
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <TicketInfo
                      label="Thời gian hệ thống thông báo"
                      value="08:42:00"
                      sub="Đi muộn 12 phút　-　Ca sáng 08:30"
                    />
                  </div>
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <TicketInfo
                      label="Thời gian thực tế nhân viên xác nhận"
                      value={detail.fields.actualTime || "08:28:00"}
                      sub="Đã quẹt thẻ từ cửa an ninh tầng 1 & có sự chứng kiến của bảo vệ tòa nhà"
                    />
                  </div>
                  <div className="rounded-2xl border bg-slate-50 p-4">
                    <TicketInfo
                      label="Lý do & Giải trình khiếu nại"
                      value={reason(detail)}
                      box
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border bg-slate-50 p-5">
                  <div className="grid gap-5 sm:grid-cols-[140px_180px_1fr]">
                    <TicketInfo label="Loại phiếu" value="Nghỉ phép" blue />
                    <TicketInfo
                      label="Hình thức nghỉ"
                      value={mode(detail) || "Nghỉ phép năm"}
                    />
                    <TicketInfo
                      label="Thời gian nghỉ"
                      value={period(detail)}
                      sub={
                        detail.fields["Thời lượng"]
                          ? `Tổng: ${detail.fields["Thời lượng"]}`
                          : undefined
                      }
                    />
                  </div>
                  <div className="my-4 border-t" />
                  <TicketInfo label="Lý do" value={reason(detail)} box />
                </div>
              )}
            </div>
            <footer className="flex justify-between gap-3 border-t bg-slate-50 px-6 py-4">
              {detail.status === "Chờ duyệt" && (
                <button
                  onClick={() => {
                    recall(detail);
                    setDetail(null);
                  }}
                  className="btn-danger"
                >
                  <span className="material-symbols-outlined text-[17px]">
                    undo
                  </span>
                  {detail.kind === "Công tác"
                    ? "Thu hồi đề xuất"
                    : detail.kind === "Giải trình" ||
                        detail.kind === "Khiếu nại"
                      ? "Thu hồi khiếu nại"
                      : "Thu hồi đơn"}
                </button>
              )}
              {detail.status !== "Chờ duyệt" && <span />}
              <button onClick={() => setDetail(null)} className="btn-secondary">
                Đóng
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

function TicketInfo({
  label,
  value,
  sub,
  blue,
  danger,
  box,
}: {
  label: string;
  value: string;
  sub?: string;
  blue?: boolean;
  danger?: boolean;
  box?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1.5 text-sm font-semibold ${blue ? "inline-flex rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700" : danger ? "inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-rose-600" : box ? "rounded-xl border bg-white p-4 font-normal leading-6 text-slate-700" : "text-slate-800"}`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-blue-600">{sub}</p>}
    </div>
  );
}
