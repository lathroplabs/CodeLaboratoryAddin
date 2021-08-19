import React from "react";
import Editor from "./CodeEditor";

export default function CodeEditor() {
  return (
    <>
      <hr className="rounded"></hr>
      <Editor />
      <hr className="rounded"></hr>
      <div id="tester"></div>
    </>
  );
}
