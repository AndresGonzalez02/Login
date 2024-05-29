import { userstate, logout, deleteAccount, displayUserData } from "./global.js";
import { auth, db } from './global.js';

userstate()

const cerrar=document.getElementById('logout')

async function sesion() {
  try {
    await logout();
    alert('Sesión cerrada');
    window.location.href = "../index.html";
  } catch (error) {
    alert('Sesión no cerrada: ' + error.message);
  }
}
window.addEventListener('DOMContentLoaded', async () => {
  cerrar.addEventListener('click', sesion);
  await displayUserData();
  await setupEditDataModal();
});

const cerrarSesionBtn = document.getElementById('logout2');

async function cerrarSesion() {
  try {
    await logout();
    alert('Sesión de administrador cerrada');
    window.location.href = "../index.html";
  } catch (error) {
    alert('Error al cerrar sesión de administrador: ' + error.message);
  }
}

cerrarSesionBtn.addEventListener('click', cerrarSesion);

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


const editDataModal = new bootstrap.Modal(document.getElementById('editDataModal'));
const editDataForm = document.getElementById('editDataForm');

async function setupEditDataModal() {
  const userDocRef = db.collection('datosUsuario').doc(auth.currentUser.uid);
  const userDoc = await userDocRef.get();
  if (userDoc.exists) {
    const userData = userDoc.data();
    document.getElementById('editCedula').value = userData.cedula || '';
    document.getElementById('editNombre').value = userData.nombre || '';
    document.getElementById('editFechaNacimiento').value = userData.fechaNacimiento || '';
    document.getElementById('editDireccion').value = userData.direccion || '';
    document.getElementById('editTelefono').value = userData.telefono || '';
  } else {
    console.log('No such document!');
  }
}

async function updateUserData(userId, data) {
  try {
    await db.collection('datosUsuario').doc(userId).update(data);
    alert('Datos actualizados correctamente');
  } catch (error) {
    console.error("Error updating user data: ", error);
    alert('Error al actualizar los datos: ' + error.message);
  }
}

if (editDataForm) {
  editDataForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const updatedData = {
      cedula: document.getElementById('editCedula').value,
      nombre: document.getElementById('editNombre').value,
      fechaNacimiento: document.getElementById('editFechaNacimiento').value,
      direccion: document.getElementById('editDireccion').value,
      telefono: document.getElementById('editTelefono').value,
    };
    await updateUserData(auth.currentUser.uid, updatedData);
    editDataModal.hide();
    await displayUserData();
  });
}