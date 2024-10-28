import React from "react";
import "./index.scss";
const simpleHeader: React.FC = () => {
  return (
    <div className="simple-header">
      <div className="simple-header-left">
        <img className="logo" alt="KG  Education" />
        <span className="label-text">KG Education</span>
      </div>
    </div>
  );
};
export default simpleHeader;
