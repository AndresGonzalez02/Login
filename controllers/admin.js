import { 
    //userstate, 
    logout, 
    deleteAccount,
    userstate, 
    //displayUserData,
    //auth
} from "./global.js";

userstate();

const crearUsuarioBtn = document.getElementById("crearUsuarioBtn");
const eliminarUsuarioBtn = document.getElementById("eliminarUsuarioBtn");
const verUsuariosBtn = document.getElementById("verUsuariosBtn");
const cerrarSesionBtn = document.getElementById("cerrarSesionBtn");

crearUsuarioBtn.addEventListener("click", () => {
  // Display a form for creating a new user
  const form = document.createElement("form");
  form.innerHTML = `
    <label for="nombre">Nombre:</label><br>
    <input type="text" id="nombre" name="nombre"><br>
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email"><br>
    <label for="password">Contraseña:</label><br>
    <input type="password" id="password" name="password"><br>
    <label for="rol">Rol:</label><br>
    <select id="rol" name="rol">
      <option value="usuario">Usuario</option>
      <option value="admin">Admin</option>
    </select><br>
    <input type="submit" value="Crear usuario">
  `;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = form.nombre.value;
    const email = form.email.value;
    const password = form.password.value;
    const rol = form.rol.value;
    // Create a new user with the provided information
    createUser(nombre, email, password, rol);
  });
  document.body.appendChild(form);
});

eliminarUsuarioBtn.addEventListener("click", () => {
  // Display a form for deleting a user
  const form = document.createElement("form");
  form.innerHTML = `
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email"><br>
    <input type="submit" value="Eliminar usuario">
  `;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value;
    // Delete the user with the provided email
    deleteUser(email);
  });
  document.body.appendChild(form);
});

verUsuariosBtn.addEventListener("click", () => {
  // Display a list of registered users
  const users = getRegisteredUsers();
  const list = document.createElement("ul");
  users.forEach((user) => {
    const item = document.createElement("li");
    item.textContent = `${user.nombre} (${user.email}) - ${user.rol}`;
    list.appendChild(item);
  });
  document.body.appendChild(list);
});

cerrarSesionBtn.addEventListener("click", async () => {
  try {
    await logout();
    alert('Sesión cerrada');
    window.location.href = "../index.html";
  } catch (error) {
    alert('Error al cerrar sesión');
    console.log("Error al cerrar sesión:", error);
  }
});

eliminarCuentaBtn.addEventListener("click", async () => {
  // Delete the current user's account
  const email = prompt("Enter the email of the account to delete:");
  if (email) {
    try {
      await deleteAccount(email);
      alert("Account deleted successfully");
    } catch (error) {
      alert("Error deleting account");
      console.log("Error deleting account:", error);
    }
  }
});

