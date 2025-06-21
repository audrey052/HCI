document.addEventListener("DOMContentLoaded", () => {
  const signInScreen = document.getElementById("signInScreen");
  const passwordScreen = document.getElementById("passwordScreen");
  const emailOrPhoneInput = document.getElementById("emailOrPhone");
  const displayEmail = document.getElementById("displayEmail");
  const passwordInput = document.getElementById("password");
  const errorParagraph = document.getElementById("error");

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  window.showPasswordScreen = function () {
    const email = emailOrPhoneInput.value.trim();
    errorParagraph.textContent = "";

    if (!email) {
      errorParagraph.textContent = "Please enter your email";
      return;
    }

    if (email.includes("@")) {
      if (!isValidEmail(email)) {
        errorParagraph.textContent = "Please enter a valid email address.";
        return;
      }
    }

    displayEmail.textContent = email;
    signInScreen.style.display = "none";
    passwordScreen.style.display = "block";
  };

  window.showSignInScreen = function () {
    passwordScreen.style.display = "none";
    signInScreen.style.display = "block";
    passwordInput.value = "";
    errorParagraph.textContent = "";
  };

  window.login = function () {
    const email = emailOrPhoneInput.value.trim();
    const password = passwordInput.value;

    errorParagraph.textContent = "";

    if (!email) {
      errorParagraph.textContent = "Email cannot be empty.";
      return;
    }
    if (email.includes("@") && !isValidEmail(email)) {
      errorParagraph.textContent = "Please enter a valid email address.";
      return;
    }

    if (password.length < 5) {
      errorParagraph.textContent =
        "Password must be at least 5 characters long.";
      return;
    }

    errorParagraph.style.color = "green";
    errorParagraph.textContent = "Login successful! Redirecting...";
    window.location.replace("dashboard.html");
  };

  window.goBack = function () {
    history.back();
    emailOrPhoneInput.value = "";
    errorParagraph.textContent = "";
  };
});
