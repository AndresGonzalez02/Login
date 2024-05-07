import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js'
//import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics .js'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAtc-f5N6Onj67YKjj-YTnqIWjHdaF7nlk",
  authDomain: "web2024-9794a.firebaseapp.com",
  projectId: "web2024-9794a",
  storageBucket: "web2024-9794a.appspot.com",
  messagingSenderId: "264039668151",
  appId: "1:264039668151:web:1eb0e1b53779bf30ecf032",
  measurementId: "G-XSNSQ8FFLW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const register = async (email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  if (user) {
    await sendEmailVerification(user);
    const cedula = document.getElementById("cedula").value;
    const nombre = document.getElementById("nombre").value;
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    await saveUserData(cedula, nombre, fechaNacimiento, direccion, telefono, email);
  }
  return result;
};


const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);

const facebookProvider = new FacebookAuthProvider();

export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);

//metodo de inicio de sesión
export const loginvalidation=(email,password)=>
  signInWithEmailAndPassword(auth, email, password)

export const logout=()=>signOut(auth);

export function userstate() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid)
    } else {
      window.location.href="../index.html"
    }
  });
}

export const sendResetEmail = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
  

export const deleteAccount = async (email, password) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(user, credential);
    await user.delete();
    alert('Cuenta eliminada exitosamente');
  } catch (error) {
    alert('Error al eliminar la cuenta');
    console.log('Error al eliminar la cuenta: ', error);
  }
};

export const saveUserData = async (cedula, nombre, fechaNacimiento, direccion, telefono, email) => {
  try {
    await setDoc(doc(db, 'datosUsuario', email), {
      cedula,
      nombre,
      fechaNacimiento,
      direccion,
      telefono,
    });
  } catch (error) {
    console.log('Error al guardar los datos del usuario: ', error);
  }
};