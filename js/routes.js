// ... (código existente)

// Función para actualizar estadísticas
function updateStats() {
    document.getElementById('total-routes').textContent = routesData.length;
    
    const activeRoutes = routesData.filter(r => r.status === 'active').length;
    document.getElementById('active-routes').textContent = activeRoutes;
    
    const totalLength = routesData.reduce((sum, route) => sum + route.length, 0);
    const avgLength = totalLength / routesData.length;
    document.getElementById('avg-length').textContent = `${avgLength.toFixed(1)} km`;
    
    const totalStations = routesData.reduce((sum, route) => sum + route.stations, 0);
    document.getElementById('total-stations').textContent = totalStations;
}

// Función para aplicar filtros
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    const lengthFilter = document.getElementById('length-filter').value;
    
    let filteredRoutes = [...routesData];
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
        filteredRoutes = filteredRoutes.filter(route => route.status === statusFilter);
    }
    
    // Filtrar por longitud
    if (lengthFilter !== 'all') {
        if (lengthFilter === 'short') {
            filteredRoutes = filteredRoutes.filter(route => route.length < 20);
        } else if (lengthFilter === 'medium') {
            filteredRoutes = filteredRoutes.filter(route => route.length >= 20 && route.length <= 30);
        } else if (lengthFilter === 'long') {
            filteredRoutes = filteredRoutes.filter(route => route.length > 30);
        }
    }
    
    currentPage = 1;
    renderRoutesTable(filteredRoutes);
}

// Inicializar página de rutas
function initRoutesPage() {
    // Inicializar componentes
    initMap();
    renderRoutesTable(routesData);
    setupRouteForm();
    setupTableActions();
    initSearch();
    updateStats();
    
    // Botón de nueva ruta
    document.getElementById('new-route-btn').addEventListener('click', resetForm);
    
    // Filtros
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    
    // Búsqueda de estaciones
    document.getElementById('station-search').addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase();
        const options = document.querySelectorAll('#route-stations option');
        
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
}

// ... (resto del código existente)

// Datos de ejemplo para rutas
const routesData = [
    { id: 1, name: "Calle 26", stations: 18, length: 24.5, status: "active" },
    { id: 2, name: "Autonorte", stations: 22, length: 32.1, status: "active" },
    { id: 3, name: "Caracas", stations: 25, length: 29.8, status: "maintenance" },
    { id: 4, name: "Suba", stations: 16, length: 18.7, status: "active" },
    { id: 5, name: "NQS", stations: 20, length: 26.3, status: "active" },
];

let currentPage = 1;
const routesPerPage = 5;
let editingRouteId = null;

// Inicializar el mapa
function initMap() {
    const map = L.map('route-map').setView([4.7110, -74.0721], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Marcadores de ejemplo
    const markers = [
        { lat: 4.7110, lng: -74.0721, title: "Estación Principal" },
        { lat: 4.6980, lng: -74.0831, title: "Estación Centro" },
        { lat: 4.7250, lng: -74.0631, title: "Estación Norte" }
    ];
    
    markers.forEach(marker => {
        L.marker([marker.lat, marker.lng])
            .addTo(map)
            .bindPopup(marker.title);
    });
}

// Renderizar tabla de rutas
function renderRoutesTable(routes, page = 1) {
    const tbody = document.getElementById('routes-table-body');
    tbody.innerHTML = '';
    
    const startIndex = (page - 1) * routesPerPage;
    const paginatedRoutes = routes.slice(startIndex, startIndex + routesPerPage);
    
    paginatedRoutes.forEach(route => {
        const statusClass = route.status === 'active' ? 'bg-success' : 
                            route.status === 'maintenance' ? 'bg-warning' : 'bg-secondary';
        const statusText = route.status === 'active' ? 'Activa' : 
                           route.status === 'maintenance' ? 'En mantenimiento' : 'Desactivada';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${route.name}</td>
            <td>${route.stations}</td>
            <td>${route.length} km</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${route.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${route.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Configurar paginación
    setupPagination(routes.length);
}

// Configurar paginación
function setupPagination(totalRoutes) {
    const pagination = document.getElementById('routes-pagination');
    pagination.innerHTML = '';
    
    const pageCount = Math.ceil(totalRoutes / routesPerPage);
    
    // Botón Anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `
        <a class="page-link" href="#" tabindex="-1" id="prev-page">Anterior</a>
    `;
    pagination.appendChild(prevLi);
    
    // Páginas
    for (let i = 1; i <= pageCount; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link page-number" href="#" data-page="${i}">${i}</a>`;
        pagination.appendChild(pageLi);
    }
    
    // Botón Siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === pageCount ? 'disabled' : ''}`;
    nextLi.innerHTML = `
        <a class="page-link" href="#" id="next-page">Siguiente</a>
    `;
    pagination.appendChild(nextLi);
    
    // Event listeners para paginación
    document.querySelectorAll('.page-number').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = parseInt(e.target.dataset.page);
            renderRoutesTable(routesData);
        });
    });
    
    document.getElementById('prev-page').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderRoutesTable(routesData);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < pageCount) {
            currentPage++;
            renderRoutesTable(routesData);
        }
    });
}

