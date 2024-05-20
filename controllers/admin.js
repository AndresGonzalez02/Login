import { logout } from './global.js';
import { collection, getDocs, deleteDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js';
import { db, register2 } from './global.js';


document.addEventListener('DOMContentLoaded', (event) => {
  const cerrarSesionBtn = document.getElementById('logout2');
  const verUsuariosBtn = document.getElementById('verUsuarios');
  const registerBtn2 = document.getElementById("registerBtn2");

  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener('click', cerrarSesion);
  }

  if (verUsuariosBtn) {
    verUsuariosBtn.addEventListener('click', renderUserTable);
  }

  if (registerBtn2) {
    registerBtn2.addEventListener('click', async () => {
      const email = document.getElementById("email2").value;
      const password = document.getElementById("pass2").value;

      // Verifica que la contraseña sea válida antes de intentar registrar al usuario
      if (!validatePassword(password)) {
        alert('La contraseña no cumple con los requisitos');
        return;
      }

      try {
        const result = await register2(email, password);
        const user = result.user;
        alert('Registration successful. A verification email has been sent to ' + user.email);
        window.location.href='/Login/templates/admin.html';
      } catch (error) {
        alert('Error registration not successful');
        console.log('registration not validated');
      }
    });
  }

  // ... Resto de tu código ...

});



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

function validatePassword(password) {
  if (password.length < 8) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
    return false;
  }
  return true;
}

/*registerBtn2.addEventListener('click', async () => {
  const email = document.getElementById("email2").value;
  const password = document.getElementById("pass2").value;

  // Verifica que la contraseña sea válida antes de intentar registrar al usuario
  if (!validatePassword(password)) {
    alert('La contraseña no cumple con los requisitos');
    return;
  }

  try {
    const result = await register2(email, password);
    const user = result.user;
    alert('Registration successful. A verification email has been sent to ' + user.email);
    window.location.href='/Login/templates/admin.html';
  } catch (error) {
    alert('Error registration not successful');
    console.log('registration not validated');
  }
});*/