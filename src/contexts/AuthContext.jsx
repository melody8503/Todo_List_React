import { createContext, useState } from 'react';

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
        currentMember: payload,
      }}
    ></AuthContext.Provider>
  );
};
