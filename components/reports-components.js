document.addEventListener('DOMContentLoaded', () => {
    fetch('reports.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('reports-container').innerHTML = html;
        });
});