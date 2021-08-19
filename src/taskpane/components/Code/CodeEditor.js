/* eslint-disable react/no-string-refs */
import React, { useContext } from "react";
import AceEditor from "react-ace";
import { PrimaryButton, TextField, MessageBar, MessageBarType } from "office-ui-fabric-react";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import CodeContext from '../../code/CodeContext';


export default function Editor(props) {
  const { code, setCode } = useContext(CodeContext);

    return (
      <>
      <div className="centered">
        <PrimaryButton onClick={() => getCode()}>Save Code</PrimaryButton>
      </div>
      <div id="editor">
        <AceEditor
          value={code}
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

  function onChange(newValue) {
    setCode(newValue) 
  }
  
  function onLoad() {
    setValue={code}
  }
  
  function getCode() {
    //var editor = ace.edit("editor");
    //var code = editor.getSession().getValue();
    console.log("code", code);
  }
}
