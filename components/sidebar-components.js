document.addEventListener('DOMContentLoaded', () => {
    fetch('layouts/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initSidebar();
        });
});