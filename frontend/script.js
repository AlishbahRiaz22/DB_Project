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

// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', async function() {
    const itemGrid = document.querySelector('.item-grid');
    const featuredItems = await fetch('http://127.0.1:8808/browse/featured/', {
        method: 'GET',
        credentials: 'include', // Sending the cookie with the request
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const featuredItemsData = await featuredItems.json(); // Parsing the response as JSON

    featuredItemsData.forEach(item => {
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
                  <span>${item.category_name ? item.category_name : 'General'}</span>
                  <span>Status: ${item.status ? 'Available' : "Not Available"}</span>
                </div>
                <button class="item-btn b-btn">View Details</button>
              </div>
            `;
            // Appending the item element to the borrowable items container
            itemGrid.appendChild(itemElement);
        });

        const itemBtn = document.querySelectorAll('.item-btn');
        itemBtn.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const itemId = featuredItemsData[index].item_id; // Get the item ID from the data
                window.location.href = `./item-details.html?item_id=${itemId + 'b'}`; // Redirect to the item details page with the item ID as a query parameter
            });
        });


    const links = document.querySelectorAll('.cat-links');
        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor click behavior
                const value = this.textContent.trim(); // Get the text content of the clicked link
                const url = `browse.html?category=${value}`; // Construct the URL with the category value
                window.location.href = url; // Redirect to the new URL
            });
        });
        
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Product Page Image Gallery
    const productThumbs = document.querySelectorAll('.product-thumb');
    const mainProductImage = document.querySelector('.product-main-img');
    
    if (productThumbs.length > 0 && mainProductImage) {
        productThumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const bgImage = getComputedStyle(this).backgroundImage;
                mainProductImage.style.backgroundImage = bgImage;
                
                // Remove active class from all thumbnails
                productThumbs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked thumbnail
                this.classList.add('active');
            });
        });
    }
    
    // Form Validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Create error message if it doesn't exist
                    let errorMsg = field.parentNode.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('span');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMsg);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Simple Animation on Scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on initial load
});