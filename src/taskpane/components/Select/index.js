import React, { useContext } from "react";
import CodeChoiceGroup from "./CodeSelection";
import UpdateModel from "./UpdateCode";
import CodeContext from '../../code/CodeContext';

export default function SelectCode() {
  const { codeObj, setCodeObj } = useContext(CodeContext);
  return (
    <div className="centered">
      <UpdateModel codeObj={codeObj} />
      <hr className="rounded"></hr>
      <CodeChoiceGroup />
    </div>
  );
}
