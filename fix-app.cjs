const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('RoleProvider')) {
  app = app.replace("import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';", "import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';\nimport { RoleProvider } from './context/RoleContext';\nimport Layout from './components/Layout';");
  app = app.replace('<BrowserRouter>', '<BrowserRouter>\n      <RoleProvider>\n        <Layout>');
  app = app.replace('</BrowserRouter>', '        </Layout>\n      </RoleProvider>\n    </BrowserRouter>');
  fs.writeFileSync('src/App.tsx', app, 'utf8');
  console.log('App.tsx fixed');
}
