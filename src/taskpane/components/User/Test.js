import React from 'react';
import { PrimaryButton, Label } from 'office-ui-fabric-react'

export default function TestButton() {
  
  return (
    <div className="centered">
      <Label>Test </Label>
      <PrimaryButton text="Test" onClick={runTest} allowDisabledFocus />
    </div>
  )

  async function runTest() {
    window.input_data = [1, 2, 3];
  }
}


