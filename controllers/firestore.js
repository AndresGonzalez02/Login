import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { app } from "./global.js";

const db = getFirestore(app);

export const addUserToFirestore = async (uid, data) => {
  await setDoc(doc(db, "datosUser", uid), data);
};

export const getUserFromFirestore = async (uid) => {
  const docSnap = await getDoc(doc(db, "datosUser", uid));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};
