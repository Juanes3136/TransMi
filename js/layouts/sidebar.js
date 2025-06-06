// Toggle sidebar expand/collapse
function toggleSidebar() {
    const wrapper = document.querySelector('.wrapper');
    wrapper.classList.toggle('sidebar-expanded');
    
    // Cambiar ícono
    const icon = document.querySelector('#sidebarToggle i');
    if (wrapper.classList.contains('sidebar-expanded')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
    
    // Guardar estado en localStorage
    localStorage.setItem('sidebarState', wrapper.classList.contains('sidebar-expanded') ? 'expanded' : 'collapsed');
}

// Set Active Link
function setActiveLink(targetId) {
    // Remover clase activa de todos los enlaces
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Añadir clase activa al enlace clickeado
    const activeLink = document.querySelector(`.sidebar-nav .nav-link[data-target="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Mostrar sección seleccionada
function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('d-none');
    });
    
    // Mostrar sección objetivo
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('d-none');
    }
}

// Navegación del sidebar
function setupNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Actualizar enlace activo
            setActiveLink(target);
            
            // Mostrar sección
            showSection(target);
            
            // Actualizar URL
            window.location.hash = target;
        });
    });
}

// Inicializar sidebar
function initSidebar() {
    // Cargar estado del sidebar
    const sidebarState = localStorage.getItem('sidebarState');
    const wrapper = document.querySelector('.wrapper');
    
    if (sidebarState === 'expanded') {
        wrapper.classList.add('sidebar-expanded');
        document.querySelector('#sidebarToggle i').classList.add('fa-times');
        document.querySelector('#sidebarToggle i').classList.remove('fa-bars');
    }
    
    // Configurar botón de toggle
    document.getElementById('sidebarToggle').addEventListener('click', toggleSidebar);
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar sección inicial basada en hash
    const targetFromHash = window.location.hash.substring(1) || 'start';
    setActiveLink(targetFromHash);
    showSection(targetFromHash);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initSidebar);