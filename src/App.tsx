import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuNLNgIDNg from './pages/QuNLNgIDNg';
import QuNLTChC from './pages/QuNLTChC';
import RoleWorkflow from './pages/RoleWorkflow';
import CUHNhAuditLog from './pages/CUHNhAuditLog';
import DanhMCCaPhNCa from './pages/DanhMCCaPhNCa';
import LChLMViC from './pages/LChLMViC';
import LChTrCPhNCNgTrC from './pages/LChTrCPhNCNgTrC';
import ICa from './pages/ICa';
import NhTKRaVO, { ManagerAccessLog } from './pages/NhTKRaVO';
import BNgCNg from './pages/BNgCNg';
import GiMSTChMCNg from './pages/GiMSTChMCNg';
import IUChNhCNg from './pages/IUChNhCNg';
import QuNLPhiU from './pages/QuNLPhiU';
import CNgTCNhMC from './pages/CNgTCNhMC';
import HSCNhN from './pages/HSCNhN';
import DanhSChNhNViN from './pages/DanhSChNhNViN';
import LichHop from './pages/LichHop';
import Login from './pages/Login';
import EmployeeTasks from './pages/EmployeeTasks';
import ManagerTasks from './pages/ManagerTasks';
import { useRole } from './context/RoleContext';

function Protected({children}:{children:React.ReactNode}){const {authenticated}=useRole();return authenticated?<>{children}</>:<Navigate to="/login" replace/>}

function PublicHome(){const {role,setRole}=useRole();useEffect(()=>{if(role!=='GUEST')setRole('GUEST')},[role,setRole]);return role==='GUEST'?<LichHop/>:null}

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
            <Route path="/cong-viec" element={<Protected><EmployeeTasks /></Protected>} />
            <Route path="/quan-ly-nhiem-vu" element={<Protected><ManagerTasks /></Protected>} />
            <Route path="/lich-hop" element={<LichHop />} />
            <Route path="/qu-n-l-ng-i-d-ng" element={<QuNLNgIDNg />} />
            <Route path="/qu-n-l-t-ch-c" element={<QuNLTChC />} />
            <Route path="/role-workflow" element={<RoleWorkflow />} />
            <Route path="/c-u-h-nh-audit-log" element={<CUHNhAuditLog />} />
            <Route path="/danh-m-c-ca-ph-n-ca" element={<DanhMCCaPhNCa />} />
            <Route path="/l-ch-l-m-vi-c" element={<LChLMViC />} />
            <Route path="/l-ch-tr-c-ph-n-c-ng-tr-c" element={<LChTrCPhNCNgTrC />} />
            <Route path="/i-ca" element={<ICa />} />
            <Route path="/nh-t-k-ra-v-o" element={<NhTKRaVO />} />
            <Route path="/nh-t-k-ra-v-o-quan-ly" element={<ManagerAccessLog />} />
            <Route path="/b-ng-c-ng" element={<BNgCNg />} />
            <Route path="/gi-m-s-t-ch-m-c-ng" element={<Navigate to="/dashboard" replace />} />
            <Route path="/danh-sach-vi-pham" element={<GiMSTChMCNg />} />
            <Route path="/i-u-ch-nh-c-ng" element={<IUChNhCNg />} />
            <Route path="/qu-n-l-phi-u" element={<QuNLPhiU />} />
            <Route path="/c-ng-t-c-nh-m-c" element={<CNgTCNhMC />} />
            <Route path="/h-s-c-nh-n" element={<HSCNhN />} />
            <Route path="/danh-s-ch-nh-n-vi-n" element={<DanhSChNhNViN />} />
          </Routes>
        </Layout>
      </RoleProvider>
    </BrowserRouter>
  );
}
