document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('artworkForm');
    const list = document.getElementById('artworkList');

    // Modal para Instagram
    let igModal = document.getElementById('igModal');
    let igEmbed = document.getElementById('igEmbed');
    let closeModal = document.querySelector('.close-modal');
    if (!igModal) {
        igModal = document.createElement('div');
        igModal.id = 'igModal';
        igModal.className = 'ig-modal';
        igModal.innerHTML = `
            <div class="ig-modal-content">
                <span class="close-modal">&times;</span>
                <div id="igEmbed" class="ig-embed-container"></div>
            </div>
        `;
        document.body.appendChild(igModal);
        igEmbed = document.getElementById('igEmbed');
        closeModal = igModal.querySelector('.close-modal');
    }

    function openInstagramModal(url) {
        igEmbed.innerHTML = '';
        igModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        igEmbed.innerHTML = '<div class="loading-spinner">Cargando publicación...</div>';
        setTimeout(() => {
            igEmbed.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote>`;
            if (window.instgrm) window.instgrm.Embeds.process();
        }, 100);
    }
    closeModal.onclick = function() {
        igModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        igEmbed.innerHTML = '';
    };
    window.addEventListener('click', function(event) {
        if (event.target === igModal) {
            igModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            igEmbed.innerHTML = '';
        }
    });
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && igModal.style.display === 'block') {
            igModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            igEmbed.innerHTML = '';
        }
    });

    // Cargar artworks desde localStorage
    function loadArtworks() {
        list.innerHTML = '';
        const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
        artworks.forEach((art, idx) => {
            const item = document.createElement('div');
            item.className = 'gallery-item-large';
            let imgHtml = `<img class=\"grid-image\" src=\"${art.image}\" alt=\"${art.title}\">`;
            if (art.instagram) {
                imgHtml = `<img class=\"grid-image\" src=\"${art.image}\" alt=\"${art.title}\" style=\"cursor:pointer\" data-instagram=\"${art.instagram}\">`;
            }
            item.innerHTML = `
                ${imgHtml}
                <div class="artwork-info">
                    <h3>${art.title}</h3>
                    <p>${art.desc || ''}</p>
                    <button class="delete-btn" data-idx="${idx}">
                        <svg viewBox="0 0 24 24"><path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6m4-6v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                        Eliminar
                    </button>
                </div>
            `;
            list.appendChild(item);
        });
    }

    // Añadir artwork
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('artworkTitle').value.trim();
        const image = document.getElementById('artworkImage').value.trim();
        const desc = document.getElementById('artworkDesc').value.trim();
        const instagram = document.getElementById('artworkInstagram').value.trim();
        if (!title || !image) return;

        const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
        artworks.push({ title, image, desc, instagram });
        localStorage.setItem('artworks', JSON.stringify(artworks));
        form.reset();
        loadArtworks();
    });

    // Eliminar artwork
    list.addEventListener('click', function (e) {
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const idx = btn.getAttribute('data-idx');
            const artworks = JSON.parse(localStorage.getItem('artworks') || '[]');
            artworks.splice(idx, 1);
            localStorage.setItem('artworks', JSON.stringify(artworks));
            loadArtworks();
        }
        // Click en imagen con Instagram
        if (e.target.classList.contains('grid-image') && e.target.dataset.instagram) {
            openInstagramModal(e.target.dataset.instagram);
        }
    });

    // Click en imagen con Instagram (para imágenes fuera del botón eliminar)
    list.addEventListener('click', function (e) {
        if (e.target.classList.contains('grid-image') && e.target.dataset.instagram) {
            openInstagramModal(e.target.dataset.instagram);
        }
    });

    loadArtworks();
}); 