import { userstate, logout, deleteAccount, displayUserData, updateUserData } from "./global.js";
import { auth } from './global.js';

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
window.addEventListener('DOMContentLoaded', async()=>{
    cerrar.addEventListener('click',sesion)
    await displayUserData();
})

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

// Función para manejar la actualización de datos del usuario
const updateUserBtn = document.getElementById('updateUserBtn');

if (updateUserBtn) {
  updateUserBtn.addEventListener('click', async () => {
    const cedula = document.getElementById('editCedula').value;
    const nombre = document.getElementById('editNombre').value;
    const fechaNacimiento = document.getElementById('editFechaNacimiento').value;
    const direccion = document.getElementById('editDireccion').value;
    const telefono = document.getElementById('editTelefono').value;

    await updateUserData(
      cedula || undefined,
      nombre || undefined,
      fechaNacimiento || undefined,
      direccion || undefined,
      telefono || undefined
    );

    alert('Datos actualizados correctamente');
    //window.location.reload();
  });
}

// Prevenir el comportamiento predeterminado del formulario de edición de datos
/*const editDataForm = document.getElementById('editDataForm');

if (editDataForm) {
  editDataForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cedula = document.getElementById('editCedula').value;
    const nombre = document.getElementById('editNombre').value;
    const fechaNacimiento = document.getElementById('editFechaNacimiento').value;
    const direccion = document.getElementById('editDireccion').value;
    const telefono = document.getElementById('editTelefono').value;

    await updateUserData(
      cedula || undefined,
      nombre || undefined,
      fechaNacimiento || undefined,
      direccion || undefined,
      telefono || undefined
    );

    alert('Datos actualizados correctamente');
  });
}*/

// Evento para cargar los datos del usuario al cargar la página
/*window.addEventListener('DOMContentLoaded', async () => {
  await userstate(); // Verificar el estado de autenticación
  await displayUserData(); // Mostrar los datos del usuario
});*/
