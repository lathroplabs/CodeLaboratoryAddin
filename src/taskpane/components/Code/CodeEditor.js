/* eslint-disable react/no-string-refs */
import React, { useContext } from "react";
import AceEditor from "react-ace";
import { PrimaryButton, TextField, MessageBar, MessageBarType } from "office-ui-fabric-react";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import CodeContext from '../../code/CodeContext';
import { writeCodeToFirestore } from '../../../firebase/firebaseRepository'


export default function Editor(props) {
  const { codeObj, setCodeObj } = useContext(CodeContext);

    return (
      <>
      <div id="save-code-btn-1" className="centered">
        <PrimaryButton onClick={() => saveCode()}>Save Code</PrimaryButton>
      </div>
      <div id="code-data" className="centered" style={{ display: "none" }}>
        <TextField label="Code Name" id="name-input" />
        <TextField label="Code Description" id="description-input" multiline />
        <PrimaryButton text="Save" onClick={() => saveCode()} />
      </div>
      <div id="editor">
        <AceEditor
          value={codeObj.codeString}
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
    setCodeObj({
      ...codeObj,
      codeString: newValue
    }) 
  }
  
  function getCode() {
    console.log("code", codeObj);
  }

  function saveCode() {
    if (! codeObj.name) {
      const dataDisplay = document.getElementById("code-data")
      const saveBtnOne = document.getElementById("save-code-btn-1")
      saveBtnOne.style.display = 'none'
      dataDisplay.style.display = 'block'
      const modelName = document.getElementById("name-input").value;
      const modelDescription = document.getElementById("description-input").value;
      const obj = {
        ...codeObj,
        name: modelName,
        description: modelDescription
      }
      setCodeObj(obj)
      writeCodeToFirestore(obj, setCodeObj, '', '', '')
      console.log('obj', obj)
    } else {
      writeCodeToFirestore(codeObj, setCodeObj, '', '', '')
    }
  }
}
