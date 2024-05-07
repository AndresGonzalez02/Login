import { userstate, logout, deleteAccount } from "./global.js";

userstate()

const cerrar=document.getElementById('logout')

async function sesion(){
    const validar = logout()
    const verificar = await validar

    .then((verificar) => {
        alert ('sesion cerrada')
        window.location.href="../index.html"
    }).catch((error) => {
        alert('Sesion no cerrada')
    });
}

window.addEventListener('DOMContentLoaded', async()=>{
    cerrar.addEventListener('click',sesion)
    await displayUserData();
})



const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteAccountForm = document.getElementById('deleteAccountForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener('click', () => {
    emailInput.value = auth.currentUser.email;
  });
}

if (deleteAccountForm) {
  deleteAccountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    await deleteAccount(email, password);
  });
}

async function displayUserData() {
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, 'datosUsuario', user.email);
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
}


