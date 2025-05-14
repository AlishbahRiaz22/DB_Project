function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
}

async function fetchCategories() {
    try {
        const response = await fetch('http://127.0.1:8808/browse/categories', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const categories = await response.json();
        const categorySelect = document.getElementById('itemCategory');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.category_name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        showToast('Failed to load categories', 'error');
    }
}

function handleImageUpload() {
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.querySelector('.image-preview');
    const file = imageInput.files[0];
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image file (JPEG, PNG, etc.)', 'error');
            imageInput.value = '';
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should not exceed 5MB');
            imageInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

async function checkLoginStatus() {
    const response = await fetch('http://127.0.0.1:8808/login', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.status === 200) {
            // If the user is logged in, we update the buttons
            const signupBtn = document.querySelector('.signup-btn');
            const loginBtn = document.querySelector('.login-btn');
            
            // Add animation class to both buttons
            loginBtn.classList.add('button-transition');
            signupBtn.classList.add('button-transition');
            
            // First step: fade out both buttons
            loginBtn.style.opacity = '0';
            loginBtn.style.transform = 'scale(0.8) rotate(20deg)';
            
            signupBtn.style.opacity = '0';
            signupBtn.style.transform = 'scale(0.8) rotate(-20deg)';
            
            // After fade out completes, change button appearance
            setTimeout(() => {
                // Update login button appearance
                loginBtn.textContent = "";
                loginBtn.style.backgroundImage = "url('./resources/images/user.png')";
                loginBtn.style.backgroundSize = "cover";
                loginBtn.style.width = "40px";
                loginBtn.style.height = "40px";
                loginBtn.style.borderRadius = "50%";
                loginBtn.style.border = "none";
                loginBtn.style.cursor = "pointer";
                loginBtn.style.marginRight = "10px";
                loginBtn.style.padding = "0px";
                loginBtn.style.backgroundColor = "transparent";
                loginBtn.href = "#";
                
                // Update signup button to logout button

                signupBtn.textContent = "Logout";
                signupBtn.style.borderRadius = "15px";
                signupBtn.style.cursor = "pointer";
                signupBtn.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                signupBtn.style.transition = "all 0.2s ease";
                
                // Second step: fade in with transform for both buttons
                setTimeout(() => {
                    loginBtn.style.opacity = '1';
                    loginBtn.style.transform = 'scale(1) rotate(0deg)';
                    
                    signupBtn.style.opacity = '1';
                    signupBtn.style.transform = 'scale(1) rotate(0deg)';
                }, 50);
                
                // Add click event listeners
                loginBtn.addEventListener('click', function() {
                    window.location.href = "profile.html";
                });
                
                signupBtn.addEventListener('click', async function() {
                    // Handle logout
                    try {
                        const response = await fetch('http://127.0.0.1:8808/logout', {
                            method: 'POST',
                            credentials: 'include'
                        });
                        
                        if (response.status === 200) {
                            // Show success message
                            const toast = document.createElement('div');
                            toast.className = 'toast success';
                            toast.textContent = 'Logged out successfully!';
                            document.body.appendChild(toast);
                            
                            // Fade in toast
                            setTimeout(() => toast.classList.add('show'), 10);
                            
                            // Fade out toast after 2 seconds
                            setTimeout(() => {
                                toast.classList.remove('show');
                                setTimeout(() => toast.remove(), 300);
                            }, 2000);
                            
                            // Redirect to home page after a short delay
                            setTimeout(() => {
                                window.location.href = "index.html";
                            }, 1000);
                        }
                    } catch (error) {
                        console.error('Logout error:', error);
                    }
                });
            }, 300);
        }
    })
} 

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus(); // Check login status on page load
    // Initialize the form and fetch categories on page load
    fetchCategories();

    const uploadForm = document.getElementById('uploadForm');
    const typeOptions = document.querySelectorAll('.type-option');
    const borrowOptions = document.querySelector('.borrow-options');
    const statusToggle = document.querySelector('.status-toggle');
    const statusSlider = document.getElementById('statusToggle');
    const imageInput = document.getElementById('itemImage');
    const imagePreview = document.querySelector('.image-preview');
            
    // Type selector handling
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            typeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            if (option.dataset.type === 'borrow') {
                borrowOptions.classList.add('visible');
                statusToggle.classList.remove('visible');
                hiddenDiv.style.display = 'none'
            } else {
                borrowOptions.classList.remove('visible');
                statusToggle.classList.add('visible');
            }
        });
    });

    console.log(imageInput);

    // Image upload handling
    imageInput.addEventListener('change', handleImageUpload);
    const dropZone = document.querySelector('.image-upload-container');
    
    // Make the dropzone clickable
    dropZone.addEventListener('click', () => {
        imageInput.click();
    });
                
    // Drag and drop functionality
    dropZone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            // Check if file is an image
            if (file.type.startsWith('image/')) {
                imageInput.files = e.dataTransfer.files;
                handleImageUpload();
            } else {
                showToast('Please upload an image file (JPEG, PNG, etc.)', 'error');
            }
        }
    });

    // Add this code near your other event listeners
    const conditionOptions = document.querySelectorAll('.condition-option');
    conditionOptions.forEach(option => {
        option.addEventListener('click', () => {
            conditionOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    const durationOptions = document.querySelectorAll('.duration-option');
    durationOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            // Duration options handling - improved version
            // Prevent any default behavior or event bubbling
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the selected class
            option.classList.toggle('selected');
            
            // Add visual feedback
            if (option.classList.contains('selected')) {
                option.style.backgroundColor = 'rgba(215, 139, 48, 0.2)';
                option.style.borderColor = 'var(--apricot)';
            } else {
                option.style.backgroundColor = '';
                option.style.borderColor = '';
            }
        
            // Update a counter to show how many are selected
            const selectedCount = document.querySelectorAll('.duration-option.selected').length;
            const durationHeading = document.querySelector('.borrow-options h3') || 
                                   document.querySelector('.form-group-title');
            
            if (durationHeading) {
                durationHeading.textContent = `Borrow Duration (${selectedCount} selected)`;
            }
        });
    });

    // Set the first condition as default selected
    document.querySelector('.condition-option').classList.add('active');


    // Form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const itemType = document.querySelector('.type-option.active').dataset.type;

        const formData = new FormData();
        formData.append('name', document.getElementById('itemName').value);
        formData.append('description', document.getElementById('description').value);

        if (imageInput.files[0]) {
            formData.append('image', imageInput.files[0]);
        }

        formData.append('type', itemType);
        formData.append('category', document.querySelector('#itemCategory').value);

        if (itemType === 'borrow') {
            const selectedDurations = Array.from(document.querySelectorAll('.duration-option.selected'))
                .map(option => option.dataset.days);
            if (selectedDurations.length === 0) {
                showToast('Please select at least one borrow duration', 'error');
                return;
            }
            formData.append('durations', JSON.stringify(selectedDurations));
        } else {
            // For tradable items, include the status
            formData.append('status', statusSlider.checked ? 'traded' : 'available');
        }

        // Add this inside your form submission handler, before the fetch call
        if (!document.querySelector('.condition-option.active')) {
            showToast('Please select an item condition', 'error');
            return;
        }

        formData.append('condition', document.querySelector('.condition-option.active').dataset.condition);

                // console.log('Form data:', formData.get('name'), formData.get('description'), formData.get('image'), formData.get('type'), formData.get('category'), formData.get('durations'), formData.get('status'), formData.get('condition'));

        try {
            const response = await fetch('http://127.0.0.1:8808/upload/', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Item uploaded successfully!', 'success'); // Show success message
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to index.html after 2 seconds
                }, 1000);
            } else {
                throw new Error(result.error || 'Failed to upload item');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast(error.message, 'error'); // Show error message if upload fails
        }
    });
});