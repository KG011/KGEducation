import "./App.scss";
import { GlobalProvider } from "@/context/Global";
import LoadingProvider from "./context/GlobalLoading";
import { ConfigProvider} from 'antd';
import RouterWrapper from "./router";

function App() {
  //登录状态
  // const [loginState] = React.useState<boolean>(false);
  //路由状态
  // const [router, setRouter] = React.useState<string>(
  //   `${location.pathname}${location.search}`,
  // );
  return (
    <ConfigProvider>
      <GlobalProvider>
        <LoadingProvider>
          <RouterWrapper></RouterWrapper>
        </LoadingProvider>
      </GlobalProvider>
    </ConfigProvider>

  );
}

export default App;
