const form = document.getElementById("form");
const password1El = document.getElementById("password1");
const password2El = document.getElementById("password2");
const messageCotainer = document.querySelector(".message-container");
const message = document.getElementById("message");

let isValid = false

function validateForm() {
    // Using Contraint API
    isValid = form.checkValidity();
    // Style main messahe for an error
    message.textContent = "Please fill out the field.";
    message.style.color = "red";
    messageCotainer.style.borderColor = "red";
}

function processFormData(e) {
    e.preventDefault();
    // Validate Form
    validateForm()
}

// Event Listner
form.addEventListener("submit", processFormData)