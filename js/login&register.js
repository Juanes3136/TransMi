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

// Form validation
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }
    
    // Simulate successful registration
    alert('Registration successful! You can now sign in.');
    container.classList.remove('right-panel-active');
    this.reset();
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulate login validation
    const email = this.elements.email.value;
    const password = this.elements.password.value;
    const errorMessage = document.getElementById('error-message');
    
    // Simple validation example
    if (email === 'user@example.com' && password === 'password123') {
        errorMessage.style.display = 'none';
        alert('Login successful! Welcome back.');
        this.reset();
    } else {
        errorMessage.style.display = 'block';
    }
});