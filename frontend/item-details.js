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
                loginBtn.style.marginLeft = "32px";
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

async function fetchBorrowDuration (itemId) {
    try {
        const duration = await fetch('http://127.0.0.1:8808/borrow/duration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                item_id: itemId
            })
        });
        const durationData = await duration.json();
        const borrowPeriod = document.getElementById('borrow-duration');

         // Check if durations exist in the data
    if (durationData && durationData.length > 0) {
        // Add each duration as an option
        durationData.forEach(duration => {
            const option = document.createElement('option');
            option.value = duration.duration_days;
            option.textContent = `${duration.duration_days} days`;
            borrowPeriod.appendChild(option);
        });
    } else {
        showToast('No borrow durations available', 'error');
    }
    } catch (error) {
        console.error('Error fetching borrow duration:', error);
        showToast('Error fetching borrow duration', 'error');
        return null;
    }
}

// ==================== Modal Management Functions ====================

/**
 * Sets up the modal functionality for trade and borrow actions
 */
function setupModals() {
    // Get DOM elements
    const tradeBtn = document.querySelector('.trade-btn');
    const borrowBtn = document.querySelector('.borrow-btn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const cancelTradeBtn = document.getElementById('cancelTrade');
    const cancelBorrowBtn = document.getElementById('cancelBorrow');
    
    // Add click event listeners to open modals
    if (tradeBtn) tradeBtn.addEventListener('click', openTradeModal);
    if (borrowBtn) borrowBtn.addEventListener('click', openBorrowModal);
    
    // Add event listeners to close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });
    
    if (cancelTradeBtn) cancelTradeBtn.addEventListener('click', closeAllModals);
    if (cancelBorrowBtn) cancelBorrowBtn.addEventListener('click', closeAllModals);
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const tradeModal = document.getElementById('tradeModal');
        const borrowModal = document.getElementById('borrowModal');
        
        if (e.target === tradeModal || e.target === borrowModal) {
            closeAllModals();
        }
    });
    
    // Set up form submissions
    const tradeForm = document.getElementById('tradeForm');
    const borrowForm = document.getElementById('borrowForm');
    
    if (tradeForm) tradeForm.addEventListener('submit', handleTradeSubmit);
    if (borrowForm) borrowForm.addEventListener('submit', handleBorrowSubmit);
    
    // Setup trade item selection preview
    const tradeItemSelect = document.getElementById('trade-item-select');
    if (tradeItemSelect) {
        tradeItemSelect.addEventListener('change', function() {
            showSelectedItemPreview(this);
        });
    }
}

/**
 * Opens the trade modal and populates item information
 */
