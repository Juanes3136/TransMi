// dashboard.js - Inicialización de gráficos del dashboard
function initDashboardCharts() {
    // Solo inicializar gráficos si están presentes en el DOM
    if (document.querySelector("#dashboardUsageChart")) {
        // Usage Chart
        var usageOptions = {
            series: [{
                name: "Usuarios",
                data: [1200, 1900, 1500, 1800, 2200, 1800, 2400]
            }],
            chart: {
                height: 300,
                type: 'area',
                toolbar: {
                    show: true
                }
            },
            colors: ['#c41d14'],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy'
                },
            },
        };
        
        var usageChart = new ApexCharts(document.querySelector("#dashboardUsageChart"), usageOptions);
        usageChart.render();
    }
    
    if (document.querySelector("#routeDistribution")) {
        // Route Distribution Chart
        var routeOptions = {
            series: [60, 25, 15],
            chart: {
                height: 300,
                type: 'donut',
            },
            labels: ['Troncal', 'Alimentadora', 'Complementaria'],
            colors: ['#c41d14', '#ffd700', '#17a2b8'],
            legend: {
                position: 'bottom'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };
        
        var routeChart = new ApexCharts(document.querySelector("#routeDistribution"), routeOptions);
        routeChart.render();
    }
}

function initDashboardPagination() {
    // Manejar paginación
    document.querySelectorAll('.dashboard-pagination .page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase activa de todos los elementos
            document.querySelectorAll('.dashboard-pagination .page-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Añadir clase activa al elemento clickeado
            this.parentElement.classList.add('active');
            
            // Aquí iría la lógica para cargar la página correspondiente
            console.log(`Cambiando a página ${this.textContent}`);
        });
    });
}

// Inicializar el dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initDashboardCharts();
    initDashboardPagination();
});

// También inicializar si el script se carga después del DOM
if (document.readyState === 'complete') {
    initDashboardCharts();
    initDashboardPagination();
}