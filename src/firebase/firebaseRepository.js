import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { firestoreDb } from "./firebaseConfiguration";

export const getAuth = async (uid) => {
  try {
    const authRef = firestoreDb.collection('users').doc(uid);
    const doc = await authRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      return doc.data()
    }
    
  } catch (error) {
    console.log('Error', error)
  }
}

export const writeCodeToFirestore = async (codeMeta, setCodeMeta, setModelSaved, setShowError, setErrorMsg) => {
  firebase.auth().onAuthStateChanged(async usr => {
    const user = await getAuth(usr.uid)
    const document = firestoreDb.collection(`teams/${user.teamId}/code`).doc();
    const documentUuid = document.id;
    docRef = await document
      .set({
        ...codeMeta,
        id: documentUuid
      })
      .then(() => {
        setCodeMeta({
          ...modelMeta,
          id: documentUuid
        });
        save_model_json(documentUuid, [])
        setModelSaved(true)
      })
      .catch(error => {
        setErrorMsg(`There was an error saving the code: ${error} `);
        setShowError(true);
      });
  });
};

export const updateCodeField = async (code_id, field, value) => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async usr => {
      const user = await getAuth(usr.uid)
      if (user) {
        try {
          const modelRef = firestoreDb.collection(`teams/${user.teamId}/code`).doc(code_id);
          return modelRef
            .update({
              [field]: value
            })
            .then(() => {
              console.log("Code updated");
            })
            .catch(err => {
              console.log("Error updating code: ", err);
            });
        } catch (error) {
          console.log("Error", error);
        }
      }
    });
  });
};

export const updateCode = async (code, codeMeta, setCodeSaved, setShowError, setErrorMsg) => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async usr => {
      const user = await getAuth(usr.uid)
      if (user) {
        const code_id = codeMeta.id
        firestoreDb
          .collection(`teams/${user.teamId}/code`)
          .doc(code_id)
          .update(codeMeta)
          .then(() => {
            save_model_json(model_id, model)
            setModelSaved(true);
          })
          .catch(err => {
            setErrorMsg(`Error updating code: ${err}`);
            setShowError(true)
          });
      }
    });
  });
};

export const deleteCodeFirebase = async code_id => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async usr => {
      const user = await getAuth(usr.uid)
      if (user) {
        try {
          const codeRef = firestoreDb.collection(`teams/${user.teamId}/code`).doc(code_id);
          return codeRef
            .delete()
            .then(() => {
              console.log("Code deleted");
            })
            .catch(err => {
              console.log("Error deleting code: ", err);
            });
        } catch (error) {
          console.log("Error", error);
        }
      }
    });
  });
};

export const readSavedCodeFromFirestore = async () => {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async usr => {
      const user = await getAuth(usr.uid)
      if (user) {
        const codes = [];

        const codeCollection = firestoreDb.collection(`teams/${user.teamId}/code`);

        codeCollection.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let { id } = doc;
            const data = doc.data();
            codes.push({ id, ...data });
          });
          resolve(codes);
        });
      }
    });
  });
};

export const getCodeCountFromFirestore = async () => {
  return new Promise((resolve) => {
    firebase.auth().onAuthStateChanged(async (usr) => {
      const user = await getAuth(usr.uid)
      if (user) {
        let size
        const codeCollection = firestoreDb.collection(`teams/${user.teamId}/code`)

        codeCollection.get()
        .then((snapshot) => {
          size = snapshot.size
          resolve(size)
        })
      }
    })
  })
}

