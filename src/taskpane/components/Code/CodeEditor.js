/* eslint-disable react/no-string-refs */
import React, { Component } from "react";
import { render } from "react-dom";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"

let code = ""
function onChange(newValue) {
  code = newValue
}

function getCode() {
  //var editor = ace.edit("editor");
  //var code = editor.getSession().getValue();
  console.log("code", code);
}

export default function Editor() {
    return (
      <>
      <button onClick={getCode}>Show Code</button>
      <div id="editor">
        <AceEditor
          placeholder="Start coding!"
          mode="python"
          theme="github"
          name="python_editor"
          onChange={onChange}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
        
          setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          }}/>
      </div>
      </>
    )
}
