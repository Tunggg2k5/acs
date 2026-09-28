const fs = require('fs');

let c = fs.readFileSync('src/pages/QuNLPhiU.tsx', 'utf8');

c = c.replace(/<button[^>]*>\s*<span[^>]*>add_circle<\/span>\s*<span[^>]*>\+ Tạo phiếu mới<\/span>\s*<\/button>/gi, '<button className="inline-flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md py-space-xs rounded font-label-md text-label-md transition-all shadow-sm" type="button" onClick={() => setActiveModal("createRequestModal")}><span className="material-symbols-outlined text-[18px]">add_circle</span><span className="">+ Tạo phiếu mới</span></button>');

fs.writeFileSync('src/pages/QuNLPhiU.tsx', c, 'utf8');

console.log("Done");
