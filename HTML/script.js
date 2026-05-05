const form = document.getElementById("loginForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

function validateName() {
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Name is required";
        return false;
    } else if (nameInput.value.length < 3) {
        nameError.textContent = "Name must be at least 3 characters";
        return false;
    }
    nameError.textContent = "";
    return true;
}

function validateEmail() {
    const regex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (emailInput.value.trim() === "") {
        emailError.textContent = "Email is required";
        return false;
    } else if (!regex.test(emailInput.value)) {
        emailError.textContent = "Enter a valid email";
        return false;
    }
    emailError.textContent = "";
    return true;
}

function validatePassword() {
    if (passwordInput.value.trim() === "") {
        passwordError.textContent = "Password is required";
        return false;
    } else if (passwordInput.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        return false;
    }
    passwordError.textContent = "";
    return true;
}

// Real-time validation
nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);

// On submit
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isNameValid && isEmailValid && isPasswordValid) {
        alert("Form submitted successfully!");
        form.reset();
    }
});