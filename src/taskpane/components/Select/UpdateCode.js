import React, { useState, useEffect, useContext } from "react";
import { PrimaryButton, DefaultButton, TextField, MessageBar, MessageBarType } from "office-ui-fabric-react";
import { Dialog, DialogType, DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { updateModel, deleteModelFirebase } from "../../../firebase/firebaseRepository";
import CodeContext from '../../code/CodeContext';

export default function UpdateModel() {
  const { codeObj, setCodeObj } = useContext(CodeContext);
  const [writeToDB, setWriteToDB] = useState(false);
  const [editing, setEditing] = useState(false);
  const [modelNameError, setModelNameError] = useState(false);
  const [modelDescriptionError, setModelDescriptionError] = useState(false);
  const [modelSaved, setModelSaved] = useState(false);
  const [hideDeleteDialog, setHideDeleteDialog] = useState(true);
  const [hideClearDialog, setHideClearDialog] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Encountered an error");

  const clearIcon = { iconName: "EraseTool" };
  const editIcon = { iconName: "Edit" };
  const deleteIcon = { iconName: "Delete" };


  useEffect(() => {
    if (writeToDB) {
      updateModel(codeObj["id"], codeObj, setModelSaved, setShowError, setErrorMsg).then(() => setWriteToDB(false));
    }
  }, [writeToDB]);

  const deleteDialogContentProps = {
    type: DialogType.normal,
    title: "Delete Code",
    closeButtonAriaLabel: "Close",
    subText: "Do you want to delete the selected code?"
  };

  const clearDialogContentProps = {
    type: DialogType.normal,
    title: "Clear the current Code",
    closeButtonAriaLabel: "Close",
    subText: "Do you want to clear the current code from memory?"
  };
  
  const modalProps = React.useMemo(
    () => ({
      titleAriaId: "labelId",
      subtitleAriaId: "subTextId",
      isBlocking: false
    }),
    []
  );

  return (
    <div className="centered">

      {codeObj && (
        <>
          <div id="current-model-name">
            <b>Active Code:</b> {codeObj ? `${codeObj.name}` : "No active COde"}
          </div>
          <div className="update-model-buttons">
            <IconButton iconProps={clearIcon} title="Clear Code" ariaLabel="Edit" onClick={clearConfirm} />
            <IconButton iconProps={editIcon} title="Edit Code" ariaLabel="Edit" onClick={editCode} />
            <IconButton iconProps={deleteIcon} title="Delete Code" ariaLabel="Delete" onClick={deleteConfirm} />
          </div>
          <div>
            {modelSaved && (
              <MessageBar
                messageBarType={MessageBarType.success}
                isMultiline={false}
                onDismiss={() => setModelSaved(false)}
                dismissButtonAriaLabel="Close"
              >
                The model has been saved.
              </MessageBar>
            )}
          </div>
        </>
      )}

      {editing && (
        <div className="centered">
          {modelNameError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              onDismiss={() => setModelNameError(false)}
              dismissButtonAriaLabel="Close"
            >
              Please enter a name for the model.
            </MessageBar>
          )}
          {modelDescriptionError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              onDismiss={() => setModelDescriptionError(false)}
              dismissButtonAriaLabel="Close"
            >
              Please enter a description for the model.
            </MessageBar>
          )}
          <TextField label="Code Name" id="name-input" defaultValue={codeObj["name"]} />
          <TextField
            label="Code Description"
            id="description-input"
            multiline
            defaultValue={codeObj["description"]}
          />
          <br></br>
          <PrimaryButton text="Save" onClick={saveCode} />
        </div>
      )}
      {showError && (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          onDismiss={() => {
            setShowError(false);
            setErrorMsg("Encountered an error");
          }}
          dismissButtonAriaLabel="Close"
        >
          {errorMsg}
        </MessageBar>
      )}
      <Dialog
        hidden={hideDeleteDialog}
        onDismiss={deleteCode}
        dialogContentProps={deleteDialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={deleteCode} text="Delete" />
          <DefaultButton onClick={() => setHideDeleteDialog(true)} text="Cancel" />
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={hideClearDialog}
        onDismiss={clearCode}
        dialogContentProps={clearDialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={clearCode} text="Clear" />
          <DefaultButton onClick={() => setHideClearDialog(true)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  );

  function clearConfirm() {
    setHideClearDialog(false);
  }

  function clearCode() {
    setCodeObj({});
    setHideClearDialog(true);
    const currentModelName = document.getElementById("current-model-name");
    currentModelName.innerHTML = "Active Code: No Code Loaded";
  }

  function editCode() {
    setEditing(true);
  }

  function saveCode() {
    try {
      const code_name = document.getElementById("name-input").value;
      if (code_name.length < 1) {
        setModelNameError(true);
        return;
      }
      const code_description = document.getElementById("description-input").value;
      if (code_description.length < 1) {
        setModelDescriptionError(true);
        return;
      }

      setCodeObj({
        ...codeObj,
        name: model_name,
        description: model_description
      });

      setWriteToDB(true);
      setEditing(false);
    } catch (err) {
      setShowError(true);
      setErrorMsg("Error saving model: " + err);
    }
  }

  function deleteConfirm() {
    setHideDeleteDialog(false);
  }

  function deleteCode() {
    try {
      const refId = modelMeta["id"];
      setModelMeta({});
      setHideDeleteDialog(true);
      deleteModelFirebase(refId);
    } catch (error) {
      setShowError(true);
      setErrorMsg("Error deleting code: " + err);
    }
  }
}
