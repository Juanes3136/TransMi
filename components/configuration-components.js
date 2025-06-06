document.addEventListener('DOMContentLoaded', () => {
    fetch('configuration.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('configuration-container').innerHTML = html;
        });
});