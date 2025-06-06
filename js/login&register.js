// Toggle between Sign In and Sign Up
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

// Password toggle functionality
function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleIcon = document.getElementById(toggleId);
    
    toggleIcon.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    });
}

// Setup password toggles
setupPasswordToggle('login-password', 'login-toggle');
setupPasswordToggle('reg-password', 'reg-toggle');
setupPasswordToggle('reg-confirm-password', 'reg-confirm-toggle');

// Modal functionality
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close');

function showModal() {
    successModal.style.display = 'flex';
}

function hideModal() {
    successModal.style.display = 'none';
}

closeModal.addEventListener('click', hideModal);

window.addEventListener('click', function(event) {
    if (event.target === successModal) {
        hideModal();
    }
});

// Registro con localStorage
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.elements.name.value;
    const last_name = this.elements.last_name.value;
    const email = this.elements.email.value;
    const phone_number = this.elements.phone_number.value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden!");
        return;
    }
    
    // Crear objeto usuario
    const user = {
        name,
        last_name,
        email,
        phone_number,
        password
    };
    
    // Obtener usuarios existentes o inicializar array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    const userExists = users.some(u => u.email === email);
    if (userExists) {
        alert('Este correo ya está registrado!');
        return;
    }
    
    // Agregar nuevo usuario
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Mostrar modal de éxito
    showModal();
    
    // Después de 2 segundos, cerrar modal y cambiar a inicio de sesión
    setTimeout(() => {
        hideModal();
        container.classList.remove('right-panel-active');
        this.reset();
    }, 2000);
});

// Inicio de sesión con localStorage
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.elements.email.value;
    const password = this.elements.password.value;
    const errorMessage = document.getElementById('error-message');
    
    // Obtener usuarios de localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Buscar usuario
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Guardar en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        errorMessage.style.display = 'none';
        
        // Redirigir a base.html después de 1 segundo
        setTimeout(() => {
            window.location.href = 'base.html';
        }, 1000);
        
    } else {
        errorMessage.style.display = 'block';
    }
});