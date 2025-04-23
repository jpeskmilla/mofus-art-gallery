// Create a new file: js/gallery.js

document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.gallery-grid');
    
    // Original images from HTML (keep these)
    const originalItems = Array.from(galleryGrid.querySelectorAll('.gallery-item-large'));
    
    // Add stored artworks from localStorage
    loadStoredArtworks();
    
    // Set up modal handlers for all gallery items (including new ones)
    setupModalHandlers();
    
    function loadStoredArtworks() {
        // Get artworks from localStorage
        const artworks = JSON.parse(localStorage.getItem('artworks')) || [];
        
        // Get Instagram mapping
        let instagramMapping = JSON.parse(localStorage.getItem('instagramPosts')) || {};
        
        // Update the global instagramPosts object with our local storage data
        window.instagramPostsExtra = instagramMapping;
        
        // Add each artwork to the gallery
        artworks.forEach(artwork => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item-large';
            
            const img = document.createElement('img');
            img.className = 'grid-image';
            img.src = artwork.imageData; // In a real app, this would be a real URL
            img.alt = artwork.title;
            
            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    function setupModalHandlers() {
        // This function is called after new items are added
        // It sets up click events for all gallery items
        
        const modal = document.getElementById('igModal');
        const embedContainer = document.getElementById('igEmbed');
        const galleryItems = document.querySelectorAll('.gallery-item-large');
        
        // Updates to onClickIgScrip.js functionality
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                
                // Check both original Instagram posts and our added ones
                const postUrl = window.instagramPosts && window.instagramPosts[imgSrc] ? 
                                window.instagramPosts[imgSrc] : 
                                (window.instagramPostsExtra && window.instagramPostsExtra[imgSrc] ? 
                                window.instagramPostsExtra[imgSrc] : null);
                
                if (postUrl) {
                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                    
                    // Show loading indicator
                    embedContainer.innerHTML = '<div class="loading-spinner">Cargando publicación...</div>';
                    
                    // Load Instagram embed
                    setTimeout(() => {
                        // Clear container
                        embedContainer.innerHTML = '';
                        
                        // Create embed
                        const blockquote = document.createElement('blockquote');
                        blockquote.className = 'instagram-media';
                        blockquote.setAttribute('data-instgrm-permalink', postUrl);
                        blockquote.setAttribute('data-instgrm-version', '14');
                        blockquote.style.maxWidth = '658px';
                        blockquote.style.width = '100%';
                        blockquote.style.margin = '0 auto';
                        
                        embedContainer.appendChild(blockquote);
                        
                        // Process embed
                        if (window.instgrm) {
                            window.instgrm.Embeds.process();
                        }
                    }, 100);
                }
            });
        });
    }
});