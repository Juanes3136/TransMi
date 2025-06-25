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

// ... (código existente)

let routesData = []; // Will hold the route data fetched from JSON
let filteredRoutesData = []; // Will hold the currently filtered/searched routes for display

let currentPage = 1;
const routesPerPage = 5;
let editingRouteId = null;

// Function to fetch routes data from the JSON file.
async function fetchRoutesData() {
    try {
        // Path is relative to the HTML file that includes this script.
        const response = await fetch('../data/routes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        routesData = await response.json();
        filteredRoutesData = [...routesData]; // Initialize filtered data with all routes.
        return routesData;
    } catch (error) {
        console.error("Could not fetch routes data:", error);
        // Display an error message to the user in the table.
        const tbody = document.getElementById('routes-table-body');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar las rutas. Por favor, intente más tarde.</td></tr>';
        }
        return []; // Return empty array on error to prevent further issues.
    }
}

// Initialize the Leaflet map.
function initMap() {
    const mapContainer = document.getElementById('route-map');
    if (!mapContainer) {
        console.warn("Map container 'route-map' not found. Skipping map initialization.");
        return;
    }
    const map = L.map(mapContainer).setView([4.7110, -74.0721], 12); // Default view of Bogota.
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Example markers. These could be dynamically generated from route/station data in a future enhancement.
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
function renderRoutesTable(routesToRender, page = 1) {
    const tbody = document.getElementById('routes-table-body');
    if (!tbody) {
        console.error("Element with ID 'routes-table-body' not found.");
        return;
    }
    tbody.innerHTML = '';
    
    if (!routesToRender || routesToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay rutas para mostrar.</td></tr>';
        setupPagination(0); // Ensure pagination is cleared or shows 'no pages'
        return;
    }

    const startIndex = (page - 1) * routesPerPage;
    const paginatedRoutes = routesToRender.slice(startIndex, startIndex + routesPerPage);
    
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
    
    setupPagination(routesToRender.length);
}

// Configurar paginación
function setupPagination(totalRoutes) {
    const pagination = document.getElementById('routes-pagination');
    if (!pagination) {
        console.error("Element with ID 'routes-pagination' not found.");
        return;
    }
    pagination.innerHTML = '';
    
    if (totalRoutes === 0) return; // No pagination if no routes

    const pageCount = Math.ceil(totalRoutes / routesPerPage);
    if (pageCount <= 1) return; // No pagination if only one page
    
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
            renderRoutesTable(filteredRoutesData, currentPage);
        });
    });
    
    const prevPageLink = document.getElementById('prev-page');
    if (prevPageLink) {
        prevPageLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderRoutesTable(filteredRoutesData, currentPage);
            }
        });
    }
    
    const nextPageLink = document.getElementById('next-page');
    if (nextPageLink) {
        nextPageLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < pageCount) {
                currentPage++;
                renderRoutesTable(filteredRoutesData, currentPage);
            }
        });
    }
}

// Formulario para agregar/editar ruta
function setupRouteForm() {
    const form = document.getElementById('route-form');
    const cancelBtn = document.getElementById('cancel-edit');
    
    if (!form) {
        console.warn("Route form 'route-form' not found. Skipping form setup.");
        return;
    }

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
                    ...routesData[routeIndex], // Preserve other properties like ID
                    name,
                    stations: stations.length, // Assuming 'stations' property is a count
                    length,
                    status
                };
            }
            resetForm();
        } else {
            // Agregar nueva ruta
            const newId = routesData.length > 0 ? Math.max(...routesData.map(r => r.id)) + 1 : 1;
            routesData.push({
                id: newId,
                name,
                stations: stations.length, // Assuming 'stations' property is a count
                length,
                status
            });
            form.reset();
        }
        
        // After modification, update filteredRoutesData and re-render
        applyFiltersAndSearch(); // This will re-filter/search and then render
    });
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
}

// Resetear formulario
function resetForm() {
    const form = document.getElementById('route-form');
    if (form) form.reset();

    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.textContent = 'Agregar Nueva Ruta';

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.textContent = 'Guardar Ruta';

    const cancelEditBtn = document.getElementById('cancel-edit');
    if (cancelEditBtn) cancelEditBtn.classList.add('d-none');

    editingRouteId = null;
}

