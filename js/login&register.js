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

// Función para mostrar errores
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.parentElement.classList.add('error');
}

// Función para limpiar errores
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = 'none';
    errorElement.textContent = '';
    errorElement.parentElement.classList.remove('error');
}

// Validación de registro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearError('name-error');
    clearError('last-name-error');
    clearError('email-error');
    clearError('phone-error');
    clearError('password-error');
    clearError('confirm-password-error');
    
    const name = this.elements.name.value.trim();
    const last_name = this.elements.last_name.value.trim();
    const email = this.elements.email.value.trim();
    const phone_number = this.elements.phone_number.value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    let isValid = true;
    
    // Validar nombre
    if (!name) {
        showError('name-error', 'Por favor ingresa tu nombre');
        isValid = false;
    }
    
    // Validar apellido
    if (!last_name) {
        showError('last-name-error', 'Por favor ingresa tu apellido');
        isValid = false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showError('email-error', 'Por favor ingresa tu correo');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        showError('email-error', 'Correo electrónico inválido');
        isValid = false;
    }
    
    // Validar contraseña
    if (!password) {
        showError('password-error', 'Por favor ingresa una contraseña');
        isValid = false;
    } else if (password.length < 6) {
        showError('password-error', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    // Validar confirmación de contraseña
    if (!confirmPassword) {
        showError('confirm-password-error', 'Por favor confirma tu contraseña');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirm-password-error', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // ... resto del código de registro ...
});

// Validación de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearError('login-email-error');
    clearError('login-password-error');
    
    const email = this.elements.email.value.trim();
    const password = this.elements.password.value;
    const errorMessage = document.getElementById('error-message');
    
    // Validar campos
    let isValid = true;
    
    if (!email) {
        showError('login-email-error', 'Por favor ingresa tu correo');
        isValid = false;
    }
    
    if (!password) {
        showError('login-password-error', 'Por favor ingresa tu contraseña');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Obtener usuarios
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Buscar usuario
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError('login-email-error', 'Este correo no está registrado');
        return;
    }
    
    if (user.password !== password) {
        showError('login-password-error', 'Contraseña incorrecta');
        return;
    }
    
    // ... resto del código de login ...
});

// Limpiar errores al escribir
document.querySelectorAll('#registerForm input, #loginForm input').forEach(input => {
    input.addEventListener('input', function() {
        const errorId = this.parentElement.querySelector('.error-message')?.id;
        if (errorId) {
            clearError(errorId);
        }
    });
});