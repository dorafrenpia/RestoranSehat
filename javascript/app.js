// logout.js (misalnya)
import { auth } from "./firebase.js";
import { signOut } from "firebase/auth"; // pakai import modular baru

window.logout = function () {
  // Hapus status login Firebase di localStorage (kalau kamu simpan flag login sendiri)
  localStorage.removeItem("isLoggedIn");

  const loginBtn = document.getElementById("loginBtn");
  const sendBtn = document.getElementById("sendBtn");

  if (loginBtn && window.updateLoginButton) window.updateLoginButton();
  if (sendBtn) sendBtn.disabled = true;

  // Logout dari Firebase
  signOut(auth).finally(() => {
    alert("✅ Berhasil logout dari aplikasi!");
    window.location.replace("/Login/login.html");
  });
};
