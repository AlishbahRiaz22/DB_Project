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
// This script fetches borrowable and tradeable items from the server and displays them on the page
// It also handles filtering of items based on their status and type (borrowable or tradable) and category
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

    // Fetching borrowable and tradable items from the server
    const response = await fetch('http://127.0.0.1:8808/browse/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    const data = await response.json();
    
    // Variables to hold the borrowable and tradable items
    const borrowableItems = data.borrowable_items;
    const tradableItems = data.tradable_items;
    // Container elements to display the items
    const borrowableItemsContainer = document.getElementsByClassName('borrowable-items')[0];
    const tradableItemsContainer = document.getElementsByClassName('tradable-items')[0];
    // Headings for the sections
    const tradeHeading = document.getElementById('trade-h1');
    const borrowHeading = document.getElementById('borrow-h1');

    // If both borrowable and tradable items are available, display them in their respective sections
    if (borrowableItems.length !== 0 && tradableItems.length !== 0) {
        // Looping through the borrowable items and creating HTML elements for each item
        borrowableItems.forEach(item => {
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
            borrowableItemsContainer.appendChild(itemElement);
        });

        tradableItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-card';
            itemElement.innerHTML = `
              <div class="item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});">
                <div class="item-owner">By ${item.username}</div>
                <div class="item-owner item-token">Token: ${item.token_val}</div>
            </div>
            <div class="item-details">
                <h3>${item.item_name}</h3>
                <div class="item-meta">
                   <span>${item.category_name ? item.category_name : 'General'}</span>
                   <span>Status: ${item.status ? 'Available' : "Not Available"}</span>
                </div>
                <button class="item-btn t-btn">View Details</button>
            </div>
            `;
            tradableItemsContainer.appendChild(itemElement);
        });
    }
    // If only borrowable items are available, display them in the borrowable section
    else if (borrowableItems.length !== 0) {
        tradableItemsContainer.style.display = 'flex';
        tradableItemsContainer.style.justifyContent = 'center';
        tradableItemsContainer.style.marginTop = '-20px';
        tradableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;

        borrowableItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-card';
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
            borrowableItemsContainer.appendChild(itemElement);
        });
    }
    // If only tradable items are available, display them in the tradable section
    else if (tradableItems.length !== 0) {
        borrowableItemsContainer.style.display = 'flex';
        borrowableItemsContainer.style.justifyContent = 'center';
        borrowableItemsContainer.style.marginTop = '-20px';
        borrowableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
        

        tradableItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-card';
            itemElement.innerHTML = `
              <div class="item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});">
                <div class="item-owner">By ${item.username}</div>
                <div class="item-owner item-token">Token: ${item.token_val}</div>
            </div>
            <div class="item-details">
                <h3>${item.item_name}</h3>
                <div class="item-meta">
                   <span>${item.category_name ? item.category_name : 'General'}</span>
                   <span>Status: ${item.status ? 'Available' : "Not Available"}</span>
                </div>
                <button class="item-btn t-btn">View Details</button>
            </div>
            `;
            tradableItemsContainer.appendChild(itemElement);
        });
    }
    // If neither borrowable nor tradable items are available, display a message indicating no items are available
    else {
        borrowableItemsContainer.style.display = 'flex';
        borrowableItemsContainer.style.justifyContent = 'center';
        borrowableItemsContainer.style.marginTop = '-20px';
        borrowableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
        tradableItemsContainer.style.display = 'flex';
        tradableItemsContainer.style.justifyContent = 'center';
        tradableItemsContainer.style.marginTop = '-20px';
        tradableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
    }

    const borrowBtn = document.querySelectorAll('.b-btn');
    const tradeBtn = document.querySelectorAll('.t-btn');

    // Adding event listeners to the borrowable item buttons to redirect to the item details page with the item ID
    borrowBtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const itemId = borrowableItems[index].item_id; // Getting the item ID from the borrowable items array
            window.location.href = `./item-details.html?item_id=${itemId + 'b'}`; // Redirecting to the item details page with the item ID as a query parameter
        })
    });

    // Adding event listeners to the tradable item buttons to redirect to the item details page with the item ID
    tradeBtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const itemId = tradableItems[index].item_id; // Getting the item ID from the tradable items array
            window.location.href = `./item-details.html?item_id=${itemId + 't'}`; // Redirecting to the item details page with the item ID as a query parameter
        })
    });


    // Getting the clear and apply buttons for filtering
    const clearBtn = document.getElementsByClassName('clear-btn')[0];
    const applyBtn = document.getElementsByClassName('apply-btn')[0];

    // Adding an event listener to the clear button to reload the page when clicked
    clearBtn.addEventListener('click', () => {
        window.location.href = 'browse.html'; // Reload the page to clear filters
    });  

    // Getting the filter elements for status, category, and item type
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const itemTypeFilter = document.getElementById('item-type-filter');

    // Adding an event listener to the apply button to filter items based on selected criteria
    applyBtn.addEventListener('click', () => {
        
        // Getting the selected values from the filter elements
        const selectedStatus = statusFilter.value;
        const selectedCategory = categoryFilter.value;
        const selectedItemType = itemTypeFilter.value;

        // First, Filtering the items based on the selected item type
        // If the selected item type is 'Borrowable', hide the tradable items and show the borrowable items
        if (selectedItemType === 'Borrowable') {
            tradableItemsContainer.style.display = 'none';
            tradeHeading.style.display = 'none';
            borrowableItemsContainer.style.display = 'grid';
            borrowHeading.style.display = 'block';

            // If the selected status is 'Available', filter the borrowable items to show only available ones
            if (selectedStatus === "Available") {
                // console.log('Available');
                const items = borrowableItemsContainer.getElementsByClassName('item-card');
                // Looping through the borrowable items and checking their status
                for (let i = 0; i < items.length; i++) {
                    const itemStatus = items[i].querySelector('.item-meta span:nth-child(2)').textContent;
                    // If the item status is 'Not Available', hide the item
                    if (itemStatus.includes('Not Available')) {
                        items[i].style.display = 'none';
                    } else { // If the item status is 'Available', show the item
                        items[i].style.display = 'block';
                    }
                }

                if (selectedCategory !== 'All-Categories') {
                    const items = borrowableItemsContainer.getElementsByClassName('item-card');
                    // Looping through the borrowable items and checking their category
                    for (let i = 0; i < items.length; i++) {
                        const itemCategory = items[i].querySelector('.item-meta span:nth-child(1)').textContent.toLowerCase();
                        // If the item category does not match the selected category, hide the item
                        if (!itemCategory.includes(selectedCategory.toLowerCase())) {
                            items[i].style.display = 'none';
                        } else { // If the item category matches, show the item
                            items[i].style.display = 'block';
                        }
                    }
                }
            }
            // If the selected status is 'Not Available', filter the borrowable items to show only unavailable ones
            else {
                const items = borrowableItemsContainer.getElementsByClassName('item-card');
                for (let i = 0; i < items.length; i++) {
                    const itemStatus = items[i].querySelector('.item-meta span:nth-child(2)').textContent;
                    if (!itemStatus.includes('Not Available')) { // If the item status is 'Available', hide the item
                        items[i].style.display = 'none';
                    } else { // If the item status is 'Not Available', show the item
                        items[i].style.display = 'block';
                    }
                }

                if (selectedCategory !== 'All-Categories') {
                    const items = borrowableItemsContainer.getElementsByClassName('item-card');
                    // Looping through the borrowable items and checking their category
                    for (let i = 0; i < items.length; i++) {
                        const itemCategory = items[i].querySelector('.item-meta span:nth-child(1)').textContent.toLowerCase();
                        // If the item category does not match the selected category, hide the item
                        if (!itemCategory.includes(selectedCategory.toLowerCase())) {
                            items[i].style.display = 'none';
                        } else { // If the item category matches, show the item
                            items[i].style.display = 'block';
                        }
                    }
                }
            } 
            const visibleItems = false; 
            const items = borrowableItemsContainer.querySelectorAll('.item-card');
            for (let i = 0; i < items.length; i++) {
                if (items[i].style.display === 'block') {
                    visibleItems = true; // Set flag to true if any item is visible
                    break; // Exit loop if at least one item is visible
                }
            }
            if (!visibleItems) {
                borrowableItemsContainer.style.display = 'flex';
                borrowableItemsContainer.style.justifyContent = 'center';
                borrowableItemsContainer.style.marginTop = '-20px';
                borrowableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
            }

        } 
        // If the selected item type is 'Tradable', hide the borrowable items and show the tradable items
        else if (selectedItemType === 'Tradable') {
            borrowableItemsContainer.style.display = 'none';
            borrowHeading.style.display = 'none';
            tradableItemsContainer.style.display = 'grid';
            tradeHeading.style.display = 'block';

           // If the selected status is 'Available', filter the tradable items to show only available ones
           if (selectedStatus === "Available") {
            console.log('Available');
            const items = tradableItemsContainer.getElementsByClassName('item-card');
            // Looping through the tradable items and checking their status
            for (let i = 0; i < items.length; i++) {
                const itemStatus = items[i].querySelector('.item-meta span:nth-child(2)').textContent;
                // If the item status is 'Not Available', hide the item
                if (itemStatus.includes('Not Available')) {
                    items[i].style.display = 'none';
                } else { // If the item status is 'Available', show the item
                    items[i].style.display = 'block';
                }
            }

            if (selectedCategory !== 'All-Categories') {
                const items = tradableItemsContainer.getElementsByClassName('item-card');
                // Looping through the tradable items and checking their category
                for (let i = 0; i < items.length; i++) {
                    const itemCategory = items[i].querySelector('.item-meta span:nth-child(1)').textContent.toLowerCase();
                    // If the item category does not match the selected category, hide the item
                    if (!itemCategory.includes(selectedCategory.toLowerCase())) {
                        items[i].style.display = 'none';
                    } else { // If the item category matches, show the item
                        items[i].style.display = 'block';
                    }
                }
            }
        }
        // If the selected status is 'Not Available', filter the tradable items to show only unavailable ones
        else {
            const items = tradableItemsContainer.getElementsByClassName('item-card');
            for (let i = 0; i < items.length; i++) {
                const itemStatus = items[i].querySelector('.item-meta span:nth-child(2)').textContent;
                if (!itemStatus.includes('Not Available')) { // If the item status is 'Available', hide the item
                    items[i].style.display = 'none';
                } else { // If the item status is 'Not Available', show the item
                    items[i].style.display = 'block';
                }
            }

            if (selectedCategory !== 'All-Categories') {
                const items = tradableItemsContainer.getElementsByClassName('item-card');
                // Looping through the tradable items and checking their category
                for (let i = 0; i < items.length; i++) {
                    const itemCategory = items[i].querySelector('.item-meta span:nth-child(1)').textContent.toLowerCase();
                    // If the item category does not match the selected category, hide the item
                    if (!itemCategory.includes(selectedCategory.toLowerCase())) {
                        items[i].style.display = 'none';
                    } else { // If the item category matches, show the item
                        items[i].style.display = 'block';
                    }
                }
            }
        } 
            const visibleItems = false; 
            const items = tradableItemsContainer.querySelectorAll('.item-card');
            for (let i = 0; i < items.length; i++) {
                if (items[i].style.display === 'block') {
                    visibleItems = true; // Set flag to true if any item is visible
                    break; // Exit loop if at least one item is visible
                }
            }
            if (!visibleItems) {
                tradableItemsContainer.style.display = 'flex';
                tradableItemsContainer.style.justifyContent = 'center';
                tradableItemsContainer.style.marginTop = '-20px';
                tradableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
            }
        }
    })

    const params = new URLSearchParams(window.location.search); // Getting the query parameters from the URL
    const category = params.get('category'); // Getting the category from the query parameters

    if (category !== null && category !== undefined) {
        // If a category is selected, set the category filter to the selected category
        const items = tradableItemsContainer.getElementsByClassName('item-card');
        const items2 = borrowableItemsContainer.getElementsByClassName('item-card');

        let visibleTradableItems = false;
        let visibleBorrowableItems = false;

        // Looping through the borrowable items and checking their category
        for (let i = 0; i < items2.length; i++) {
            const itemCategory = items2[i].querySelector('.item-meta span:nth-child(1)').textContent.toLowerCase();
            // If the item category does not match the selected category, hide the item
            if (!itemCategory.includes(category.toLowerCase())) {
                items2[i].style.display = 'none';
            } else { // If the item category matches, show the item
                items2[i].style.display = 'block';
                visibleBorrowableItems = true; // Set flag to true if any borrowable item is visible
            }
        }
    
        // Looping through the tradable items and checking their category
        for (let i = 0; i < items.length; i++) {
            const itemCategory = items[i].querySelector('.item-meta span:nth-child(1)').textContent.toLowerCase();
            // If the item category does not match the selected category, hide the item
            if (!itemCategory.includes(category.toLowerCase())) {
                items[i].style.display = 'none';
            } else { // If the item category matches, show the item
                items[i].style.display = 'block';
                visibleTradableItems = true; // Set flag to true if any tradable item is visible
            }
        }
        
        // Find matching option (case-insensitive)
        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        const matchingOption = Array.from(categoryFilter.options).find(option => 
            option.value.toLowerCase() === capitalizedCategory.toLowerCase()
        );
        
        if (matchingOption) {
            categoryFilter.value = matchingOption.value;
        } else {
            console.log("No matching option found for:", capitalizedCategory);
        }

        // If no borrowable items are visible, hide the borrowable items container and heading
        if (!visibleBorrowableItems) {
            borrowableItemsContainer.style.display = 'flex';
            borrowableItemsContainer.style.justifyContent = 'center';
            borrowableItemsContainer.style.marginTop = '-20px';
            borrowableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
        } 
        if (!visibleTradableItems) {
            tradableItemsContainer.style.display = 'flex';
            tradableItemsContainer.style.justifyContent = 'center';
            tradableItemsContainer.style.marginTop = '-20px';
            tradableItemsContainer.innerHTML = `<p style="text-align: center; font-style: italic;">No items available</p>`;
        }
    }
})