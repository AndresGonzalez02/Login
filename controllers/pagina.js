import { userstate, logout, deleteAccount, displayUserData } from "./global.js";
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


