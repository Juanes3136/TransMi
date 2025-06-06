document.addEventListener('DOMContentLoaded', () => {
    fetch('users.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('users-container').innerHTML = html;
        });
});