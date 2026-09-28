const fs = require('fs');

let c = fs.readFileSync('src/pages/ICa.tsx', 'utf8');

c = c.replace(/style=\{\{ display: isVisible \? "" : "none" \}\}/g, '');
c = c.replace(/<div\s+className="([^"]*)"\s+id="newRequestModal"/g, '<div style={{ display: activeModal === "newRequestModal" ? "" : "none" }} className="$1" id="newRequestModal"');
c = c.replace(/<div\s+className="([^"]*)"\s+id="shiftApprovalDrawer"/g, '<div style={{ display: activeModal === "shiftApprovalDrawer" ? "" : "none" }} className="$1" id="shiftApprovalDrawer"');
c = c.replace(/<div\s+className="([^"]*)"\s+id="drawerBackdrop"/g, '<div style={{ display: activeModal ? "" : "none" }} className="$1" id="drawerBackdrop" onClick={() => setActiveModal(null)}');

fs.writeFileSync('src/pages/ICa.tsx', c, 'utf8');

console.log("Done");
