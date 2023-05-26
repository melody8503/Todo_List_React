import { createContext, useState } from 'react';
import { login, register } from 'api/auth';
import * as jwt from 'jsonwebtoken';

// 初始狀態與方法
const defaultAuthContext = {
  // 身份驗證
  isAuthenticated: false,
  // 當前使用者相關資料
  currentMember: null,
  // 影響isAuthenticated的方法
  register: null,
  login: null,
  logout: null,
};

const AuthContext = createContext(defaultAuthContext);

// 管理狀態
const AuthProvider = ({ children }) => {
  // 授權狀態
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 解析authToken
  const [payload, setPayload] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          //取得登入的使用者資訊
          id: payload.sub,
          name: payload.name,
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });

          // 取得 payload 內容
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
