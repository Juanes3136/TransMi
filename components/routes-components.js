document.addEventListener('DOMContentLoaded', () => {
    fetch('routes.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('routes-container').innerHTML = html;
            
            // Cargar CSS específico
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = '../css/routes.css';
            document.head.appendChild(cssLink);
            
            // Cargar Leaflet CSS
            const leafletCss = document.createElement('link');
            leafletCss.rel = 'stylesheet';
            leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCss);
            
            // Cargar scripts necesarios
            const leafletJs = document.createElement('script');
            leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJs.onload = () => {
                // Cargar JS específico después de Leaflet
                const routesJs = document.createElement('script');
                routesJs.src = '../js/routes.js';
                document.body.appendChild(routesJs);
            };
            document.body.appendChild(leafletJs);
        });
});