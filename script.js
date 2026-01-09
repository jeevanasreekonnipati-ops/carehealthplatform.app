function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "user@example.com" && password === "1234") {
    localStorage.setItem("user", email);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("login-msg").innerText = "Invalid credentials!";
  }
  return false;
}

window.onload = function() {
  const user = localStorage.getItem("user");
  if (user && document.getElementById("user-name")) {
    document.getElementById("user-name").innerText = user;
  }
};
