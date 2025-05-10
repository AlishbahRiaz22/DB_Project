document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const uploadForm = document.getElementById('uploadForm');
    const typeOptions = document.querySelectorAll('.type-option');
    const borrowOptions = document.querySelector('.borrow-options');
    const statusToggle = document.querySelector('.status-toggle');
    const itemCategorySelect = document.getElementById('itemCategory');
    const conditionOptions = document.querySelectorAll('.condition-option');
    const durationOptions = document.querySelectorAll('.duration-option');
    const imageUploadContainer = document.querySelector('.image-upload-container');
    const itemImageInput = document.getElementById('itemImage');
    const imagePreview = document.querySelector('.image-preview');
    const statusToggleInput = document.getElementById('statusToggle');

    // Selected options
    let selectedType = 'borrow';
    let selectedCondition = '';
    let selectedDurations = [];
    let selectedImage = null;    // Fetch categories from database
    fetchCategories();

    // Type selector (Borrowable/Tradeable)
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            typeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to selected option
            this.classList.add('active');            // Update selected type
            selectedType = this.getAttribute('data-type');
            
            // Show/hide appropriate options based on type
            if (selectedType === 'borrow') {
                borrowOptions.classList.add('visible');
                statusToggle.classList.remove('visible');
            } else {
                borrowOptions.classList.remove('visible');
                statusToggle.classList.add('visible');
                
                // Update the status toggle labels based on selection
                document.querySelector('.status-toggle p').textContent = 
                    'Set whether your item is available for trade or has been traded away';
                
                // Ensure the toggle is in the right state (unchecked = available)
                if (statusToggleInput.checked) {
                    statusToggleInput.checked = false;
                }
            }
        });
    });

    // Condition selection
    conditionOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            conditionOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            // Update selected condition
            selectedCondition = this.getAttribute('data-condition');
        });
    });

    // Duration selection for borrowable items
    durationOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Toggle selected class
            this.classList.toggle('selected');
            
            const days = parseInt(this.getAttribute('data-days'));
            
            // Add or remove from selected durations
            if (this.classList.contains('selected')) {
                if (!selectedDurations.includes(days)) {
                    selectedDurations.push(days);
                }
            } else {
                selectedDurations = selectedDurations.filter(d => d !== days);
            }
        });
    });

    // Image upload
    imageUploadContainer.addEventListener('click', function() {
        itemImageInput.click();
    });

    itemImageInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            selectedImage = e.target.files[0];
            
            // Display image preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Item Preview">`;
            };
            reader.readAsDataURL(selectedImage);
        }
    });

    // Handle form submission
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();        // Get form values
        const itemName = document.getElementById('itemName').value;
        const itemCategory = itemCategorySelect.value;
        const description = document.getElementById('description').value;
        // For tradeable items: true means available, false means traded
        // Note: The database schema uses boolean where true = available, false = traded
        const status = selectedType === 'trade' ? !statusToggleInput.checked : true;

        // Validate form
        if (!itemName || !itemCategory || !selectedCondition || !description) {
            alert('Please fill all required fields');
            return;
        }

        if (selectedType === 'borrow' && selectedDurations.length === 0) {
            alert('Please select at least one duration option');
            return;
        }

        if (!selectedImage) {
            alert('Please upload an image of the item');
            return;
        }

        try {            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', itemName);
            formData.append('category', itemCategory);
            formData.append('condition', selectedCondition);
            formData.append('description', description);
            formData.append('type', selectedType);
            formData.append('status', status);
            formData.append('image', selectedImage);
              // Add durations if borrowable
            if (selectedType === 'borrow') {
                formData.append('durations', JSON.stringify(selectedDurations));
            }

            // Call the API to upload the item
            const response = await fetch('http://127.0.0.1:8808/upload', {
                method: 'POST',
                credentials: 'include', // Include cookies for authentication
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert('Item uploaded successfully!');
                // Redirect to browse page or profile
                window.location.href = 'profile.html';
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to upload item'}`);
            }
        } catch (error) {
            console.error('Error uploading item:', error);
            alert('Failed to upload item. Please try again later.');
        }
    });
      // Fetch categories from database
    async function fetchCategories() {
        try {
            const response = await fetch('http://127.0.0.1:8808/browse/categories', {
                method: 'GET',
                credentials: 'include',
            });
            
            if (response.ok) {
                const categories = await response.json();
                // Populate category dropdown
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.category_name;
                    itemCategorySelect.appendChild(option);
                });
            } else {
                console.error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
});
