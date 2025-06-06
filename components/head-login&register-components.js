document.addEventListener('DOMContentLoaded', () => {
    fetch('layouts/head-login&register.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('head-container').innerHTML = html;
        });
});