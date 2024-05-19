import { logout } from './global.js';
import { db } from './global.js';
import { collection, getDocs } from './global.js';

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


async function renderUserTable() {
    const userCollectionRef = collection(db, 'datosUsuario');
    const querySnapshot = await getDocs(userCollectionRef);
    let tableHTML = "<table><tr><th>Cédula</th><th>Nombre</th><th>Fecha de Nacimiento</th><th>Dirección</th><th>Teléfono</th><th>Email</th></tr>";
  
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      tableHTML += `<tr>
                      <td>${userData.cedula}</td>
                      <td>${userData.nombre}</td>
                      <td>${userData.fechaNacimiento}</td>
                      <td>${userData.direccion}</td>
                      <td>${userData.telefono}</td>
                      <td>${userData.email}</td>
                    </tr>`;
    });
  
    tableHTML += "</table>";
    document.getElementById('tablaUsuarios').innerHTML = tableHTML;
  }
  
  // Llama a la función cuando se carga la página o cuando sea necesario
  window.addEventListener('DOMContentLoaded', renderUserTable);
  