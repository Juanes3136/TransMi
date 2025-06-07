document.addEventListener('DOMContentLoaded', () => {
    fetch('layouts/sidebar.html')
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
                        
                        // Redirigir después de 1 segundo
                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 1000);
                    });
                }
                // Actualizar información del usuario
                updateUserInfo();
            }, 100);
        });
});