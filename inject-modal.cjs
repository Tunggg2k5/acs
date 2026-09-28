const fs = require('fs');

let usersPage = fs.readFileSync('src/pages/QuNLNgIDNg.tsx', 'utf8');
let modalPage = fs.readFileSync('src/pages/ThMSANhNViNModal.tsx', 'utf8');

const modalStart = modalPage.indexOf('<div style={{ display: activeModal');
const modalEnd = modalPage.indexOf('{/* Micro-Interactions Client Script */}');
let modalContent = modalPage.substring(modalStart, modalEnd);

modalContent = modalContent.replace(/style=\{\{ display: activeModal \? "" : "none" \}\}/g, 'style={{ display: activeModal === "add_user" || activeModal === "edit_user" ? "" : "none" }}');
modalContent = modalContent.replace(/<div className="flex justify-end gap-space-sm">/g, '<div className="flex justify-end gap-space-sm"><button type="submit" className="hidden" id="hidden-submit-btn"></button>');
modalContent = modalContent.replace(/<span[^>]*>Lưu thông tin<\/span>/g, '<span onClick={() => document.getElementById("hidden-submit-btn")?.click()}>Lưu thông tin</span>');

modalContent = modalContent.replace(/(<div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-xl">)/, '<form onSubmit={handleUserSubmit} className="flex-1 overflow-y-auto flex flex-col" id="userForm">\n$1');
modalContent = modalContent.replace(/(<div className="p-space-md bg-surface-container flex items-center justify-between">)/, '</form>\n$1');
modalContent = modalContent.replace(/<span[^>]*>Lưu thông tin<\/span>/g, '<button type="submit" form="userForm" className="flex items-center">Lưu thông tin</button>');

// Now add the modalContent right before the end of the fragment
usersPage = usersPage.replace('    </>', '      ' + modalContent + '\n    </>');

fs.writeFileSync('src/pages/QuNLNgIDNg.tsx', usersPage, 'utf8');
