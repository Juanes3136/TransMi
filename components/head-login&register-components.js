document.addEventListener('DOMContentLoaded', () => {
    fetch('layouts/head-login&register.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('head-container').innerHTML = html;
            
            // Agregar evento al botón de hamburguesa
            document.getElementById('hamburger').addEventListener('click', () => {
                const navButtons = document.querySelector('.nav-buttons');
                navButtons.classList.toggle('active');
            });
        });
});