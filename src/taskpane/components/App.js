import React from "react";
import Header from "./Header";
import { UserProvider } from "../users/UserContext";
import { AuthProvider } from "../users/AuthContext";
import { CodeProvider } from '../code/CodeContext'

import PivotMenu from "./PivotMenu";

export default function App() {
  
  return (
    <UserProvider>
      <AuthProvider>
        <CodeProvider>
          <div>
            <Header logo="/assets/viztext.png" title="" message=" " />
            <PivotMenu />
          </div>
        </CodeProvider>
      </AuthProvider>
    </UserProvider>
  );
}