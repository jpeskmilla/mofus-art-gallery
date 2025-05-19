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
const images = document.querySelectorAll('.grid-image');

document.addEventListener('DOMContentLoaded', function () {
    const images = document.querySelectorAll('.grid-image');
    const modal = document.getElementById('igModal');
    const igEmbed = document.getElementById('igEmbed');
    const closeModal = document.querySelector('.close-modal');
    let currentIgUrl = null;

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

    function showInstagramEmbed(igUrl) {
        currentIgUrl = igUrl;
        // Limpiar y crear un contenedor para el embed y el botón
        igEmbed.innerHTML = '';
        const embedWrapper = document.createElement('div');
        embedWrapper.style.display = 'flex';
        embedWrapper.style.flexDirection = 'column';
        embedWrapper.style.alignItems = 'center';
        embedWrapper.style.justifyContent = 'center';
        embedWrapper.style.width = '100%';
        // Embed
        const blockquote = document.createElement('blockquote');
        blockquote.className = 'instagram-media';
        blockquote.setAttribute('data-instgrm-permalink', igUrl);
        blockquote.setAttribute('data-instgrm-version', '14');
        blockquote.style.maxWidth = '600px';
        blockquote.style.width = '100%';
        blockquote.style.margin = '0 auto';
        embedWrapper.appendChild(blockquote);
        // Botón bonito debajo del embed
        const btn = document.createElement('a');
        btn.href = igUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'btn-instagram-link';
        btn.innerHTML = 'ㅤ Mostrar en Instagram';
        btn.style.fontFamily = 'Arial, "Font Awesome 5 Brands", "FontAwesome", sans-serif';
        embedWrapper.appendChild(btn);
        igEmbed.appendChild(embedWrapper);
        modal.style.display = 'block';
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }

    images.forEach(img => {
        img.addEventListener('click', function () {
            const igUrl = img.getAttribute('data-instagram');
            if (igUrl) {
                showInstagramEmbed(igUrl);
            }
        });
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        igEmbed.innerHTML = '';
        currentIgUrl = null;
    });

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            igEmbed.innerHTML = '';
            currentIgUrl = null;
        }
    }

    // --- NUEVO: Cargar artworks dinámicos desde localStorage ---
    const dynamicContainer = document.getElementById('dynamicArtworks');
    if (dynamicContainer) {
        const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
        artworks.forEach(art => {
            const item = document.createElement('div');
            item.className = 'gallery-item-large';
            let imgHtml = `<img class=\"grid-image\" src=\"${art.image}\" alt=\"${art.title}\">`;
            if (art.instagram) {
                imgHtml = `<img class=\"grid-image\" src=\"${art.image}\" alt=\"${art.title}\" style=\"cursor:pointer\" data-instagram=\"${art.instagram}\">`;
            }
            item.innerHTML = `
                ${imgHtml}
                <div class=\"artwork-info\">
                    <h3>${art.title}</h3>
                    <p>${art.desc || ''}</p>
                </div>
            `;
            dynamicContainer.appendChild(item);
        });
        // Asignar eventos a las imágenes dinámicas
        dynamicContainer.querySelectorAll('.grid-image').forEach(img => {
            img.addEventListener('click', function () {
                const igUrl = img.getAttribute('data-instagram');
                if (igUrl) {
                    showInstagramEmbed(igUrl);
                }
            });
        });
    }
});