// Cargar datos para edición
function loadRouteForEdit(routeId) {
    const route = routesData.find(r => r.id === routeId);
    if (!route) return;
    
    const routeNameInput = document.getElementById('route-name');
    if (routeNameInput) routeNameInput.value = route.name;

    const routeLengthInput = document.getElementById('route-length');
    if (routeLengthInput) routeLengthInput.value = route.length;

    const routeStatusSelect = document.getElementById('route-status');
    if (routeStatusSelect) routeStatusSelect.value = route.status;

    // Note: Handling selection for 'route-stations' (multiselect) is more complex
    // and depends on how station data is structured and linked to routes.
    // For now, this example assumes 'stations' is a simple count.

    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.textContent = 'Editar Ruta';

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) submitBtn.textContent = 'Actualizar Ruta';

    const cancelEditBtn = document.getElementById('cancel-edit');
    if (cancelEditBtn) cancelEditBtn.classList.remove('d-none');
    
    editingRouteId = routeId;
    // Scroll to form for better UX, if the form is off-screen
    const formElement = document.getElementById('route-form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
}

// Manejar botones de editar/eliminar
function setupTableActions() {
    const tableBody = document.getElementById('routes-table-body');
    if (!tableBody) return;

    tableBody.addEventListener('click', (e) => {
        const editButton = e.target.closest('.edit-btn');
        if (editButton) {
            const routeId = parseInt(editButton.dataset.id);
            loadRouteForEdit(routeId);
        }
        
        const deleteButton = e.target.closest('.delete-btn');
        if (deleteButton) {
            const routeId = parseInt(deleteButton.dataset.id);
            
            if (confirm('¿Está seguro de eliminar esta ruta?')) {
                const routeIndex = routesData.findIndex(r => r.id === routeId);
                if (routeIndex !== -1) {
                    routesData.splice(routeIndex, 1);
                    // After deletion, update filteredRoutesData and re-render
                    applyFiltersAndSearch();
                }
            }
        }
    });
}

// Function to apply both filters and search term
function applyFiltersAndSearch() {
    const statusFilterValue = document.getElementById('status-filter')?.value || 'all';
    const lengthFilterValue = document.getElementById('length-filter')?.value || 'all';
    const searchTerm = document.getElementById('route-search')?.value.toLowerCase() || '';

    let tempFilteredRoutes = [...routesData];

    // Filter by status
    if (statusFilterValue !== 'all') {
        tempFilteredRoutes = tempFilteredRoutes.filter(route => route.status === statusFilterValue);
    }

    // Filter by length
    if (lengthFilterValue !== 'all') {
        if (lengthFilterValue === 'short') {
            tempFilteredRoutes = tempFilteredRoutes.filter(route => route.length < 20);
        } else if (lengthFilterValue === 'medium') {
            tempFilteredRoutes = tempFilteredRoutes.filter(route => route.length >= 20 && route.length <= 30);
        } else if (lengthFilterValue === 'long') {
            tempFilteredRoutes = tempFilteredRoutes.filter(route => route.length > 30);
        }
    }

    // Filter by search term
    if (searchTerm) {
        tempFilteredRoutes = tempFilteredRoutes.filter(route =>
            route.name.toLowerCase().includes(searchTerm)
        );
    }

    filteredRoutesData = tempFilteredRoutes;
    currentPage = 1; // Reset to first page
    renderRoutesTable(filteredRoutesData, currentPage);
    updateStats(); // Update stats based on the new full dataset if necessary, or filtered
}


// Inicializar funcionalidad de búsqueda y filtros
function initSearchAndFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFiltersAndSearch);
    }

    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', applyFiltersAndSearch);
    }

    const routeSearchInput = document.getElementById('route-search');
    if (routeSearchInput) {
        routeSearchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                applyFiltersAndSearch();
            }
        });
    }
}

// Inicializar página de rutas
async function initRoutesPage() {
    // Fetch data first
    await fetchRoutesData();

    // Initialize components that depend on data or DOM elements
    initMap(); // Map can be initialized even if data fetch fails, or show a placeholder
    renderRoutesTable(filteredRoutesData, currentPage); // Initial render with fetched (or empty) data
    setupRouteForm();
    setupTableActions();
    initSearchAndFilters(); // Combines search and filter setup
    updateStats(); // Update stats based on initial data
    
    const newRouteBtn = document.getElementById('new-route-btn');
    if (newRouteBtn) {
        newRouteBtn.addEventListener('click', resetForm);
    }

    const stationSearchInput = document.getElementById('station-search');
    if (stationSearchInput) {
        stationSearchInput.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const options = document.querySelectorAll('#route-stations option');

            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                option.style.display = text.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }
}

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', initRoutesPage);