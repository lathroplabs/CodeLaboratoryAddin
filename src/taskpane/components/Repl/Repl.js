import React from "react";
import { PrimaryButton } from "office-ui-fabric-react";


function iframe() {
  return {
      __html: `<iframe name="repl" src="/assets/replSource.html" width="540" height="450"></iframe>`
  }
}

function loadInputData() {
  window.frames['repl'].window.input_data = [1,2,3]
}


export default function Repl() {
  return (
      <div>
        <PrimaryButton onClick={() => loadInputData()}>Load Input Data</PrimaryButton>
        <div dangerouslySetInnerHTML={iframe()} />
      </div>)
}

