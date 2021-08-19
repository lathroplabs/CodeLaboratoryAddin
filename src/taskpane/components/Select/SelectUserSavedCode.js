import React, { useState, useEffect, useContext } from "react";
import { Announced } from "office-ui-fabric-react/lib/Announced";
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode } from "office-ui-fabric-react/lib/DetailsList";
import { MarqueeSelection } from "office-ui-fabric-react/lib/MarqueeSelection";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { mergeStyles } from "office-ui-fabric-react/lib/Styling";
import { Text } from "office-ui-fabric-react/lib/Text";
import { readSavedCodeFromFirestore } from "../../../firebase/firebaseRepository";
import CodeContext from '../../code/CodeContext';

const exampleChildClass = mergeStyles({
  display: "block",
  marginBottom: "10px"
});

export default function SavedCodeList() {
  const { codeObj, setCodeObj } = useContext(CodeContext);
  const [items, setItems] = useState([]);
  const [selectionDetails, setSelectionDetails] = useState(null);

  const selection = new Selection({
    onSelectionChanged: () => {
      const selectionCount = selection.getSelectedCount();
      switch (selectionCount) {
        case 0:
          setSelectionDetails("No Code selected");
          return;
        case 1:
          const selectmsg = document.getElementById("select-text");
          const selectedCode = selection.getSelection()[0];
          selectmsg.style.display = "none";
          // Model processing
          setCodeObj(selectedCode);
          setSelectionDetails("Code selected: " + selectedCode.name);
          return;
        default:
          setSelectionDetails("No Code selected");
      }
    }
  });

  const columns = [
    { key: "column1", name: "Name", fieldName: "name", minWidth: 100, maxWidth: 100 },
    {
      key: "column2",
      name: "Description",
      fieldName: "description",
      minWidth: 100,
      maxWidth: 200,
      isMultiline: true
    }
  ];

  useEffect(() => {
    const fetchCode = async () => {
      let code_list = [];
      await readSavedCodeFromFirestore().then(codes => {
        codes.forEach(code_ => code_list.push(code_));
      });
      setItems(code_list);
    };
    fetchCode();
  }, [codeObj]);

  return (
    <Fabric>
      <div id="standard-model-list" className={exampleChildClass}>
        {selectionDetails}
      </div>
      <Text id="select-text">Please select Code from the list.</Text>
      <Announced message={selectionDetails} />
      <MarqueeSelection selection={selection}>
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.single}
          selection={selection}
          selectionPreservedOnEmptyClick={true}
        />
      </MarqueeSelection>
    </Fabric>
  );
}
