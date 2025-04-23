// Configuración de enlaces a posts de Instagram (ID del post para cada imagen)
const instagramPosts = {
    'img/1.jpg': 'https://www.instagram.com/p/DGlOxb-Rx3h/?img_index=1',
    'img/2.jpg': 'https://www.instagram.com/p/DEveGGlxKSq/?img_index=1',
    'img/3.jpg': 'https://www.instagram.com/p/DHw9Hb9pcL8/?img_index=1',
    'img/4.jpg': 'https://www.instagram.com/p/DDL0Cd9RyDo/?img_index=1'
    // Añade más enlaces según necesites
};

// Elementos del DOM
const modal = document.getElementById('igModal');
const embedContainer = document.getElementById('igEmbed');
const closeButton = document.querySelector('.close-modal');
const galleryItems = document.querySelectorAll('.container .gallery-item-large');

// Función para cargar el embed de Instagram
function loadInstagramEmbed(postUrl) {
    // Limpiamos el contenedor
    embedContainer.innerHTML = '';
    
    // Creamos el blockquote para el embed
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', postUrl);
    blockquote.setAttribute('data-instgrm-version', '14');
    
    // Configurar tamaño máximo (opcional)
    blockquote.style.maxWidth = '658px'; // Instagram recomienda este tamaño máximo
    blockquote.style.width = '100%';
    blockquote.style.margin = '0 auto';
    
    // Añadimos el blockquote al contenedor
    embedContainer.appendChild(blockquote);
    
    // Procesamos el embed mediante la API de Instagram
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    }
}

// Función para mostrar un indicador de carga
function showLoadingIndicator() {
    embedContainer.innerHTML = '<div class="loading-spinner">Cargando publicación...</div>';
}

// Abrir modal al hacer clic en una imagen
galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').getAttribute('src');
        const postUrl = instagramPosts[imgSrc];
        
        if (postUrl) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evita scroll en la página
            
            // Mostrar indicador de carga
            showLoadingIndicator();
            
            // Cargar el embed con un pequeño retraso para mostrar el indicador
            setTimeout(() => {
                loadInstagramEmbed(postUrl);
            }, 100);
        }
    });
});

// Cerrar el modal
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll
});

// Cerrar el modal haciendo clic fuera del contenido
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Cerrar el modal con la tecla ESC
window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Añadir estilo para el indicador de carga
const style = document.createElement('style');
style.textContent = `
.loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: #ff8c9e;
    font-size: 18px;
    text-align: center;
}
`;
document.head.appendChild(style);