import React, { useReducer, ReactNode } from "react";

const LoadingContext = React.createContext({});
type LoadingAction = { type: "START_LOADING" } | { type: "STOP_LOADING" };
const loadingReducer = (state: boolean = false, action: LoadingAction) => {
  switch (action.type) {
    case "START_LOADING":
      return true;
    case "STOP_LOADING":
      return false;
    default:
      return state;
  }
};
type LoadingChildren = { children: ReactNode };
const LoadingProvider:React.FC<LoadingChildren> = ({ children } ) => {
  const [loading, dispatch] = useReducer(loadingReducer, false);

  const startLoading = () => {
    dispatch({ type: "START_LOADING" });
  };

  const stopLoading = () => {
    dispatch({ type: "STOP_LOADING" });
  };

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
export default LoadingProvider;
