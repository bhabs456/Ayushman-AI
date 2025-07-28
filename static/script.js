// Toggle between Login and Signup
function toggleform() {
  const loginBox = document.getElementById("login-box");
  const signupBox = document.getElementById("signup-box");

  // Fix: Use computed style, not inline style
  const isLoginVisible = window.getComputedStyle(loginBox).display !== "none";

  if (isLoginVisible) {
    loginBox.style.display = "none";
    signupBox.style.display = "flex"; 
    localStorage.setItem("activeForm", "signup");
  } else {
    loginBox.style.display = "flex";
    signupBox.style.display = "none";
    localStorage.setItem("activeForm", "login");
  }
}

// Form Submission
function submitLogin() {
  const form = document.getElementById("login-form");

  if (validateLogin()) {
    let actionInput = form.querySelector('input[name="action"]');
    if (!actionInput) {
      actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      form.appendChild(actionInput);
    }
    actionInput.value = "login";
    form.submit();
  }
}

function submitSignup() {
  const form = document.getElementById("signup-form");

  if (validateSignup()) {
    let actionInput = form.querySelector('input[name="action"]');
    if (!actionInput) {
      actionInput = document.createElement("input");
      actionInput.type = "hidden";
      actionInput.name = "action";
      form.appendChild(actionInput);
    }
    actionInput.value = "signup";
    form.submit();
  }
}

// Login Validation
function validateLogin() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (email === "" || password === "") {
    showModalMessage("Please fill in both email and password.");
    return false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showModalMessage("Please enter a valid email address.");
    return false;
  }

  if (password.length < 6) {
    showModalMessage("Password should be at least 6 characters.");
    return false;
  }

  return true;
}

// Signup Validation
function validateSignup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const mobile = document.getElementById("signup-mobile").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

  if (!name || !email || !mobile || !password || !confirmPassword) {
    showModalMessage("All fields are required.");
    return false;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showModalMessage("Invalid email format.");
    return false;
  }

  if (!/^\d{10}$/.test(mobile)) {
    showModalMessage("Mobile number must be 10 digits.");
    return false;
  }

  if (password.length < 6) {
    showModalMessage("Password should be at least 6 characters.");
    return false;
  }

  if (password !== confirmPassword) {
    showModalMessage("Passwords do not match.");
    return false;
  }

  return true;
}

// Load the correct form on page load
document.addEventListener("DOMContentLoaded", function () {
  const loginBox = document.getElementById("login-box");
  const signupBox = document.getElementById("signup-box");
  const activeForm = localStorage.getItem("activeForm") || "login";

  if (activeForm === "signup") {
    loginBox.style.display = "none";
    signupBox.style.display = "flex";
  } else {
    loginBox.style.display = "flex";
    signupBox.style.display = "none";
  }
});

// Modal Trigger
function showModalMessage(message) {
  const modalText = document.getElementById("modal-message");
  const modalElement = document.getElementById("flashModal");

  if (modalText && modalElement) {
    modalText.innerText = message;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  } else {
    alert(message); // fallback if modal not found
  }
}

