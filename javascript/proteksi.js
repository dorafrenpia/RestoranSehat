// proteksi.js
if (!localStorage.getItem("isLoggedIn")) {
  // Redirect ke halaman login
  window.location.replace("/login/login.html"); // sesuaikan path
}
