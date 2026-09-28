export type TicketKind = 'Nghỉ phép' | 'Giải trình' | 'Công tác' | 'Khiếu nại' | 'Đổi ca';

export type SharedTicket = {
  id: string;
  kind: TicketKind;
  employee: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối' | 'Đã thu hồi';
  createdAt: string;
  fields: Record<string, string>;
};

const KEY = 'acs-employee-tickets-v2';

const defaults: SharedTicket[] = [
  { id:'PH-2026-017', kind:'Nghỉ phép', employee:'Lê Hoàng Dũng', status:'Chờ duyệt', createdAt:'24/09/2026', fields:{ 'Từ ngày':'24/09/2026', 'Đến ngày':'—', 'Thời lượng':'Buổi chiều', 'Chế độ':'Về sớm', 'Ngày công bị trừ':'0,5 công', 'Lý do':'Đăng ký giấy tờ xe nên phải làm giờ hành chính', 'Người xử lý':'Ban Giám đốc' } },
  { id:'PH-2026-018', kind:'Giải trình', employee:'Trần Thị Mai', status:'Chờ duyệt', createdAt:'26/09/2026', fields:{ 'Ngày giải trình':'26/09', 'Loại sai lệch':'Quên chấm công', 'Nội dung':'Lỗi máy quét vân tay cửa sảnh B', 'Người xử lý':'Lê Hoàng Dũng' } },
  { id:'PH-2026-019', kind:'Nghỉ phép', employee:'Trần Thị Mai', status:'Đã thu hồi', createdAt:'22/09/2026', fields:{ 'Từ ngày':'22/09', 'Đến ngày':'22/09', 'Chế độ':'Nghỉ phép năm', 'Lý do':'Giải quyết việc gia đình', 'Người xử lý':'Lê Hoàng Dũng' } },
  { id:'PH-2026-020', kind:'Công tác', employee:'Trần Thị Mai', status:'Đã duyệt', createdAt:'18/09/2026', fields:{ 'Từ ngày':'18/09', 'Đến ngày':'20/09', tripType:'Nội địa', 'Lý do':'Gặp gỡ khách hàng ký kết hợp đồng tại Đà Nẵng', 'Người xử lý':'Lê Hoàng Dũng' } },
  { id:'PH-2026-021', kind:'Nghỉ phép', employee:'Trần Thị Mai', status:'Từ chối', createdAt:'12/09/2026', fields:{ 'Từ ngày':'12/09', 'Đến ngày':'13/09', 'Chế độ':'Nghỉ không lương', 'Lý do':'Không đủ ngày phép còn lại trong năm theo quy định', 'Người xử lý':'Lê Hoàng Dũng' } },
  { id:'PH-2026-022', kind:'Giải trình', employee:'Trần Thị Mai', status:'Đã duyệt', createdAt:'10/09/2026', fields:{ 'Ngày giải trình':'10/09', 'Loại sai lệch':'Đi muộn có phép', 'Nội dung':'Hỏng xe trên đường đến văn phòng và đã báo trước quản lý', 'Người xử lý':'Lê Hoàng Dũng' } },
  { id:'PH-2026-023', kind:'Công tác', employee:'Trần Thị Mai', status:'Từ chối', createdAt:'01/09/2026', fields:{ 'Từ ngày':'01/09', 'Đến ngày':'02/09', tripType:'Khảo sát địa điểm', 'Lý do':'Kế hoạch chưa được phê duyệt ngân sách phòng ban', 'Người xử lý':'Lê Hoàng Dũng' } },
  { id:'PH-2026-024', kind:'Nghỉ phép', employee:'Trần Thị Mai', status:'Đã duyệt', createdAt:'28/08/2026', fields:{ 'Từ ngày':'28/08', 'Đến ngày':'29/08', 'Chế độ':'Nghỉ ốm hưởng BHXH', 'Lý do':'Nghỉ khám bệnh theo chỉ định của bác sĩ tại bệnh viện', 'Người xử lý':'Lê Hoàng Dũng' } },
];

export function loadTickets(): SharedTicket[] {
  try { const value = localStorage.getItem(KEY); const rows:SharedTicket[]=value ? JSON.parse(value) : defaults; return rows.filter(t=>String(t.kind)!=='Đăng ký OT'); } catch { return defaults; }
}

export function saveTickets(tickets: SharedTicket[]) {
  localStorage.setItem(KEY, JSON.stringify(tickets.filter(t=>String(t.kind)!=='Đăng ký OT')));
}
