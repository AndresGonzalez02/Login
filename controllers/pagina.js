import { userstate, logout, deleteAccount, displayUserData, db } from "./global.js";
import { getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';

userstate();

const cerrarLogout = document.getElementById('logout');
const cerrarLogout2 = document.getElementById('logout2');
const verUsuariosBtn = document.getElementById('verUsuarios');

async function sesion() {
  try {
    await logout();
    alert('Sesión cerrada');
    window.location.href = "../index.html";
  } catch (error) {
    alert('Sesión no cerrada: ' + error.message);
  }
}

async function mostrarUsuarios() {
  const querySnapshot = await getDocs(collection(db, 'datosUsuario'));
  let tabla = '<table>';
  tabla += '<tr><th>Email</th><th>Cédula</th><th>Nombre</th><th>Fecha de Nacimiento</th><th>Dirección</th><th>Teléfono</th></tr>';
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    tabla += `<tr><td>${data.email}</td><td>${data.cedula}</td><td>${data.nombre}</td><td>${data.fechaNacimiento}</td><td>${data.direccion}</td><td>${data.telefono}</td></tr>`;
  });
  tabla += '</table>';
  document.getElementById('tablaUsuarios').innerHTML = tabla;
}

window.addEventListener('DOMContentLoaded', async () => {
  if (cerrarLogout) {
    cerrarLogout.addEventListener('click', sesion);
  }

  if (cerrarLogout2) {
    cerrarLogout2.addEventListener('click', sesion);
  }

  if (verUsuariosBtn) {
    verUsuariosBtn.addEventListener('click', mostrarUsuarios);
  }

  await displayUserData();
});

const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const deleteAccountForm = document.getElementById('deleteAccountForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


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


