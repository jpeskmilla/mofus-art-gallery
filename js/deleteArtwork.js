// Create a new file: js/delete_artwork.js

document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.querySelector('.artwork-selection');
    const deleteButton = document.getElementById('delete-selected');
    const messageDiv = document.getElementById('message');
    
    // Load artworks from localStorage
    loadArtworks();
    
    // Handle delete button click
    deleteButton.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('input[name="artwork"]:checked');
        
        if (selectedCheckboxes.length === 0) {
            showMessage('Please select at least one artwork to delete', 'error');
            return;
        }
        
        // Confirm deletion
        if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} artwork(s)?`)) {
            const artworkIds = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.value));
            deleteArtworks(artworkIds);
            
            // Reload the gallery
            loadArtworks();
            
            // Show success message
            showMessage(`${selectedCheckboxes.length} artwork(s) deleted successfully!`, 'success');
        }
    });
    
    function loadArtworks() {
        // Clear the gallery
        galleryGrid.innerHTML = '';
        
        // Get artworks from localStorage
        const artworks = JSON.parse(localStorage.getItem('artworks')) || [];
        
        if (artworks.length === 0) {
            galleryGrid.innerHTML = '<p>No artworks available to delete.</p>';
            return;
        }
        
        // Add each artwork to the gallery
        artworks.forEach(artwork => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item-delete';
            
            galleryItem.innerHTML = `
                <img src="${artwork.imageData}" alt="${artwork.title}">
                <div class="checkbox-container">
                    <input type="checkbox" id="artwork-${artwork.id}" name="artwork" value="${artwork.id}">
                    <label for="artwork-${artwork.id}">${artwork.title}</label>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
    }
    
    function deleteArtworks(ids) {
        // Get existing artworks
        let artworks = JSON.parse(localStorage.getItem('artworks')) || [];
        let instagramPosts = JSON.parse(localStorage.getItem('instagramPosts')) || {};
        
        // Find artworks to delete
        const artworksToDelete = artworks.filter(artwork => ids.includes(artwork.id));
        
        // Remove deleted artwork filenames from Instagram posts
        artworksToDelete.forEach(artwork => {
            delete instagramPosts[artwork.filename];
        });
        
        // Filter out deleted artworks
        artworks = artworks.filter(artwork => !ids.includes(artwork.id));
        
        // Save back to localStorage
        localStorage.setItem('artworks', JSON.stringify(artworks));
        localStorage.setItem('instagramPosts', JSON.stringify(instagramPosts));
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
});