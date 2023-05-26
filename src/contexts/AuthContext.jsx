import { createContext, useState, useEffect } from 'react';
import { login, register, checkPermission } from '../api/auth';
import * as jwt from 'jsonwebtoken';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';

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
export const useAuth = () => useContext(AuthContext);
// 管理狀態
export const AuthProvider = ({ children }) => {
  // 授權狀態
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 解析authToken
  const [payload, setPayload] = useState(null);

  const { pathname } = useLocation();

  // 驗證身份是否有效
  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      // 判斷Token是否有效
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        // 取得解析的payload
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };

    checkTokenIsValid();
    // 透過pathname判斷當前頁面是否有切換
  }, [pathname]);

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
