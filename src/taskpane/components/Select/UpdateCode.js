import React, { useState, useEffect, useContext } from "react";
import { PrimaryButton, DefaultButton, TextField, MessageBar, MessageBarType } from "office-ui-fabric-react";
import { Dialog, DialogType, DialogFooter } from "office-ui-fabric-react/lib/Dialog";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { updateModel, deleteModelFirebase } from "../../../firebase/firebaseRepository";
import ModelMetaContext from "../../models/ModelMetaContext";

export default function UpdateModel() {
  const { modelMeta, setModelMeta } = useContext(ModelMetaContext);
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
      updateModel(modelMeta["id"], modelMeta, setModelSaved, setShowError, setErrorMsg).then(() => setWriteToDB(false));
    }
  }, [writeToDB]);

  const deleteDialogContentProps = {
    type: DialogType.normal,
    title: "Delete Model",
    closeButtonAriaLabel: "Close",
    subText: "Do you want to delete the selected model?"
  };

  const clearDialogContentProps = {
    type: DialogType.normal,
    title: "Clear the current Model",
    closeButtonAriaLabel: "Close",
    subText: "Do you want to clear the current model from memory and delete all associated worksheets?"
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

      {modelMeta && (
        <>
          <div id="current-model-name">
            <b>Active Model:</b> {modelMeta ? `${modelMeta.name}` : "No active Model"}
          </div>
          <div className="update-model-buttons">
            <IconButton iconProps={clearIcon} title="Clear Model" ariaLabel="Edit" onClick={clearConfirm} />
            <IconButton iconProps={editIcon} title="Edit Model" ariaLabel="Edit" onClick={editModel} />
            <IconButton iconProps={deleteIcon} title="Delete Model" ariaLabel="Delete" onClick={deleteConfirm} />
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
          <TextField label="Model Name" id="name-input" defaultValue={modelMeta["name"]} />
          <TextField
            label="Model Description"
            id="description-input"
            multiline
            defaultValue={modelMeta["description"]}
          />
          <br></br>
          <PrimaryButton text="Save" onClick={saveModel} />
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
        onDismiss={deleteModel}
        dialogContentProps={deleteDialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={deleteModel} text="Delete" />
          <DefaultButton onClick={() => setHideDeleteDialog(true)} text="Cancel" />
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={hideClearDialog}
        onDismiss={clearModel}
        dialogContentProps={clearDialogContentProps}
        modalProps={modalProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={clearModel} text="Clear" />
          <DefaultButton onClick={() => setHideClearDialog(true)} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  );

  function clearConfirm() {
    setHideClearDialog(false);
  }

  async function clearModel() {
    await Excel.run(async context => {
      context.workbook.worksheets.getItemOrNullObject("InputData").delete();
      context.workbook.worksheets.getItemOrNullObject("ModelSummary").delete();
      context.workbook.worksheets.getItemOrNullObject("ModelMetadata").delete();
      context.workbook.worksheets.getItemOrNullObject("TrainingData").delete();
      context.workbook.worksheets.getItemOrNullObject("PredictionData").delete();
      context.workbook.worksheets.getItemOrNullObject("ConfusionMatrix").delete();
      context.workbook.worksheets.getItemOrNullObject("DataSummary").delete();
      setModelMeta(null);
      setHideClearDialog(true);
      await context.sync();
      const currentModelName = document.getElementById("current-model-name");
      currentModelName.innerHTML = "Active Model: No Model Loaded";
    });
  }

  function editModel() {
    setEditing(true);
  }

  function saveModel() {
    try {
      const model_name = document.getElementById("name-input").value;
      if (model_name.length < 1) {
        setModelNameError(true);
        return;
      }
      const model_description = document.getElementById("description-input").value;
      if (model_description.length < 1) {
        setModelDescriptionError(true);
        return;
      }

      setModelMeta({
        ...modelMeta,
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

  function deleteModel() {
    try {
      const refId = modelMeta["id"];
      setModelMeta({});
      setHideDeleteDialog(true);
      deleteModelFirebase(refId);
    } catch (error) {
      setShowError(true);
      setErrorMsg("Error deleting model: " + err);
    }
  }
}
