document.addEventListener('DOMContentLoaded', () => {
    fetch('views/layouts/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
        });
});