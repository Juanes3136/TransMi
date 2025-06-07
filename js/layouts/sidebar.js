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

document.addEventListener('DOMContentLoaded', () => {
    // Obtener botón de salir
    const logoutBtn = document.getElementById('logout-btn');
    
    // Manejar clic en botón de salir
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Eliminar sesión actual
            sessionStorage.removeItem('currentUser');
            
            // Redirigir a index.html
            window.location.href = 'index.html';
        });
    }
    
    // Actualizar información de perfil con datos reales
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const profileName = document.querySelector('.profile-name');
        const profileImg = document.querySelector('.profile-img');
        
        if (profileName) {
            profileName.textContent = currentUser.name + ' ' + currentUser.last_name;
        }
        
        if (profileImg) {
            // Generar avatar dinámico con las iniciales
            const initials = currentUser.name.charAt(0) + currentUser.last_name.charAt(0);
            profileImg.src = `https://ui-avatars.com/api/?name=${initials}&background=8f141b&color=fff`;
        }
    }
});

// Manejo del botón de salir
document.getElementById('logoutButton').addEventListener('click', function(e) {
    e.preventDefault();
    showLoadingOverlay();
    
    // Simular proceso de logout
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
});

// Funciones para mostrar/ocultar overlay
function showLoadingOverlay() {
    document.getElementById('loadingOverlay').classList.remove('d-none');
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').classList.add('d-none');
}

function updateUserInfo() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser) {
        // Actualizar sidebar
        const profileName = document.getElementById('profile-name');
        const profileImg = document.getElementById('profile-img');
        
        if (profileName) {
            profileName.textContent = `${currentUser.name} ${currentUser.last_name}`;
        }
        
        if (profileImg) {
            const initials = currentUser.name.charAt(0) + currentUser.last_name.charAt(0);
            profileImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=8f141b&color=fff`;
        }
        
        // Actualizar vista start
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = `${currentUser.name} ${currentUser.last_name}`;
        }
    }
}

// Llamar a la función cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', updateUserInfo);