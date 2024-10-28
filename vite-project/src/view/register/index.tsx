import  { FC } from "react";
import "./index.scss";

import SimpleHeader from "./simpleHeader";
import SimpleContent from "./simpleContent";
interface LoginProps {
  a?: string;
}
const Register: FC<LoginProps> = () => {
  return (
    <>
      <div className="KG-login">
        <SimpleHeader />
        <div className="KG-content">
          <div className="KG-content-title">Day Day Up</div>
          <SimpleContent />
        </div>
      </div>
    </>
  );
};
export default Register;
