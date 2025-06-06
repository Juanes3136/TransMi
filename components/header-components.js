document.addEventListener('DOMContentLoaded', () => {
    fetch('views/layouts/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
        });
});