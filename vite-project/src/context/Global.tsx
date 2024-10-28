import React from "react";
import { useNavigate } from "react-router-dom";

interface GlobalProps {
  // 路由设置
  setRouter: (router: string) => void;
  setUserInfo: (number: number) => void;
  setOpenModel: (bol: boolean) => void;
  userInfo: number;
  openModel: boolean
  isPhotoShow:boolean
  setIsPhotoShow:(bol: boolean) => void;
}
interface GlobalProviderProps {
  // 子组件
  children: React.ReactNode;
}
const GlobalContext = React.createContext<GlobalProps | null>(null);

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  //用户信息
  const [userInfo, setUserInfo] = React.useState(0)
  //弹窗
  const [openModel, setOpenModel] = React.useState(false)
  //图片墙
  const [isPhotoShow, setIsPhotoShow] = React.useState(false)
  //路由跳转
  const Navigate = useNavigate();
  const routerFunction = (router: string) => {
    if (!router) return;
    Navigate(router)
  };
  return (
    <GlobalContext.Provider value={{
      setRouter: routerFunction,
      setUserInfo,
      userInfo,
      setOpenModel,
      openModel,
      isPhotoShow,
      setIsPhotoShow,
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
//全局上下文
const useGlobalContext = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
// eslint-disable-next-line react-refresh/only-export-components
export { GlobalProvider, useGlobalContext }