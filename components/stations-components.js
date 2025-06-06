document.addEventListener('DOMContentLoaded', () => {
    fetch('stations.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('stations-container').innerHTML = html;
        });
});