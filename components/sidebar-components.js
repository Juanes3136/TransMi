document.addEventListener('DOMContentLoaded', () => {
    fetch('views/layouts/sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
            initSidebar();
            
            // Agregar evento después de cargar el sidebar
            setTimeout(() => {
                const logoutBtn = document.getElementById('logoutButton');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        showLoadingOverlay();
                        // Redirect immediately after showing overlay (or any other cleanup).
                        window.location.href = '../index.html';
                    });
                }
                // Actualizar información del usuario.
                updateUserInfo();
            }, 100); // Keep a small delay for sidebar elements to render before attaching event listeners.
        });
});