// Create a new file: js/add_artwork.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-artwork-form');
    const imageInput = document.getElementById('artwork-image');
    const imagePreview = document.getElementById('image-preview');
    const messageDiv = document.getElementById('message');
    
    // Set up image preview
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('artwork-title').value;
        const imageFile = imageInput.files[0];
        const instagramLink = document.getElementById('instagram-link').value;
        
        if (!title || !imageFile || !instagramLink) {
            showMessage('Please fill all required fields', 'error');
            return;
        }
        
        // In a real application, here you would upload the image to a server
        // For now, we'll simulate saving it to localStorage
        
        // Generate a unique filename (in real app, server would handle this)
        const filename = 'img/' + Date.now() + '_' + imageFile.name;
        
        // Read file data as DataURL
        const reader = new FileReader();
        reader.onload = function(e) {
            // Save artwork to localStorage
            saveArtwork(title, filename, instagramLink, e.target.result);
            
            // Show success message
            showMessage('Artwork added successfully!', 'success');
            
            // Reset form
            form.reset();
            imagePreview.style.display = 'none';
            
            // Redirect after a delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        };
        reader.readAsDataURL(imageFile);
    });
    
    function saveArtwork(title, filename, instagramLink, imageData) {
        // Get existing artworks or initialize empty array
        let artworks = JSON.parse(localStorage.getItem('artworks')) || [];
        
        // Add new artwork
        artworks.push({
            id: Date.now(), // Simple unique ID
            title: title,
            filename: filename, 
            instagramLink: instagramLink,
            imageData: imageData // In a real app, you wouldn't store images in localStorage
        });
        
        // Save back to localStorage
        localStorage.setItem('artworks', JSON.stringify(artworks));
        
        // Update Instagram posts mapping
        let instagramPosts = JSON.parse(localStorage.getItem('instagramPosts')) || {};
        instagramPosts[filename] = instagramLink;
        localStorage.setItem('instagramPosts', JSON.stringify(instagramPosts));
    }
    
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
});