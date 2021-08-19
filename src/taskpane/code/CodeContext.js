import React, { createContext, useState } from "react";

const CodeContext = createContext();
export default CodeContext;

export function CodeProvider({ children }) {
  const [code, setCode] = useState(null);

  return <CodeContext.Provider value={{ code, setCode }}>{children}</CodeContext.Provider>;
}