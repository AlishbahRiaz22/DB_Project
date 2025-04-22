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
    // If they are related items
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
                    <a href="#" class="feedback-link">feedback</a>
                </div>`;

        // Displaying feedback about the item
        const feedback = document.querySelector('.feedback');
        // Fetching the feedback from the server
        console.log(data.itemDetails[0].item_id);
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
            hide1.textContent = "No feedback available";
            feedback.style.display = 'none'; // Hide the feedback section
        }

                // EventListener to be implemented
    }
    // If the item is tradable
    else if (data.type === 'trade') {
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
                        <span>Token Value: ${data.itemDetails[0].token_val}</span>
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
});