async function openTradeModal() {
    // Check login status
    if (!isUserLoggedIn()) {
        showLoginRequired('propose a trade');
        return;
    }
    
    const tradeModal = document.getElementById('tradeModal');
    
    // Get current item details from the URL and page
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('item_id');
    
    // Verify this is a tradable item
    if (!itemId || !itemId.includes('t')) {
        showToast('This item is not available for trade', 'error');
        return;
    }
    
    // Get current item details from the page
    const itemName = document.querySelector('.gradient-text').textContent;
    const itemOwner = document.querySelector('.owner-details h4').textContent;
    const itemImgStyle = document.querySelector('.item-main-img').style.backgroundImage;
    
    // Populate the trade modal with item details
    document.getElementById('trade-receive-name').textContent = itemName;
    document.getElementById('trade-receive-owner').textContent = `Owner: ${itemOwner}`;
    document.getElementById('trade-receive-img').style.backgroundImage = itemImgStyle;
    
    // Fetch user's tradable items and populate the dropdown
    await fetchUserTradableItems();
    
    // Show the modal
    tradeModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Opens the borrow modal and populates item information
 */
function openBorrowModal() {
    // Check login status
    if (!isUserLoggedIn()) {
        showLoginRequired('request to borrow an item');
        return;
    }
    
    const borrowModal = document.getElementById('borrowModal');
    
    // Get current item details from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('item_id');
    
    // Verify this is a borrowable item
    if (!itemId || !itemId.includes('b')) {
        showToast('This item is not available for borrowing', 'error');
        return;
    }
    
    // Get current item details from the page
    const itemName = document.querySelector('.gradient-text').textContent;
    const itemOwner = document.querySelector('.owner-details h4').textContent;
    const itemImgStyle = document.querySelector('.item-main-img').style.backgroundImage;
    
    // Populate the borrow modal
    document.getElementById('borrow-item-name').textContent = itemName;
    document.getElementById('borrow-item-owner').textContent = `Owner: ${itemOwner}`;
    document.getElementById('borrow-item-img').style.backgroundImage = itemImgStyle;

    fetchBorrowDuration(itemId.replace('b', "")); // Fetch borrow durations and populate the dropdown  
    
    // Show the modal
    borrowModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Closes all modals and resets their forms
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    
    // Reset all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    // Clear any previews
    const previewContainer = document.getElementById('selected-trade-item-preview');
    if (previewContainer) previewContainer.innerHTML = '';
}

// ==================== Trade Functions ====================

/**
 * Fetches the user's items available for trade
 */
async function fetchUserTradableItems() {
    try {
        const tradeItemSelect = document.getElementById('trade-item-select');
        
        // Clear previous options
        tradeItemSelect.innerHTML = '<option value="" disabled selected>Choose your item</option>';
        
        const response = await fetch('http://127.0.0.1:8808/trade/userItems/', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            // Add items to dropdown
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.item_id;
                option.textContent = item.item_name;
                option.dataset.category = item.category_name || 'General';
                option.dataset.image = item.image_url || './resources/images/placeholder.jpg';
                tradeItemSelect.appendChild(option);
            });
            return true;
        } else {
            // No items available for trade
            const option = document.createElement('option');
            option.value = "";
            option.disabled = true;
            option.selected = true;
            option.textContent = "You don't have any items available for trade";
            tradeItemSelect.appendChild(option);
            
            // Show add item link
            const previewContainer = document.getElementById('selected-trade-item-preview');
            previewContainer.innerHTML = `
                <div class="no-items-message">
                    <p>You need to add tradable items to your profile first.</p>
                    <a href="add-item.html" class="action-btn trade-btn" style="margin-top: 10px; display: inline-block;">
                        <i class="fas fa-plus"></i> Add New Item
                    </a>
                </div>
            `;
            return false;
        }
    } catch (error) {
        console.error('Error fetching tradable items:', error);
        showToast('Error loading your items', 'error');
        return false;
    }
}

/**
 * Shows a preview of the selected trade item
 */
function showSelectedItemPreview(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const previewContainer = document.getElementById('selected-trade-item-preview');
    
    if (selectedOption && selectedOption.value) {
        const itemName = selectedOption.textContent;
        const itemCategory = selectedOption.dataset.category || 'General';
        const itemImage = selectedOption.dataset.image || './resources/images/placeholder.jpg';
        
        previewContainer.innerHTML = `
            <div class="item-preview">
                <div class="preview-img" style="background-image: url('${itemImage}');"></div>
                <div class="preview-details">
                    <h3>${itemName}</h3>
                    <p>Category: ${itemCategory}</p>
                </div>
            </div>
        `;
    } else {
        previewContainer.innerHTML = '';
    }
}

/**
 * Handles the trade form submission
 */
