const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src', 'pages');

// ----------------------------------------------------
// QuNLPhiU.tsx (Tickets CRUD)
// ----------------------------------------------------
let ticketsPage = fs.readFileSync(path.join(srcDir, 'QuNLPhiU.tsx'), 'utf8');

// 1. Inject state
let ticketState = `
  const [tickets, setTickets] = useState([
    { id: 'YC-20231026-001', empId: 'NV001', name: 'Nguyễn Văn An', dept: 'Phòng IT', type: 'Nghỉ phép', date: '26/10/2023', status: 'Chờ duyệt' },
    { id: 'YC-20231025-002', empId: 'NV015', name: 'Trần Thị Mai', dept: 'Phòng HR', type: 'Giải trình', date: '25/10/2023', status: 'Đã duyệt' },
  ]);

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const type = e.target.elements.ticketType?.value || 'Nghỉ phép';
    setTickets([{ id: 'YC-' + Date.now().toString().slice(-6), empId: 'NV_NEW', name: 'Nhân viên mới', dept: 'Phòng IT', type: type, date: new Date().toLocaleDateString('vi-VN'), status: 'Chờ duyệt' }, ...tickets]);
    setActiveModal(null);
  };
`;
ticketsPage = ticketsPage.replace('const [activeModal, setActiveModal] = useState<string|null>(null);', 'const [activeModal, setActiveModal] = useState<string|null>(null);\n' + ticketState);

// 2. Map rows
let tbodyStart = ticketsPage.indexOf('<tbody className="divide-y divide-surface-container">');
let tbodyEnd = ticketsPage.indexOf('</tbody>', tbodyStart) + '</tbody>'.length;

let newTbody = `
<tbody className="divide-y divide-surface-container">
  {tickets.map((t, i) => (
    <tr key={t.id} className="hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => setActiveModal('approvalDrawer')}>
      <td className="py-2.5 px-3">
        <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary bg-transparent border-outline" />
      </td>
      <td className="py-2.5 px-3">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm font-semibold text-primary">{t.id}</span>
          <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{t.date}</span>
        </div>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">{t.name}</span>
          <span className="font-label-xs text-label-xs text-on-surface-variant">{t.empId}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-on-surface-variant">{t.dept}</td>
      <td className="py-2.5 px-3">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-xs text-label-xs font-semibold">
          {t.type}
        </span>
      </td>
      <td className="py-2.5 px-3">
        <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${t.status === 'Chờ duyệt' ? 'bg-secondary-container/30 text-secondary' : t.status === 'Đã duyệt' ? 'bg-tertiary-container/30 text-tertiary' : 'bg-error-container/20 text-error'}\`}>
          <span className={\`w-1.5 h-1.5 rounded-full \${t.status === 'Chờ duyệt' ? 'bg-secondary' : t.status === 'Đã duyệt' ? 'bg-tertiary' : 'bg-error'}\`}></span>{t.status}
        </span>
      </td>
      <td className="py-2.5 px-3 text-center">
        <button onClick={(e) => { e.stopPropagation(); setTickets(tickets.filter(x => x.id !== t.id)); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </td>
    </tr>
  ))}
</tbody>
`;
ticketsPage = ticketsPage.substring(0, tbodyStart) + newTbody + ticketsPage.substring(tbodyEnd);

