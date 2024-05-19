import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js'
import { setDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
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
} from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
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

export { auth };

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
export const loginvalidation = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const userDocRef = doc(db, 'datosUsuario', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData.rol === 'usuario') {
        // If the user's role is "usuario", redirect to pagina.html
        window.location.href = '/Login/templates/pagina.html';
      } else if (userData.rol === 'admin') {
        // If the user's role is "admin", redirect to Administrador.html
        window.location.href = '/Login/templates/admin.html';
      }
    } else {
      console.log('User document does not exist.');
    }
    return user;
  } catch (error) {
    console.log('Error logging in: ', error);
    alert('Error al iniciar sesión');
  }
};

export const logout=()=>signOut(auth);

export function userstate() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid)
      await displayUserData(); // Ahora displayUserData está definida en este módulo
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
  const user = auth.currentUser;
  if (user) {
    const uid = user.uid;
    await setDoc(doc(db, 'datosUsuario', uid), {
      cedula,
      nombre,
      fechaNacimiento,
      direccion,
      telefono,
      email,
      rol: "usuario",
    });
  } else {
    console.log('No user is signed in.');
  }
};

export const displayUserData = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'datosUsuario', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      // Now you can access the user data and display it in the HTML
      document.getElementById('cedula').value = userData.cedula;
      document.getElementById('nombre').value = userData.nombre;
      document.getElementById('fechaNacimiento').value = userData.fechaNacimiento;
      document.getElementById('direccion').value = userData.direccion;
      document.getElementById('telefono').value = userData.telefono;
    } else {
      console.log('User document does not exist.');
    }
  } else {
    console.log('User is not signed in.');
  }
};