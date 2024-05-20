import { logout } from './global.js';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { db } from './global.js';


const cerrarSesionBtn = document.getElementById('logout2');
const verUsuariosBtn = document.getElementById('verUsuarios');

async function reauthenticateAdmin() {
  const adminEmail = 'michael.gonzalezolaya02@gmail.com'; // Deberías obtener esto de forma segura
  const adminPassword = 'Andres#02'; // Deberías obtener esto de forma segura
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  renderUserTable()
}

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
verUsuariosBtn.addEventListener('click', renderUserTable);

async function renderUserTable() {
  const userCollectionRef = collection(db, 'datosUsuario');
  const querySnapshot = await getDocs(userCollectionRef);
  let tableHTML = "<table><tr><th>Cédula</th><th>Nombre</th><th>Fecha de Nacimiento</th><th>Dirección</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr>";

  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    tableHTML += `<tr>
                    <td>${userData.cedula}</td>
                    <td>${userData.nombre}</td>
                    <td>${userData.fechaNacimiento}</td>
                    <td>${userData.direccion}</td>
                    <td>${userData.telefono}</td>
                    <td>${userData.email}</td>
                    <td><button onclick="window.deleteUser('${doc.id}')">Eliminar</button>
                  </tr>`;
  });

  tableHTML += "</table>";
  document.getElementById('tablaUsuarios').innerHTML = tableHTML;
}
  
//  window.addEventListener('DOMContentLoaded', renderUserTable);

window.deleteUser = async (docId) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
    const userDocRef = doc(db, 'datosUsuario', docId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      alert('No se encontraron datos de usuario.');
      return;
    }

    const userData = userDocSnap.data();
    const email = userData.email;
    console.log(email);
    // Asumiendo que tienes un campo 'password' en tus documentos de Firestore, lo cual no es recomendable
    const password = userData.password;
    console.log(password);


    try {
      const auth = getAuth();
      // Autenticar al usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
      // Eliminar los datos del usuario de Firestore
      await deleteDoc(userDocRef);
      // Eliminar la cuenta de autenticación
      const uid = userCredential.user.uid;
      console.log(uid);
      await userCredential.user.delete();

      alert('Cuenta eliminada exitosamente');
      // Actualizar la interfaz de usuario aquí
      await reauthenticateAdmin();
    } catch (error) {
      alert('Error al eliminar la cuenta: ' + error.message);
      await reauthenticateAdmin();
    }
  }
};

// Mantener la sesión del administrador activa
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    // Usuario está autenticado, posiblemente el administrador
    console.log('Administrador autenticado:', user.email);
  } else {
    // Usuario no está autenticado o la sesión se cerró
    console.log('No hay usuario autenticado.');
  }
});