// Formulario para agregar/editar ruta
function setupRouteForm() {
    const form = document.getElementById('route-form');
    const cancelBtn = document.getElementById('cancel-edit');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('route-name').value;
        const length = parseFloat(document.getElementById('route-length').value);
        const status = document.getElementById('route-status').value;
        const stationSelect = document.getElementById('route-stations');
        const stations = Array.from(stationSelect.selectedOptions).map(option => option.value);
        
        if (editingRouteId) {
            // Editar ruta existente
            const routeIndex = routesData.findIndex(r => r.id === editingRouteId);
            if (routeIndex !== -1) {
                routesData[routeIndex] = {
                    ...routesData[routeIndex],
                    name,
                    stations: stations.length,
                    length,
                    status
                };
            }
            resetForm();
        } else {
            // Agregar nueva ruta
            const newId = Math.max(...routesData.map(r => r.id), 0) + 1;
            routesData.push({
                id: newId,
                name,
                stations: stations.length,
                length,
                status
            });
            form.reset();
        }
        
        renderRoutesTable(routesData);
    });
    
    cancelBtn.addEventListener('click', resetForm);
}

// Resetear formulario
function resetForm() {
    document.getElementById('route-form').reset();
    document.getElementById('form-title').textContent = 'Agregar Nueva Ruta';
    document.getElementById('submit-btn').textContent = 'Guardar Ruta';
    document.getElementById('cancel-edit').classList.add('d-none');
    editingRouteId = null;
}

// Cargar datos para edición
function loadRouteForEdit(routeId) {
    const route = routesData.find(r => r.id === routeId);
    if (!route) return;
    
    document.getElementById('route-name').value = route.name;
    document.getElementById('route-length').value = route.length;
    document.getElementById('route-status').value = route.status;
    
    document.getElementById('form-title').textContent = 'Editar Ruta';
    document.getElementById('submit-btn').textContent = 'Actualizar Ruta';
    document.getElementById('cancel-edit').classList.remove('d-none');
    editingRouteId = routeId;
}

// Manejar botones de editar/eliminar
function setupTableActions() {
    document.getElementById('routes-table-body').addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const btn = e.target.closest('.edit-btn');
            const routeId = parseInt(btn.dataset.id);
            loadRouteForEdit(routeId);
        }
        
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const routeId = parseInt(btn.dataset.id);
            
            if (confirm('¿Está seguro de eliminar esta ruta?')) {
                const routeIndex = routesData.findIndex(r => r.id === routeId);
                if (routeIndex !== -1) {
                    routesData.splice(routeIndex, 1);
                    renderRoutesTable(routesData);
                }
            }
        }
    });
}

// Inicializar funcionalidad de búsqueda
function initSearch() {
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('route-search').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Realizar búsqueda
function performSearch() {
    const searchTerm = document.getElementById('route-search').value.toLowerCase();
    const filteredRoutes = routesData.filter(route => 
        route.name.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderRoutesTable(filteredRoutes);
}

// Inicializar página de rutas
function initRoutesPage() {
    // Inicializar componentes
    initMap();
    renderRoutesTable(routesData);
    setupRouteForm();
    setupTableActions();
    initSearch();
    
    // Botón de nueva ruta
    document.getElementById('new-route-btn').addEventListener('click', resetForm);
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', initRoutesPage);