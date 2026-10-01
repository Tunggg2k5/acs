import React, { createContext, useContext, useState } from 'react';

export type Role = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE' | 'GUEST';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  authenticated: boolean;
  login: (role: Role) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<Role>(()=>(sessionStorage.getItem('acs-role') as Role)||'EMPLOYEE');
  const [authenticated,setAuthenticated]=useState(()=>sessionStorage.getItem('acs-auth')==='1');
  const login=(nextRole:Role)=>{setRole(nextRole);setAuthenticated(true);sessionStorage.setItem('acs-role',nextRole);sessionStorage.setItem('acs-auth','1')};
  const logout=()=>{setAuthenticated(false);sessionStorage.removeItem('acs-auth')};
  return <RoleContext.Provider value={{ role, setRole, authenticated, login, logout }}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used within a RoleProvider");
  return context;
};
