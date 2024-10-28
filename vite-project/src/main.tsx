import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from 'react-router-dom';
import App from "./App.tsx";
import "./style/index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
        <App />
      </HashRouter> 
  </StrictMode>,
);
{/* ErrorBoundary组件接收一个FallbackComponent属性，当子组件（这里是App组件）抛出错误时，
      ErrorBoundary会渲染这个备用组件，而不是让错误传播导致整个应用崩溃。 */}
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}
      // <App />
      {/* </ErrorBoundary> */}
