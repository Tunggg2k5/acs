const fs = require('fs');
const path = require('path');

const map = {
  'nguoi-dung': '/qu-n-l-ng-i-d-ng',
  'quan-ly-to-chuc': '/qu-n-l-t-ch-c',
  'role-and-workflow': '/role-workflow',
  'cau-hinh-and-audit-log': '/c-u-h-nh-audit-log',
  'danh-muc-ca-and-phan-ca': '/danh-m-c-ca-ph-n-ca',
  'lich-lam-viec': '/l-ch-l-m-vi-c',
  'lich-truc': '/l-ch-tr-c-ph-n-c-ng-tr-c',
  'doi-ca': '/i-ca',
  'nhat-ky-ra-vao': '/nh-t-k-ra-v-o',
  'bang-cong': '/b-ng-c-ng',
  'giam-sat-cham-cong': '/gi-m-s-t-ch-m-c-ng',
  'dieu-chinh-cong': '/i-u-ch-nh-c-ng',
  'quan-ly-phieu': '/qu-n-l-phi-u',
  'cong-tac-and-dinh-muc': '/c-ng-t-c-nh-m-c',
  'ho-so-ca-nhan': '/h-s-c-nh-n'
};

const pagesDir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(pagesDir);

files.forEach(f => {
  if (f.endsWith('.tsx')) {
    let content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
    for (const [key, val] of Object.entries(map)) {
      content = content.split('data-path="' + key + '" href="#"').join('data-path="' + key + '" href="' + val + '"');
    }
    fs.writeFileSync(path.join(pagesDir, f), content);
  }
});
console.log('Links updated.');
