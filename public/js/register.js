const registerLink = document.getElementById('hideRegister');
const loginLink = document.getElementById('hideLogin');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

registerLink.addEventListener('click', () => {
    showLogin();
});

loginLink.addEventListener('click', () => {
    showRegister();
});

function showRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function showLogin() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}