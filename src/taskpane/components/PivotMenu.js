import React, { useState, useEffect, useContext } from "react";
import { Label } from "office-ui-fabric-react/lib/Label";
import { Pivot, PivotItem } from "office-ui-fabric-react/lib/Pivot";
import User from "./User/index";
import CodeEditor from './Code/index'
import SelectCode from './Select/index'
import HomeHelpPanel from "./HelpPanels/UserHelp";
import CreateHelpPanel from "./HelpPanels/CreateHelp";
import firebase from "firebase";
import "firebase/auth";

export default function PivotMenu() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    let user = firebase.auth().currentUser;
    if (mounted) {
      user ? setLoggedIn(true) : setLoggedIn(false);
    }
    return () => {
      mounted = false;
    };
  }, [loggedIn, setLoggedIn]);

  return (
    <div>
      <Pivot>
        <PivotItem
          itemKey="0"
          headerText="User"
        >
          <div className="pivot-head">
            <Label>User Info</Label>
            <HomeHelpPanel></HomeHelpPanel>
          </div>
          <User setLoggedIn={setLoggedIn} />
        </PivotItem>
        <PivotItem
          itemKey="1"
          headerText="Code"
          headerButtonProps={{
            disabled: !loggedIn
          }}
        >
          <div className="pivot-head">
            <Label>Edit Code</Label>
            <CreateHelpPanel />
          </div>
          <CodeEditor />
        </PivotItem>
        <PivotItem
          itemKey="2"
          headerText="Select"
          headerButtonProps={{
            disabled: !loggedIn
          }}
        >
          <div className="pivot-head">
            <Label>Select Saved Code</Label>
          </div>
          <SelectCode />
        </PivotItem>
      </Pivot>
    </div>
  );
}
