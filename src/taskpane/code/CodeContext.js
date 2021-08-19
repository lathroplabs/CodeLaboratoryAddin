import React, { createContext, useState } from "react";

const CodeContext = createContext();
export default CodeContext;

export function CodeProvider({ children }) {
  const [codeString, setCodeString] = useState(null);

  return <CodeContext.Provider value={{ codeString, setCodeString }}>{children}</CodeContext.Provider>;
}