async function handleTradeSubmit(e) {
    e.preventDefault();
    
    const tradeItemSelect = document.getElementById('trade-item-select');
    const tradeMessage = document.getElementById('trade-message');
    
    if (!tradeItemSelect.value) {
        showToast('Please select an item to offer', 'error');
        return;
    }
    
    if (!tradeMessage.value.trim()) {
        showToast('Please enter a message for the owner', 'error');
        tradeMessage.focus();
        return;
    }
    
    // Get item IDs
    const urlParams = new URLSearchParams(window.location.search);
    const desiredItemId = urlParams.get('item_id').replace('t', ''); // Remove 't' suffix
    const offeredItemId = tradeItemSelect.value;
    const ownerId = document.querySelector('.owner-details p').textContent;
    
    // Show loading on button
    const submitBtn = document.querySelector('#tradeForm .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    
    try {
        const response = await fetch('http://127.0.0.1:8808/trade/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                desired_item_id: desiredItemId,
                offered_item_id: offeredItemId,
                reason: tradeMessage.value,
                owner_id: ownerId
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            closeAllModals();
            showToast('Trade offer sent successfully!', 'success');
            
            // Redirect to outgoing requests after a delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to send trade request');
        }
    } catch (error) {
        console.error('Error sending trade request:', error);
        showToast(error.message || 'Failed to send trade request', 'error');
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ==================== Borrow Functions ====================

/**
 * Handles the borrow form submission
 */
async function handleBorrowSubmit(e) {
    e.preventDefault();
    
    const borrowDuration = document.getElementById('borrow-duration');
    const borrowPurpose = document.getElementById('borrow-purpose');
    
    if (!borrowDuration.value) {
        showToast('Please select a borrow duration', 'error');
        borrowDuration.focus();
        return;
    }
    
    if (!borrowPurpose.value.trim()) {
        showToast('Please enter a purpose for borrowing', 'error');
        borrowPurpose.focus();
        return;
    }
    
    // Get item ID
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('item_id').replace('b', ''); // Remove 'b' suffix
    const ownerId = document.querySelector('.owner-details p').textContent;
    
    // Show loading on button
    const submitBtn = document.querySelector('#borrowForm .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    
    try {
        const response = await fetch('http://127.0.0.1:8808/borrow/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                item_id: itemId,
                owner_id: ownerId,
                duration: borrowDuration.value,
                reason: borrowPurpose.value
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            closeAllModals();
            showToast('Borrow request sent successfully!', 'success');
            
            // Redirect to outgoing requests after a delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to send borrow request');
        }
    } catch (error) {
        console.error('Error sending borrow request:', error);
        showToast(error.message || 'Failed to send borrow request', 'error');
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ==================== Utility Functions ====================

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    return window.localStorage.getItem('loggedIn') === 'true';
}

/**
 * Show login required message and redirect
 */
function showLoginRequired(action) {
    showToast(`Please log in to ${action}`, 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Function to change the main image when a thumbnail is clicked
function changeMainImage(thumbnail) {
    const mainImage = document.querySelector('.main-image');
    mainImage.style.backgroundImage = thumbnail.style.backgroundImage;
}

// Function to generate star rating HTML
function generateStars(rating) {
    // Default to 0 if rating is undefined or null
    if (!rating) rating = 0;
    
    let starsHtml = '';
      // Add full stars
    for (let i = 0; i < Math.floor(rating); i++) {
        starsHtml += '<i class="rating-star-full"></i>';
    }
    
    // Add half star if applicable (when rating has .5 decimal)
    if (rating % 1 >= 0.5) {
        starsHtml += '<i class="rating-star-half"></i>';
    }
      // Add empty stars to make up a total of 5 stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="rating-star-empty"></i>';
    }
    
    return starsHtml;
}

// Replace your existing tabs functionality with this improved version
function setupTabFunctionality() {
    // Get the tab elements after DOM has been updated
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabBtns.length === 0 || tabPanels.length === 0) {
      console.error('Tab elements not found in the DOM');
      return;
    }
    
    // console.log('Setting up tabs with', tabBtns.length, 'buttons and', tabPanels.length, 'panels');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        console.log('Tab clicked:', this.getAttribute('data-tab'));
        
        // Remove active class from all buttons and panels
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Show corresponding panel
        const tabId = this.getAttribute('data-tab');
        const targetPanel = document.getElementById(tabId);
        
        if (targetPanel) {
          targetPanel.classList.add('active');
        } else {
          console.error('No tab panel found with id:', tabId);
        }
      });
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

async function displayFeedback (item_id) {
    // Displaying feedback about the item
    const feedback = document.querySelector('.feedback');
    // Fetching the feedback from the server
    const responseFeedback = await fetch('http://127.0.0.1:8808/feedback/', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            // item_id: data.itemDetails[0].item_id
            item_id: item_id,
        }),
    });

    const feedbackData = await responseFeedback.json();
    // console.log(feedbackData);
    // If the feedback is not empty
    if (feedbackData.length !== 0) {
        const reviewContainer = document.querySelector('.reviews-list');

        feedbackData.forEach(item => {
            const review = document.createElement('div');
            review.className = 'review';

            review.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                    </div>
                    <div class="reviewer-name">
                        ${item.username}
                    </div>
                </div>
                <div class="review-date">
                    ${item.creation_date ? new Date(item.creation_date).toLocaleDateString() : 'Recently'}
                </div>
            </div>
            <div class="review-content">
                <p>${item.review}</p>
            </div>
            <div class="rating">
                ${generateStars(item.rating)}
            </div>       
            `;

            reviewContainer.appendChild(review);
        });
    }
    else {
        const tabBtn = document.querySelector('.tab-btn[data-tab="reviews"]');

        tabBtn.addEventListener('click', function() {
            showToast("No reviews available", "info");
            
            setTimeout(() => {
                const tabBtns = document.querySelectorAll('.tab-btn');
                const tabPanels = document.querySelectorAll('.tab-panel');
    
                // Remove active class from all buttons and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
    
                tabBtns[0].classList.add('active'); // Set the first tab as active
                tabPanels[0].classList.add('active'); // Set the first panel as active
            }, 500);
        });
    }    
}

// Function to show similar items
function showSimilarItems (items, type) {
    const similarItemsContainer = document.querySelector('.similar-items');
    similarItemsContainer.innerHTML = ''; // Clear existing items

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'similar-item';
        itemElement.innerHTML = `
            <div class="similar-item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});"></div>
            <div class="similar-item-info">
                <h4>${item.item_name}</h4>
                <p>By ${item.username}</p>
            </div>
        `;
        similarItemsContainer.appendChild(itemElement);
    });

    // Adding event listeners to the similar items to redirect to the item details page with the item ID
    const similarItemElements = document.querySelectorAll('.similar-item');
    similarItemElements.forEach((itemElement, index) => {
        itemElement.addEventListener('click', () => {
            const itemId = items[index].item_id; // Getting the item ID from the related items array
            window.location.href = `./item-details.html?item_id=${itemId + (type === 'borrow' ? 'b' : 't')}`; // Redirecting to the item details page with the item ID as a query parameter
        });
    });
}

// Function for fetching user item
async function fetchUserItems(item_type, item_id) {
    try {
        // Sending a fetch request for item details plus the relevant items
        const response = await fetch('http://127.0.0.1:8808/browse/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                param1: item_type,
                param2: item_id
            }),
        });
            // If the req faisl
    if (response.status !== 200) {
        showToast("Error loading the details", "error");
        setTimeout(() => {
            window.location.href = './browse.html';
        }, 1000);      
    }
    const data = await response.json();
    
    const itemDetails = document.querySelector('.item-details-container');

    // console.log(data);

    itemDetails.innerHTML = `
        <div class="item-gallery animate-on-scroll">
            <div class="item-label">For ${data.type === 'borrow' ? 'Borrow' : "Trade"}</div>
            <div class="zoom-container">
                <div class="item-main-img zoom-img" style="background-image: url(${data.itemDetails[0].image_url ? data.itemDetails[0].image_url : './resources/images/placeholder.jpg'});"></div>
            </div>
            <div class="item-thumbnails">
            </div>
        </div>
        
        <div class="item-info animate-on-scroll">
            <h1 class="gradient-text"> ${data.itemDetails[0].item_name}</h1>
            <div class="item-meta">
                <span><i class="fas fa-tag"></i> ${data.itemDetails[0].category_name ? data.itemDetails[0].category_name : 'General'}</span>
                <span><i class="fas fa-clock"></i> ${new Date(data.itemDetails[0].creation_date).toLocaleDateString()}</span>
                <span><i class="fas fa-eye"></i> ${Math.floor(Math.random() * 150)}</span>
            </div>
            
            <div class="item-price">${data.type === 'borrow' ? 'Borrowable' : "Tradable"}</div>
            
            <div class="item-description">
                <p>${data.itemDetails[0].item_description}</p>
            </div>
            
            <div class="item-attributes">
                <div class="item-attribute">
                    <h4>Condition</h4>
                    <p>${data.itemDetails[0].item_condition ? data.itemDetails[0].item_condition : "Excellent"}</p>
                </div>
                <div class="item-attribute">
                    <h4>Owner</h4>
                    <p>${data.itemDetails[0].username}</p>
                </div>
            </div>
            
            <div class="item-actions">
                <button class="action-btn trade-btn">
                    <i class="fas fa-exchange-alt"></i> Propose Trade
                </button>
                <button class="action-btn borrow-btn">
                    <i class="fas fa-handshake"></i> Request Borrow
                </button>
                ${data.type === 'borrow' ? `<button class="action-btn feedback-btn"><i class="fas fa-flag"></i> Feedback</button>` : `<button class="action-btn wishlist-btn">
                    <i class="far fa-heart"></i>
                </button>`}
            </div>
            
            <div class="owner-info">
                <div class="owner-avatar" style="background-image: url('./resources/images/profile_pic.jpg');"></div>
                <div class="owner-details">
                    <h4>${data.itemDetails[0].username}</h4>
                    <p>${data.itemDetails[0].cms_id}</p>                    <div class="rating">
                        <i class="rating-star-full"></i>
                        <i class="rating-star-full"></i>
                        <i class="rating-star-full"></i>
                        <i class="rating-star-full"></i>
                        <i class="rating-star-half"></i>
                    </div>
                </div>
                <div class="contact-owner">
                    <button class="contact-btn">
                        <i class="fas fa-user"></i> Owner Profile
                    </button>
                </div>
            </div>
            
            <div class="item-tabs">
                <div class="tab-nav">
                    <button class="tab-btn active" data-tab="details">Category Description</button>
                    <button class="tab-btn" data-tab="reviews">Reviews</button>
                    <button class="tab-btn" data-tab="similar">Similar Items</button>
                </div>
                
                <div class="tab-content">
                    <div class="tab-panel active" id="details">
                        <p>${data.itemDetails[0].description}</p>
                    </div>
                    
                    <div class="tab-panel" id="reviews">
                        <div class="reviews-list">
                            
                        </div>
                    </div>
                    
                    <div class="tab-panel" id="similar">
                        <div class="similar-items">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>              
        `;
        setupModals();

        const contactBtn = document.querySelector('.contact-btn');
        contactBtn.addEventListener('click', function() {
            const url = './owner-profile.html?cms_id=' + data.itemDetails[0].cms_id;
            window.location.href = url;
        });

        if (data.type === 'borrow') {
            const tradeBtn = document.querySelector('.trade-btn');
            const borrowBtnDefault = document.querySelector('.borrow-btn');

            tradeBtn.addEventListener('click', function() {
                showToast("This item is not available for trade", "error");
            });
            const newBorrowBtn = borrowBtnDefault.cloneNode(true);
            borrowBtnDefault.parentNode.replaceChild(newBorrowBtn, borrowBtnDefault);
            newBorrowBtn.addEventListener('click', openBorrowModal);

            setupFeedbackModal(); // Setting up the feedback modal
        }
        else if (data.type === 'trade') {
            const borrowBtn = document.querySelector('.borrow-btn');
            const tradeBtnDefault = document.querySelector('.trade-btn');

            borrowBtn.addEventListener('click', function() {
                showToast("This item is not available for borrowing", "error");
            });
            const newTradeBtn = tradeBtnDefault.cloneNode(true);
            tradeBtnDefault.parentNode.replaceChild(newTradeBtn, tradeBtnDefault);
            newTradeBtn.addEventListener('click', openTradeModal);

        }
        
        displayFeedback(data.itemDetails[0].item_id); // Displaying the feedback for the item
        showSimilarItems(data.relatedItems, data.type); // Displaying the similar items

        setTimeout(() => {
            setupTabFunctionality();
        }, 100);
    }
    catch (error) {
        console.error('Error fetching user items:', error);
        showToast('Error fetching user items', 'error');
        return null;
    }
}


// Feedback Modal Functionality
function setupFeedbackModal() {
    // Get DOM elements
    const feedbackBtn = document.querySelector('.feedback-btn');
    const feedbackModal = document.getElementById('feedbackModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelFeedback');
    const feedbackForm = document.getElementById('feedbackForm');
    const stars = document.querySelectorAll('.star-rating i');
    const ratingInput = document.getElementById('ratingValue');
    const ratingText = document.querySelector('.rating-text');
    
    if (!feedbackBtn || !feedbackModal) return;
    
    // Set up star rating functionality
    stars.forEach(star => {
        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            
            // Update stars on hover
            stars.forEach(s => {
                const sRating = s.getAttribute('data-rating');                if (sRating <= rating) {
                    s.className = 'rating-star-full';
                } else {
                    s.className = 'rating-star-empty';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            // Reset to selected rating when not hovering
            updateStarsFromRating();
        });
        
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            updateStarsFromRating();
            updateRatingText(rating);
        });
    });
    
    // Update stars based on selected rating
    function updateStarsFromRating() {
        const rating = ratingInput.value;
        stars.forEach(s => {
            const sRating = s.getAttribute('data-rating');            if (sRating <= rating) {
                s.className = 'rating-star-full selected';
            } else {
                s.className = 'rating-star-empty';
            }
        });
    }
    
    // Update rating text based on selection
    function updateRatingText(rating) {
        const texts = [
            'Select a rating',
            'Poor - Not recommended',
            'Fair - Below average',
            'Good - Average quality',
            'Very Good - Above average',
            'Excellent - Highly recommended'
        ];
        ratingText.textContent = texts[rating] || texts[0];
    }
    
    // Open feedback modal
    feedbackBtn.addEventListener('click', function() {
        // Check if user is logged in
        if (window.localStorage.getItem('loggedIn') !== 'true') {
            showToast('Please log in to leave feedback', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            return;
        }
        
        // Get item data from current page
        const itemName = document.querySelector('.gradient-text').textContent;
        const itemOwner = document.querySelector('.owner-details h4').textContent;
        const itemImgUrl = document.querySelector('.item-main-img').style.backgroundImage;
        
        // Populate modal with item details
        document.getElementById('feedback-item-name').textContent = itemName;
        document.getElementById('feedback-item-owner').textContent = `Owner: ${itemOwner}`;
        document.getElementById('feedback-item-img').style.backgroundImage = itemImgUrl;
        
        // Show modal
        feedbackModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close modal functions
    const closeFeedbackModal = () => {
        feedbackModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        feedbackForm.reset();
        
        // Reset star rating
        ratingInput.value = 0;
        updateStarsFromRating();
        updateRatingText(0);
        
        // Remove any error messages
        const errorMsg = document.querySelector('.form-error');
        if (errorMsg) errorMsg.remove();
    };
    
    // Close modal event listeners
    closeModal.addEventListener('click', closeFeedbackModal);
    cancelBtn.addEventListener('click', closeFeedbackModal);
    window.addEventListener('click', function(e) {
        if (e.target === feedbackModal) closeFeedbackModal();
    });
    
    // Submit feedback
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const rating = ratingInput.value;
        const feedback = document.getElementById('feedback-text').value;
        
        // Validate input
        if (rating === '0') {
            // Show rating error if not already present
            if (!document.querySelector('.form-error')) {
                const errorMsg = document.createElement('p');
                errorMsg.className = 'form-error';
                errorMsg.textContent = 'Please select a rating';
                document.querySelector('.rating-text').after(errorMsg);
            }
            return;
        }
        
        // Show loading state on button
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';
        
        try {
            // Get item ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const itemIdWithType = urlParams.get('item_id');
            const itemId = itemIdWithType.slice(0, -1); // Remove the last character (b/t)
            
            // Get owner ID
            const ownerId = document.querySelector('.owner-details p').textContent;
            
            // Send feedback to server
            const response = await fetch('http://127.0.0.1:8808/item_feedback/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    item_id: itemId,
                    rating: parseInt(rating),
                    review: feedback,
                    owner_id: ownerId
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Success
                closeFeedbackModal();
                showToast('Your feedback has been submitted successfully!', 'success');
                
                // Reload the page after a short delay to show updated reviews
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                // Server error
                throw new Error(result.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            showToast(error.message || 'Failed to submit feedback. Please try again.', 'error');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Animation on scroll
document.addEventListener('DOMContentLoaded', async () => {
    checkLoginStatus(); // Check if user is logged in
    const links = document.querySelectorAll('.cat-links');
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor click behavior
                const value = this.textContent.trim(); // Get the text content of the clicked link
                const url = `browse.html?category=${value}`; // Construct the URL with the category value
                window.location.href = url; // Redirect to the new URL
            });
        });


    // Extracting the params from the url
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('item_id');
    // console.log(itemId); // For debugging
    let item_type, item_id;

    // If the query param contains t, then the item is tradable
    if (itemId.includes('t')) {
        item_type = 'tradable';
        item_id = itemId.replace("t", "");
    }
    // If the query param contains b, then the item is borrowable
    else {
        item_type = 'borrowable';
        item_id = itemId.replace("b", "");
    }

    // console.log(item_type, item_id); // For debugging
    fetchUserItems(item_type, item_id); // Fetching the user items


});