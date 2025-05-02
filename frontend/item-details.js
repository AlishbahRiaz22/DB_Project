if (window.localStorage.getItem('loggedIn') === 'true') {
    // If the user is logged in, we update the buttons
    const signupBtn = document.querySelector('.signup-btn'); // Selecting the signup button
    const loginBtn = document.querySelector('.login-btn'); // Selecting the login button

    // Updating the login button to act as a link to the user's profile
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
    loginBtn.addEventListener('click', function() {
        window.location.href = "profile.html";
    })

    // Updating the signup button to act as a logout button
    signupBtn.textContent = "Logout";
    signupBtn.href = "#";
    signupBtn.addEventListener('click', async function() {
        const response = await fetch('http://127.0.0.1:8808/logout', {
            method: "POST",
            credentials: 'include'
        })
        if(response.status === 200) {
            // If user successfully logged out, redirect to index.html
            // To undo the changes made to the login button, we set it back to its original state by redirection
            window.location.href = "index.html";
            window.localStorage.setItem('loggedIn', 'false'); // Setting the loggedIn status to false
        }
        else {
            alert("Error logging out. Please try again.");
        }
    })
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
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if applicable (when rating has .5 decimal)
    if (rating % 1 >= 0.5) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars to make up a total of 5 stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Animation on scroll
document.addEventListener('DOMContentLoaded', async () => {
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
        window.location.href = './browse.html';
        alert("Error loading the details");
    }

    const data = await response.json();

    // Getting the item-grid div 
    const itemGrid = document.getElementsByClassName("item-grid")[0];

    // For displaying the relevant items
    // If there are related items
    if (data.relatedItems.length !== 0) {
        // If the item is borrowable 
        if (data.type === 'borrow') {

            data.relatedItems.forEach(item => {
                // Creating a new div element for each item
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card'; // Setting the class name for styling
                // Setting the inner HTML of the item element with the item's details
                itemElement.innerHTML = `
                  <div class="item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});">
                    <div class="item-owner">By ${item.username}</div>
                  </div>
                  <div class="item-details">
                    <h3>${item.item_name}</h3>
                    <div class="item-meta">
                      <span>${item.category_name ? item.category_name : 'Daily Use'}</span>
                      <span>Status: ${item.status ? 'Available' : "Not Available"}</span>
                    </div>
                    <button class="item-btn b-btn">View Details</button>
                  </div>
                `;
                // Appending the item element to the borrowable items container
                itemGrid.appendChild(itemElement);
            })
            const borrowBtn = document.querySelectorAll('.b-btn');

            // Adding event listeners to the borrowable item buttons to redirect to the item details page with the item ID
            borrowBtn.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const itemId = data.relatedItems[index].item_id; // Getting the item ID from the related items array
                    window.location.href = `./item-details.html?item_id=${itemId + 'b'}`; // Redirecting to the item details page with the item ID as a query parameter
                })
            });
        }
        // If the item is tradable
        else if (data.type === 'trade') {
            data.relatedItems.forEach(item => {
                // Creating a new div element for each item
                const itemElement = document.createElement('div');
                itemElement.className = 'item-card'; // Setting the class name for styling
                // Setting the inner HTML of the item element with the item's details
                itemElement.innerHTML = `
                  <div class="item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});">
                    <div class="item-owner">By ${item.username}</div>
                  </div>
                  <div class="item-details">
                    <h3>${item.item_name}</h3>
                    <div class="item-meta">
                      <span>${item.category_name ? item.category_name : 'Daily Use'}</span>
                      <span>Status: ${item.status ? 'Available' : "Not Available"}</span>
                    </div>
                    <button class="item-btn t-btn">View Details</button>
                  </div>
                `;
                // Appending the item element to the borrowable items container
                itemGrid.appendChild(itemElement);
            })
            const tradeBtn = document.querySelectorAll('.t-btn');

            // Adding event listeners to the borrowable item buttons to redirect to the item details page with the item ID
            tradeBtn.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const itemId = data.relatedItems[index].item_id; // Getting the item ID from the related items array
                    window.location.href = `./item-details.html?item_id=${itemId + 't'}`; // Redirecting to the item details page with the item ID as a query parameter
                })
            });
        }
    } else { // If there are no related items
        const hidePara = document.getElementsByClassName('hide')[0];
        hidePara.style.fontStyle = 'italic'; // Setting the font style to italic
        hidePara.textContent = 'No items available'; 

    }

    // For the details of the item
    // If the item is borrowable
    if (data.type === 'borrow') {
        // Getting the main-image div
        const mainImage = document.getElementsByClassName('main-image')[0];
        // Setting the backgroundImage 
        mainImage.style.backgroundImage = `url(${data.itemDetails[0].image_url ? data.itemDetails[0].image_url : './resources/images/placeholder.jpg'})`;

        // Getting the productInfo div
        const productInfo = document.getElementsByClassName('product-info')[0];
        // Setting the innerHTML to display the relevant info to the item
        productInfo.innerHTML = `<h1 class="product-title">${data.itemDetails[0].item_name}</h1>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${data.itemDetails[0].category_name}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>Status: ${data.itemDetails[0].status ? "Available" : "Not Available"}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>Excellent condition</span>
                    </div>
                </div>

                <div class="owner-info">
                    <div class="owner-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h4>${data.itemDetails[0].username}</h4>
                        <p>${data.itemDetails[0].cms_id}</p>
                    </div>
                </div>

                <div class="product-description">
                    <h3>Description</h3>
                    <p>${data.itemDetails[0].item_description}</p>
                    
                </div>

                <div class="action-buttons">
                    <button class="action-btn request-trade">Borrow</button>
                    <button class="action-btn contact-owner">Owner Profile</button>
                </div>

                <div class="report-item">
                </div>`;

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
                item_id: data.itemDetails[0].item_id
            }),
        });

        const feedbackData = await responseFeedback.json();
        // If the feedback is not empty
        if (feedbackData.length !== 0) {

            // Loop through feedback data and create cards
        feedbackData.forEach(item => {
            // Generate stars based on rating (1-5)
            const stars = generateStars(item.rating);
            
            // Format date if available
            const date = item.date ? new Date(item.date).toLocaleDateString() : 'Recently';
            
            // Create feedback card
            const feedbackCard = document.createElement('div');
            feedbackCard.className = 'feedback-card animate-on-scroll';
            feedbackCard.innerHTML = `
                <div class="feedback-header">
                    <div class="user-info">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="user-details">
                            <h4>${item.username}</h4>
                            <small>ID: ${item.cms_id}</small>
                        </div>
                    </div>
                    <div class="rating">
                        ${stars}
                    </div>
                </div>
                <div class="feedback-body">
                    <p>${item.review}</p>
                </div>
                <div class="feedback-date">
                    ${date}
                </div>
            `;
            
            feedback.appendChild(feedbackCard);
            });
        }
        else {
            const hide1 = document.getElementsByClassName('hide1')[0];
            hide1.style.fontStyle = 'italic'; // Setting the font style to italic
            hide1.textContent = "No feedback available";
            feedback.style.display = 'none'; // Hide the feedback section
        }

                if(data.itemDetails[0].status === 0) {
                    alert("Item is not available for borrowing");

                }
                else {
                    const modal = document.getElementById('borrowModal');
                    const openModalBtn = document.querySelector('.request-trade');
                    const closeModalBtn = document.querySelector('.close-modal');
                    const cancelBtn = document.getElementById('cancelBorrow');
                    const modalItemName = document.getElementById('modalItemName');
                    const modalItemOwner = document.getElementById('modalItemOwner');
                    const modalItemImage = document.getElementById('modalItemImage');
                    const borrowForm = document.getElementById('borrowForm');
                    
                    // Open modal when borrow button is clicked
                    // Open modal when borrow button is clicked
                    if (openModalBtn) {
                        openModalBtn.addEventListener('click', async function() {
                            // Check if user is logged in
                            if(!await checkUserLoggedIn()) {
                                alert('Please log in to borrow items');
                                window.location.href = 'login.html';
                                return;
                            }
                    
                            // Populate modal with item details
                            if (data && data.itemDetails && data.itemDetails[0]) {
                                modalItemName.textContent = data.itemDetails[0].item_name;
                                modalItemOwner.textContent = `Owner: ${data.itemDetails[0].username}`;
                                
                                // If you have an item image, set it here
                                modalItemImage.src = data.itemDetails[0].image_url || './resources/images/placeholder.jpg';
                                
                                // Populate the borrow period dropdown with available durations
                                const borrowPeriod = document.getElementById('borrowPeriod');
                                borrowPeriod.innerHTML = ''; // Clear existing options

                                const duration = await fetch('http://127.0.0.1:8808/borrow/duration/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        item_id: data.itemDetails[0].item_id
                                    })
                                });
                                
                                const durationData = await duration.json();

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
                                    // Default option if no durations available
                                    const option = document.createElement('option');
                                    option.value = '';
                                    option.textContent = 'No durations available';
                                    option.disabled = true;
                                    option.selected = true;
                                    borrowPeriod.appendChild(option);
                                }
                            }
                            
                            // Display modal
                            modal.style.display = 'flex';
                            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
                            });
                        }
                    
                    // Close modal functions
                    function closeModal() {
                        modal.style.display = 'none';
                        document.body.style.overflow = 'auto'; // Enable scrolling again
                        borrowForm.reset(); // Reset form when closing
                    }
                    
                    // Close modal when X is clicked
                    if (closeModalBtn) {
                        closeModalBtn.addEventListener('click', closeModal);
                    }
                    
                    // Close modal when cancel button is clicked
                    if (cancelBtn) {
                        cancelBtn.addEventListener('click', closeModal);
                    }
                    
                    // Close modal when clicking outside
                    window.addEventListener('click', function(event) {
                        if (event.target === modal) {
                            closeModal();
                        }
                    });
                    
                    // Submit the borrow form
                    if (borrowForm) {
                        borrowForm.addEventListener('submit', async function(event) {
                            event.preventDefault();
                            
                            const borrowPeriod = document.getElementById('borrowPeriod').value;
                            const borrowReason = document.getElementById('borrowReason').value;
                            
                            try {
                                const response = await fetch('http://127.0.0.1:8808/borrow/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        item_id: data.itemDetails[0].item_id,
                                        duration: borrowPeriod,
                                        reason: borrowReason,
                                        owner_id: data.itemDetails[0].cms_id
                                    })
                                });
                                
                                const result = await response.json();
                                
                                if (response.ok) {
                                    // Success - close modal and show success message
                                    closeModal();
                                    alert('Borrow request sent successfully!');
                                } else {
                                    // Handle errors
                                    alert(result.error || 'Failed to send borrow request');
                                }
                                
                            } catch (error) {
                                console.error('Error sending borrow request:', error);
                                alert('An error occurred. Please try again.');
                            }
                        });
                    }
                }
    }
    // If the item is tradable
    else if (data.type === 'trade') {
        const feedback = document.querySelector('.feedback-section');
        feedback.style.display = 'none'; // Hide the feedback section

        // Getting the main-image div 
        const mainImage = document.getElementsByClassName('main-image')[0];
        // Setting the backgroundImage
        mainImage.style.backgroundImage = `url(${data.itemDetails[0].image_url ? data.itemDetails[0].image_url : './resources/images/placeholder.jpg'})`;

        // Getting the productInfo div
        const productInfo = document.getElementsByClassName('product-info')[0];
        // Setting the innerHTML to display the relevant info
        productInfo.innerHTML = `<h1 class="product-title">${data.itemDetails[0].item_name}</h1>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <i class="fas fa-tag"></i>
                        <span>${data.itemDetails[0].category_name}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>Status: ${data.itemDetails[0].status ? "Available" : "Not Available"}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <span>Excellent Condition</span>
                    </div>
                </div>

                <div class="owner-info">
                    <div class="owner-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <h4>${data.itemDetails[0].username}</h4>
                        <p>${data.itemDetails[0].cms_id}</p>
                    </div>
                </div>

                <div class="product-description">
                    <h3>Description</h3>
                    <p>${data.itemDetails[0].item_description}</p>
                    
                </div>

                <div class="action-buttons">
                    <button class="action-btn request-trade">Offer Trade</button>
                    <button class="action-btn contact-owner">Owner Profile</button>
                </div>

                <div class="report-item">
                </div>`;


                // EventListener to be implemented
                // Get modal elements
    const tradeModal = document.getElementById('tradeModal');
    const openTradeModalBtn = document.querySelector('.request-trade');
    const closeModalBtn = tradeModal?.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelTrade');
    const modalItemName = document.getElementById('modalItemName1');
    const modalItemOwner = document.getElementById('modalItemOwner1');
    const modalItemImage = document.getElementById('modalItemImage1');
    const tradeForm = document.getElementById('tradeForm');
    const tradeItemSelect = document.getElementById('tradeItem');
    
    // Function to fetch user's available items for trade
    async function fetchUserItems() {
        try {
            const response = await fetch('http://127.0.0.1:8808/trade/userItems/', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.status === 401) {
                alert('You are not logged in. Please log in to continue.');
                window.location.href = './login.html'; // Redirect to login page if not logged in
                return;
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const userItems = await response.json();
            console.log(userItems); // For debugging
            // Clear existing options
            tradeItemSelect.innerHTML = '<option value="">Select an item to offer</option>';
            
            // Add user's items to select dropdown
            if (userItems && userItems.length > 0) {
                userItems.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.item_id;
                    console.log(item.item_id); // For debugging
                    console.log(option.value); // For debugging
                    option.textContent = item.item_name;
                    option.dataset.category = item.category_name;
                    tradeItemSelect.appendChild(option);
                });
            } else {
                // No items available
                const option = document.createElement('option');
                option.disabled = true;
                option.textContent = "You don't have any items to trade";
                tradeItemSelect.appendChild(option);
            }
        } catch (error) {
            console.error('Error fetching user items:', error);
            alert('Could not load your items. Please try again.');
            window.location.reload(); // Reload the page to try again
        }
    }
    
    // Show item preview when selected
    if (tradeItemSelect) {
        tradeItemSelect.addEventListener('change', function() {
            const preview = document.querySelector('.item-preview');
            if (preview) {
                preview.remove();
            }
            
            if (this.value) {
                const selectedOption = this.options[this.selectedIndex];
                console.log(selectedOption); // For debugging
                const category = selectedOption.dataset.category;
                
                const previewDiv = document.createElement('div');
                previewDiv.className = 'item-preview';
                previewDiv.innerHTML = `
                    <div class="item-preview-details">
                        <img src="/api/placeholder/100/100" alt="Item thumbnail">
                        <div>
                            <div class="item-preview-name">${selectedOption.textContent}</div>
                            <div class="item-preview-category">${category === null ? category : 'General'}</div>
                        </div>
                    </div>
                `;
                
                this.parentNode.appendChild(previewDiv);
            }
        });
    }
    
    // Open modal when trade button is clicked
    if (openTradeModalBtn) {
        openTradeModalBtn.addEventListener('click', async function() {
            
            // Populate modal with item details
            if (data && data.itemDetails && data.itemDetails[0]) {
                console.log(data.itemDetails[0]);
                modalItemName.textContent = data.itemDetails[0].item_name;
                modalItemOwner.textContent = `Owner: ${data.itemDetails[0].username}`;
                
                // If you have an item image, set it here
                modalItemImage.src = data.itemDetails[0].image_url || './resources/images/placeholder.jpg';
            }
            
            // Fetch user's items for trade
            await fetchUserItems();
            
            // Display modal
            tradeModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });
    }
    
    // Function to check if user is logged in
    async function checkUserLoggedIn() {
        try {
            const response = await fetch('http://127.0.0.1:8808/check-auth/', {
                method: 'GET',
                credentials: 'include',
            });
            return response.ok;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }
    
    // Close modal functions
    function closeModal() {
        tradeModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling again
        tradeForm.reset(); // Reset form when closing
        
        // Remove any item preview
        const preview = document.querySelector('.item-preview');
        if (preview) {
            preview.remove();
        }
    }
    
    // Close modal when X is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when cancel button is clicked
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === tradeModal) {
            closeModal();
        }
    });
    
    // Submit the trade form
    if (tradeForm) {
        tradeForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const offeredItemId = tradeItemSelect.value;
            const tradeReason = document.getElementById('tradeReason').value;
            
            if (!offeredItemId) {
                alert('Please select an item to offer for trade');
                return;
            }
            
            try {
                const response = await fetch('http://127.0.0.1:8808/trade/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        desired_item_id: data.itemDetails[0].item_id,
                        offered_item_id: offeredItemId,
                        reason: tradeReason,
                        owner_id: data.itemDetails[0].cms_id,
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success - close modal and show success message
                    closeModal();
                    alert('Trade request sent successfully!');
                } else {
                    // Handle errors
                    alert(result.error || 'Failed to send trade request');
                }
                
            } catch (error) {
                console.error('Error sending trade request:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
    }
    

    // No changes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease-out';
        observer.observe(element);
    });

    // Add a feedback button to the action buttons section
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons && data.type === 'borrow') {
        const feedbackBtn = document.createElement('button');
        feedbackBtn.className = 'action-btn feedback-btn';
        feedbackBtn.innerHTML = '<i class="far fa-comment"></i> Leave Feedback';
        actionButtons.appendChild(feedbackBtn);
        
        // Get modal elements
        const feedbackModal = document.getElementById('feedbackModal');
        const closeModalBtn = feedbackModal?.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelFeedback');
        const feedbackForm = document.getElementById('feedbackForm');
        const starRating = document.querySelector('.star-rating');
        const ratingValue = document.getElementById('ratingValue');
        const ratingText = document.querySelector('.rating-text');
        const stars = starRating?.querySelectorAll('i');
        
        // Set up star rating functionality
        if (stars) {
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = this.getAttribute('data-rating');
                    ratingValue.value = rating;
                    
                    // Update stars appearance
                    stars.forEach(s => {
                        const sRating = s.getAttribute('data-rating');
                        if (sRating <= rating) {
                            s.className = 'fas fa-star selected';
                        } else {
                            s.className = 'far fa-star';
                        }
                    });
                    
                    // Update rating text
                    const ratingTexts = [
                        'Select a rating',
                        'Poor',
                        'Fair',
                        'Good',
                        'Very Good',
                        'Excellent'
                    ];
                    ratingText.textContent = ratingTexts[rating];
                });
            });
        }
        
        // Open modal when feedback button is clicked
        feedbackBtn.addEventListener('click', async function() {
            // Check if user is logged in
            const userLoggedIn = await checkUserLoggedIn();
            if (!userLoggedIn) {
                alert('Please log in to leave feedback');
                window.location.href = 'login.html';
                return;
            }
            
            // Populate modal with item details
            if (data && data.itemDetails && data.itemDetails[0]) {
                document.getElementById('feedbackItemName').textContent = data.itemDetails[0].item_name;
                document.getElementById('feedbackItemOwner').textContent = `Owner: ${data.itemDetails[0].username}`;
                
                // If you have an item image, set it here
                // document.getElementById('feedbackItemImage').src = data.itemDetails[0].image_url || '/api/placeholder/200/200';
            }
            
            // Display modal
            feedbackModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });
        
        // Close modal functions
        function closeModal() {
            feedbackModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling again
            feedbackForm.reset(); // Reset form when closing
            
            // Reset star rating
            if (stars) {
                stars.forEach(s => {
                    s.className = 'far fa-star';
                });
            }
            ratingValue.value = 0;
            ratingText.textContent = 'Select a rating';
        }
        
        // Close modal when X is clicked
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }
        
        // Close modal when cancel button is clicked
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === feedbackModal) {
                closeModal();
            }
        });
        
        // Submit the feedback form
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                
                const rating = ratingValue.value;
                const review = document.getElementById('reviewText').value;
                
                if (rating === '0') {
                    // Show error if no rating selected
                    if (!document.querySelector('.rating-error')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'form-error rating-error';
                        errorMsg.textContent = 'Please select a rating';
                        ratingText.after(errorMsg);
                    }
                    return;
                }
                
                try {
                    const response = await fetch('http://127.0.0.1:8808/item_feedback/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            item_id: data.itemDetails[0].item_id,
                            rating: parseInt(rating),
                            review: review,
                            owner_id: data.itemDetails[0].cms_id
                        })
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        // Success - close modal and show success message
                        closeModal();
                        alert('Feedback submitted successfully!');
                        
                        window.location.reload(); // Reload the page to show updated feedback
                    } else {
                        // Handle errors
                        alert(result.error || 'Failed to submit feedback');
                    }
                    
                } catch (error) {
                    console.error('Error submitting feedback:', error);
                    alert('An error occurred. Please try again.');
                }
            });
        }
    }
    
    // Function to check if user is logged in
    async function checkUserLoggedIn() {
        const response = await fetch('http://127.0.0.1:8808/login', {
            method: "GET",
            credentials: 'include'
        });

        if (response.status === 200) {
            return true; // User is logged in
        }
        return false; // User is not logged in
    }
});
