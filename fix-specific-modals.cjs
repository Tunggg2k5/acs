const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function replaceFile(fileName, replacer) {
  const filePath = path.join(pagesDir, fileName);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = replacer(content);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ' + fileName);
  }
}

// Fix QuNLPhiU.tsx
replaceFile('QuNLPhiU.tsx', (content) => {
  // Replace boolean state with string state
  content = content.replace('const [isVisible, setIsVisible] = useState(false);', 'const [activeModal, setActiveModal] = useState<string|null>(null);');
  
  // Replace close handlers
  content = content.replace(/setIsVisible\(false\)/g, 'setActiveModal(null)');
  
  // Replace visibility checks
  content = content.replace(/isVisible \? "" : "none"/g, 'activeModal ? "" : "none"'); // We will refine this below
  
  // Specifically map the visibility of each overlay to its ID
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="drawerBackdrop"/g, '<div style={{ display: activeModal ? "" : "none" }} className="$1" id="drawerBackdrop" onClick={() => setActiveModal(null)}');
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="createRequestModal"/g, '<div style={{ display: activeModal === "createRequestModal" ? "" : "none" }} className="$1" id="createRequestModal"');
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="rejectModal"/g, '<div style={{ display: activeModal === "rejectModal" ? "" : "none" }} className="$1" id="rejectModal"');
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="approvalDrawer"/g, '<div style={{ display: activeModal === "approvalDrawer" ? "" : "none" }} className="$1" id="approvalDrawer"');

  // Add Open handlers
  content = content.replace(/(<button[^>]*>\s*<span[^>]*>\+ Tạo phiếu mới<\/span>\s*<\/button>)/i, '<button className="inline-flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md py-space-xs rounded font-label-md text-label-md transition-all shadow-sm" type="button" onClick={() => setActiveModal("createRequestModal")}><span className="material-symbols-outlined text-[18px]">add_circle</span><span className="">+ Tạo phiếu mới</span></button>');
  
  content = content.replace(/<button([^>]*)title="Xem chi tiết"([^>]*)>/gi, '<button$1title="Xem chi tiết" onClick={() => setActiveModal("approvalDrawer")}$2>');

  return content;
});

// Fix ICa.tsx
replaceFile('ICa.tsx', (content) => {
  content = content.replace('const [isVisible, setIsVisible] = useState(false);', 'const [activeModal, setActiveModal] = useState<string|null>(null);');
  content = content.replace(/setIsVisible\(false\)/g, 'setActiveModal(null)');
  
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="drawerBackdrop"/g, '<div style={{ display: activeModal ? "" : "none" }} className="$1" id="drawerBackdrop" onClick={() => setActiveModal(null)}');
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="newRequestModal"/g, '<div style={{ display: activeModal === "newRequestModal" ? "" : "none" }} className="$1" id="newRequestModal"');
  content = content.replace(/<div style=\{\{ display: activeModal \? "" : "none" \}\}\s*className="([^"]*)" id="shiftApprovalDrawer"/g, '<div style={{ display: activeModal === "shiftApprovalDrawer" ? "" : "none" }} className="$1" id="shiftApprovalDrawer"');

  content = content.replace(/id="btnOpenNewRequest"/g, 'id="btnOpenNewRequest" onClick={() => setActiveModal("newRequestModal")}');
  content = content.replace(/<button([^>]*)title="Xem chi tiết"([^>]*)>/gi, '<button$1title="Xem chi tiết" onClick={() => setActiveModal("shiftApprovalDrawer")}$2>');

  return content;
});

// Generic fix for ALL files to change generic isVisible logic to activeModal so we don't have undefined errors
const fileList = fs.readdirSync(pagesDir);
fileList.forEach(f => {
  if (f !== 'QuNLPhiU.tsx' && f !== 'ICa.tsx' && f.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
    if (content.includes('isVisible')) {
      content = content.replace('const [isVisible, setIsVisible] = useState(false);', 'const [activeModal, setActiveModal] = useState<boolean>(false);');
      content = content.replace(/setIsVisible\(/g, 'setActiveModal(');
      content = content.replace(/isVisible \?/g, 'activeModal ?');
      fs.writeFileSync(path.join(pagesDir, f), content, 'utf8');
      console.log('Fixed generic ' + f);
    }
  }
});
