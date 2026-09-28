const fs = require('fs');
let c = fs.readFileSync('src/pages/QuNLPhiU.tsx', 'utf8');
c = c.replace(/id="ticketType"/g, 'name="ticketType"');
fs.writeFileSync('src/pages/QuNLPhiU.tsx', c, 'utf8');
