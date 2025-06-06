document.addEventListener('DOMContentLoaded', () => {
    fetch('start.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('start-container').innerHTML = html;
            
            // Crear enlace al CSS de start
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '../css/start.css';
            document.head.appendChild(link);
            
            // Cargar modales
            loadModals();
        });
});

// Función para cargar todos los modales
function loadModals() {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modals-container';
    document.body.appendChild(modalContainer);
    
    const modals = ['recarga', 'beneficiarios', 'bloqueo', 'fidelizacion', 'inscripcion'];
    modals.forEach(modal => {
        fetch(`modals/${modal}-modal.html`)
            .then(response => response.text())
            .then(html => {
                modalContainer.innerHTML += html;
                
                // Inicializar QR solo para el modal de recarga
                if(modal === 'recarga') {
                    setTimeout(initRecargaModal, 100);
                }
            });
    });
}

// Inicializar modal de recarga
function initRecargaModal() {
    // Cambiar entre métodos de pago
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            // Remover clase activa de todos los métodos
            document.querySelectorAll('.payment-method').forEach(m => 
                m.classList.remove('active'));
            // Agregar clase activa al método clickeado
            this.classList.add('active');
            
            // Ocultar todos los formularios
            document.querySelectorAll('.payment-form').forEach(form => {
                form.classList.add('d-none');
            });
            
            // Mostrar formulario correspondiente
            const paymentType = this.getAttribute('data-payment');
            document.getElementById(`${paymentType}Form`).classList.remove('d-none');
            
            // Si es QR, generar código
            if(paymentType === 'qr') {
                generateQRCode();
            }
        });
    });
    
    // Generar QR cuando cambia el monto
    document.getElementById('recargaAmount')?.addEventListener('input', function() {
        if(document.querySelector('.payment-method.active').getAttribute('data-payment') === 'qr') {
            generateQRCode();
        }
    });
    
    // Botón de confirmar recarga
    document.getElementById('confirmRecarga')?.addEventListener('click', function() {
        const amount = document.getElementById('recargaAmount').value;
        if(!amount || amount <= 0) {
            alert('Por favor ingresa un monto válido');
            return;
        }
        
        const paymentType = document.querySelector('.payment-method.active').getAttribute('data-payment');
        let message = '';
        
        switch(paymentType) {
            case 'tarjeta':
                message = `Recarga de $${amount} con tarjeta realizada con éxito`;
                break;
            case 'pse':
                const banco = document.getElementById('bancoSelect').value || 'tu banco';
                message = `Recarga de $${amount} con PSE (${banco}) realizada con éxito`;
                break;
            case 'qr':
                message = `Recarga de $${amount} con QR solicitada. Por favor completa el pago.`;
                break;
        }
        
        alert(message);
        bootstrap.Modal.getInstance(document.getElementById('recargaModal')).hide();
    });
}

// Generar código QR
function generateQRCode() {
    const qrContainer = document.getElementById('qrCodeDisplay');
    const amount = document.getElementById('recargaAmount').value || '0';
    
    // Generar referencia única
    const reference = 'TRM' + Date.now().toString().slice(-6);
    document.getElementById('qrReference').textContent = reference;
    
    // Limpiar contenedor
    qrContainer.innerHTML = '';
    
    // Crear código QR (simulado)
    const qrPlaceholder = document.createElement('div');
    qrPlaceholder.className = 'qr-placeholder';
    qrPlaceholder.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <i class="fas fa-qrcode" style="font-size: 80px; color: #c41d14;"></i>
            <div style="margin-top: 10px; font-weight: bold;">$${amount}</div>
            <div style="font-size: 12px; margin-top: 5px;">${reference}</div>
        </div>
    `;
    qrContainer.appendChild(qrPlaceholder);
}

// Función para manejar los servicios
function openService(service) {
    const modal = new bootstrap.Modal(document.getElementById(`${service}Modal`));
    modal.show();
    
    // Inicialización específica para recarga
    if(service === 'recarga') {
        setTimeout(initRecargaModal, 100);
    }
}

// Función para abrir novedades
function openNews() {
    // Verificamos si el usuario ya completó la información (simulado)
    const usuarioCompleto = false; // Cambiar a true para probar el caso de no novedades
    
    if (!usuarioCompleto) {
        // Mostrar modal de inscripción
        const modal = new bootstrap.Modal(document.getElementById('inscripcionModal'));
        modal.show();
    } else {
        // Mostrar modal de no hay novedades
        alert('No hay novedades en este momento.');
    }
}

// Inicializar modal de inscripción
function initInscripcionModal() {
    // Mostrar/ocultar campos condicionales
    document.getElementById('sisben').addEventListener('change', function() {
        const levelContainer = document.getElementById('sisbenLevelContainer');
        if (this.value === 'si') {
            levelContainer.style.display = 'block';
        } else {
            levelContainer.style.display = 'none';
            document.getElementById('sisbenLevel').value = '';
        }
    });
    
    document.getElementById('estudiante').addEventListener('change', function() {
        const institucionContainer = document.getElementById('institucionContainer');
        const tipoContainer = document.getElementById('tipoInstitucionContainer');
        if (this.value === 'si') {
            institucionContainer.style.display = 'block';
            tipoContainer.style.display = 'block';
        } else {
            institucionContainer.style.display = 'none';
            tipoContainer.style.display = 'none';
            document.getElementById('institucion').value = '';
            document.getElementById('tipoInstitucion').value = '';
        }
    });
}

// Enviar formulario de inscripción
function submitInscripcion() {
    const form = document.getElementById('inscripcionForm');
    if (form.checkValidity()) {
        // Aquí iría la lógica para enviar los datos
        alert('Registro completado con éxito. ¡Bienvenido a TransMi+!');
        
        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById('inscripcionModal')).hide();
        
        // Aquí podríamos actualizar el estado del usuario a "completo"
    } else {
        form.reportValidity();
    }
}