// 3. Make modal submit
ticketsPage = ticketsPage.replace(/<div style=\{\{ display: activeModal === "createRequestModal" \? "" : "none" \}\}\s*className="fixed inset-0 z-50 flex items-center justify-center p-4 hidden" id="createRequestModal">([\s\S]*?)<div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">/, '<div style={{ display: activeModal === "createRequestModal" ? "" : "none" }} className="fixed inset-0 z-50 flex items-center justify-center p-4" id="createRequestModal">$1<form onSubmit={handleTicketSubmit} className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">');
// Find the end of the modal to close the form
ticketsPage = ticketsPage.replace(/(<button[^>]*class="[^"]*bg-primary[^"]*"[^>]*>\s*<span[^>]*>Gửi yêu cầu<\/span>\s*<\/button>)/, '<button type="submit" className="h-9 px-5 bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors rounded shadow-sm">Gửi yêu cầu</button>');
// And close form tag correctly.
ticketsPage = ticketsPage.replace(/<div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">([\s\S]*?)<div className="h-14 px-space-lg border-t border-outline-variant\/30 bg-surface flex items-center justify-end gap-space-sm">/, '<form onSubmit={handleTicketSubmit} className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">$1<div className="h-14 px-space-lg border-t border-outline-variant/30 bg-surface flex items-center justify-end gap-space-sm">');
ticketsPage = ticketsPage.replace(/<select class(?:Name)?="w-full h-9 px-space-sm bg-surface-container-low/g, '<select id="ticketType" className="w-full h-9 px-space-sm bg-surface-container-low');

ticketsPage = ticketsPage.replace(/Gửi yêu cầu<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/, 'Gửi yêu cầu</button>\n          </div>\n        </form>\n      </div>');

fs.writeFileSync(path.join(srcDir, 'QuNLPhiU.tsx'), ticketsPage, 'utf8');
console.log('CRUD added to QuNLPhiU.tsx');

// ----------------------------------------------------
// ICa.tsx (Shifts CRUD)
// ----------------------------------------------------
let shiftsPage = fs.readFileSync(path.join(srcDir, 'ICa.tsx'), 'utf8');

let shiftsState = `
  const [shifts, setShifts] = useState([
    { id: 'DC-1026-001', name: 'Nguyễn Văn An', currentShift: 'Ca Sáng (08:00 - 17:00)', requestedShift: 'Ca Chiều (13:00 - 22:00)', date: '26/10/2023', status: 'Chờ duyệt' },
    { id: 'DC-1025-002', name: 'Trần Thị Mai', currentShift: 'Ca Chiều', requestedShift: 'Ca Sáng', date: '25/10/2023', status: 'Đã duyệt' },
  ]);

  const handleShiftSubmit = (e) => {
    e.preventDefault();
    setShifts([{ id: 'DC-' + Date.now().toString().slice(-6), name: 'Bạn (Nhân viên)', currentShift: 'Ca hiện tại', requestedShift: 'Ca mới', date: new Date().toLocaleDateString('vi-VN'), status: 'Chờ duyệt' }, ...shifts]);
    setActiveModal(null);
  };
`;
shiftsPage = shiftsPage.replace('const [activeModal, setActiveModal] = useState<string|null>(null);', 'const [activeModal, setActiveModal] = useState<string|null>(null);\n' + shiftsState);

tbodyStart = shiftsPage.indexOf('<tbody className="divide-y divide-surface-container">');
tbodyEnd = shiftsPage.indexOf('</tbody>', tbodyStart) + '</tbody>'.length;

newTbody = `
<tbody className="divide-y divide-surface-container">
  {shifts.map((s, i) => (
    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
      <td className="py-2.5 px-3">
        <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary bg-transparent border-outline" />
      </td>
      <td className="py-2.5 px-3">
        <span className="font-label-sm text-label-sm font-semibold text-primary">{s.id}</span>
      </td>
      <td className="py-2.5 px-3">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm font-semibold text-on-surface">{s.name}</span>
          <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">{s.date}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-on-surface-variant">{s.currentShift}</td>
      <td className="py-2.5 px-3 text-on-surface-variant">{s.requestedShift}</td>
      <td className="py-2.5 px-3">
        <span className={\`inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold \${s.status === 'Chờ duyệt' ? 'bg-secondary-container/30 text-secondary' : 'bg-tertiary-container/30 text-tertiary'}\`}>
          {s.status}
        </span>
      </td>
      <td className="py-2.5 px-3 text-center">
        <button onClick={() => setActiveModal('shiftApprovalDrawer')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">visibility</span>
        </button>
        <button onClick={() => setShifts(shifts.filter(x => x.id !== s.id))} className="w-8 h-8 flex items-center justify-center rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </td>
    </tr>
  ))}
</tbody>
`;
shiftsPage = shiftsPage.substring(0, tbodyStart) + newTbody + shiftsPage.substring(tbodyEnd);

// Wrap modal content with form
shiftsPage = shiftsPage.replace(/<div className="w-full max-w-\[480px\] bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">([\s\S]*?)<div className="p-space-md border-t border-outline-variant\/30 flex justify-end gap-3 bg-surface-container-lowest">/, '<form onSubmit={handleShiftSubmit} className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden">$1<div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-lowest">');
shiftsPage = shiftsPage.replace(/(<button[^>]*class="[^"]*bg-primary[^"]*"[^>]*>\s*Gửi yêu cầu\s*<\/button>)/, '<button type="submit" className="h-9 px-5 bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-sm flex items-center gap-1">Gửi yêu cầu</button>');
shiftsPage = shiftsPage.replace(/Gửi yêu cầu<\/button>\s*<\/div>\s*<\/div>\s*<\/div>/, 'Gửi yêu cầu</button>\n          </div>\n        </form>\n      </div>');

fs.writeFileSync(path.join(srcDir, 'ICa.tsx'), shiftsPage, 'utf8');
console.log('CRUD added to ICa.tsx');
