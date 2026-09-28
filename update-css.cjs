const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/\/\* RBAC Hiding Rules[\s\S]*/g, '');

css += `
/* RBAC Hiding Rules for EMPLOYEE */
[data-role="EMPLOYEE"] button[title="Thêm người dùng"],
[data-role="EMPLOYEE"] button[title="Thêm phòng ban"],
[data-role="EMPLOYEE"] button[title="Thêm"],
[data-role="EMPLOYEE"] button[title="Chỉnh sửa"],
[data-role="EMPLOYEE"] button[title="Xóa"],
[data-role="EMPLOYEE"] button[title="Khóa tài khoản"],
[data-role="EMPLOYEE"] button[title="Vô hiệu hóa tài khoản"] {
  display: none !important;
}

[data-role="MANAGER"] button[title="Thêm người dùng"],
[data-role="MANAGER"] button[title="Khóa tài khoản"],
[data-role="MANAGER"] button[title="Vô hiệu hóa tài khoản"] {
  display: none !important;
}
`;

fs.writeFileSync('src/index.css', css, 'utf8');
