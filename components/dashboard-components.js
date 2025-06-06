// dashboard-components.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('dashboard.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('dashboard-container').innerHTML = html;
            
            // Crear enlace al CSS del dashboard
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../css/dashboard.css';
            document.head.appendChild(link);
            
            // Crear script para el JS del dashboard
            const script = document.createElement('script');
            script.src = '../js/dashboard.js';
            
            // Añadir el script después de que el contenido esté disponible
            setTimeout(() => {
                document.body.appendChild(script);
            }, 100);
        });
});