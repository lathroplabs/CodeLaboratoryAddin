import React, { createContext, useState } from "react";

const CodeContext = createContext();
export default CodeContext;

export function CodeProvider({ children }) {
  const [codeObj, setCodeObj] = useState({codeString: ''});

  return <CodeContext.Provider value={{ codeObj, setCodeObj }}>{children}</CodeContext.Provider>;
}