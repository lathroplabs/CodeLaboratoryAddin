import React, { useContext } from "react";
import CodeChoiceGroup from "./CodeSelection";
import UpdateModel from "./UpdateCode";
import ModelMetaContext from "../../models/ModelMetaContext";

export default function SelectCode() {
  const { modelMeta } = useContext(ModelMetaContext);
  return (
    <div className="centered">
      <UpdateModel modelMeta={modelMeta} />
      <hr className="rounded"></hr>
      <CodeChoiceGroup />
    </div>
  );
}
