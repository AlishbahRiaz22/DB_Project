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

// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', async function() {
    checkLoginStatus(); // Call the function to check login status

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
            itemElement.className = 'item-card animate-on-scroll'; // Setting the class name for styling
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

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Smooth page transitions
document.addEventListener('DOMContentLoaded', function() {
    // Add transition class to body
    document.body.classList.add('page-transition');
    
    // Handle all navigation links
    document.querySelectorAll('a[href^="./"], a[href^="/"], a[href^="index"], a[href^="about"], a[href^="browse"], a[href^="category"], a[href^="login"], a[href^="signup"], a[href^="user-profile"], a[href^="upload-item"], a[href^="item-details"], a[href^="how-it-works"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip if modifier keys are pressed or it's an external link
            if (e.metaKey || e.ctrlKey || this.target === '_blank') return;
            
            e.preventDefault();
            const currentPage = window.location.href;
            const newPage = this.href;
            
            // Don't animate if it's the same page
            if (currentPage === newPage) return;
            
            // Start exit animation
            document.body.classList.add('page-exit');
            
            // After animation completes, navigate to new page
            setTimeout(() => {
                window.location.href = newPage;
            }, 500);
        });
    });
    
    // Entrance animation when page loads
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

// Animation on scroll
const animateElements = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
};

// Run animation check on load and scroll
window.addEventListener('scroll', animateElements);
window.addEventListener('load', animateElements);

// Interactive category cards
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.category-img i');
            icon.classList.add('fa-beat');
            
            setTimeout(() => {
                icon.classList.remove('fa-beat');
            }, 1000);
        });
    });
});

// Dark mode toggle
function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.classList.add('dark-mode-toggle');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(darkModeToggle);
    
    // Check for saved user preference
    const darkMode = localStorage.getItem('darkMode') === 'enabled';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            this.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            this.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
}

// Call setup function when DOM is loaded
document.addEventListener('DOMContentLoaded', setupDarkMode);

// Parallax effect for hero section
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
});

// Interactive 3D card tilt effect for item cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.item-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleCardMove);
        card.addEventListener('mouseleave', handleCardLeave);
    });
    
    function handleCardMove(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        
        // Get mouse position relative to card
        const mouseX = e.clientX - cardRect.left;
        const mouseY = e.clientY - cardRect.top;
        
        // Calculate rotation angles (max 10 degrees)
        const rotateY = ((mouseX / cardWidth) - 0.5) * 10;
        const rotateX = -((mouseY / cardHeight) - 0.5) * 10;
        
        // Apply the transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        
        // Create shine effect
        const shine = card.querySelector('.shine') || document.createElement('div');
        if (!card.querySelector('.shine')) {
            shine.classList.add('shine');
            card.appendChild(shine);
        }
        
        const shineX = (mouseX / cardWidth) * 100;
        const shineY = (mouseY / cardHeight) * 100;
        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 80%)`;
    }
    
    function handleCardLeave() {
        // Reset transform on mouse leave
        this.style.transform = '';
        const shine = this.querySelector('.shine');
        if (shine) {
            shine.remove();
        }
    }
});