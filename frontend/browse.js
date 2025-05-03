// Add these variables at the top of your script
let currentPage = 1;
const itemsPerPage = 12; // Adjust as needed
let totalPages = 1;

// Add this function to your JavaScript file
function setupPagination(items) {
  // Calculate total pages
  totalPages = Math.ceil(items.length / itemsPerPage);
  
  // Create pagination controls
  const paginationContainer = document.querySelector('.pagination-container');
  if (!paginationContainer) return;
  
  paginationContainer.innerHTML = '';
  
  // Only show pagination if there's more than one page
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
  // Previous button
  const prevButton = document.createElement('button');
  prevButton.className = 'pagination-btn prev';
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      goToPage(currentPage, items);
    }
  });
  
  // Next button
  const nextButton = document.createElement('button');
  nextButton.className = 'pagination-btn next';
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      goToPage(currentPage, items);
    }
  });
  
  // Page numbers
  const pageNumbers = document.createElement('div');
  pageNumbers.className = 'page-numbers';
  
  // Determine range of page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  // Adjust if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  // First page button (always visible)
  if (startPage > 1) {
    const firstPageBtn = document.createElement('button');
    firstPageBtn.className = 'page-number';
    firstPageBtn.textContent = '1';
    firstPageBtn.addEventListener('click', () => {
      currentPage = 1;
      goToPage(currentPage, items);
    });
    pageNumbers.appendChild(firstPageBtn);
    
    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'ellipsis';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }
  }
  
  // Page number buttons
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = 'page-number';
    if (i === currentPage) {
      pageBtn.classList.add('active');
    }
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      goToPage(currentPage, items);
    });
    pageNumbers.appendChild(pageBtn);
  }
  
  // Last page button (always visible)
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'ellipsis';
      ellipsis.textContent = '...';
      pageNumbers.appendChild(ellipsis);
    }
    
    const lastPageBtn = document.createElement('button');
    lastPageBtn.className = 'page-number';
    lastPageBtn.textContent = totalPages;
    lastPageBtn.addEventListener('click', () => {
      currentPage = totalPages;
      goToPage(currentPage, items);
    });
    pageNumbers.appendChild(lastPageBtn);
  }
  
  // Add page info
  const pageInfo = document.createElement('div');
  pageInfo.className = 'page-info';
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  
  // Assemble pagination
  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(pageNumbers);
  paginationContainer.appendChild(nextButton);
}

function goToPage(page, items) {
  currentPage = page;
  
  // Calculate start and end indexes
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);
  
  // Get current page items
  const currentItems = items.slice(startIndex, endIndex);
  
  // Display only items for this page
  const itemGrid = document.querySelector('.items-grid');
  itemGrid.innerHTML = '';
  
  if (currentItems.length === 0) {
    console.log('No items found for this page');
    itemGrid.innerHTML = `
      <div class="no-items-message">
        <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
        <p>No items match your filters</p>
        <button class="clear-btn c1">Clear Filters</button>
      </div>
    `;
    const clearBtn = document.querySelector('.c1');
    clearBtn.addEventListener('click', () => {
        // Reset all filters 
        document.getElementById('status-filter').value = 'Available';
        document.getElementById('category').value = 'All-Categories';
        document.getElementById('item-type-filter').value = '';
        document.getElementById('sort-filter').value = 'a-z';
        console.log(items);
        // Rerun filter with reset values
        window.location.href = 'browse.html'; // Reload the page to clear filters
    });
  } else {
    displayItems(currentItems);
  }
  
  // Update pagination controls
  setupPagination(items);
  
  // Scroll to top of items grid
  itemGrid.scrollIntoView({ behavior: 'smooth' });
}

// Modify the displayItems function to show only current page
function displayItems(itemsToDisplay) {
  const itemGrid = document.querySelector('.items-grid');
  
  itemsToDisplay.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item-card animate-on-scroll';
    
    itemElement.innerHTML = `<div class="item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});">
      <div class="item-labels">
        <div class="item-owner">By ${item.username}</div>
        <div class="item-type">${item.type === 'borrowable' ? 'Borrowable' : 'Tradable'}</div>
      </div>
    </div>
    <div class="item-details">
      <h3>${item.item_name}</h3>
      <div class="item-meta">
        <span>${item.category_name ? item.category_name : 'General'}</span>
        <span>Status: ${item.status ? 'Available' : "Not Available"}</span>
      </div>
      <button class="item-btn" onclick="location.href='item-details.html?item_id=${item.type === 'borrowable' ? item.item_id + 'b' : item.item_id + "t"}'">View Details</button>`;

    itemGrid.appendChild(itemElement);
  });
}

// Modify the filterAndSortItems function to include pagination
function filterAndSortItems(items) {
  // Get filter values
  const statusFilter = document.getElementById('status-filter').value;
  const categoryFilter = document.getElementById('category').value;
  const itemTypeFilter = document.getElementById('item-type-filter').value;
  const sortOrder = document.getElementById('sort-filter').value;
  
  // Start with all items
  let filteredItems = [...items];
  
  // Filter by item type
  if (itemTypeFilter === 'Borrowable') {
    filteredItems = filteredItems.filter(item => item.type === 'borrowable');
  } else if (itemTypeFilter === 'Tradable') {
    filteredItems = filteredItems.filter(item => item.type === 'tradable');
  }
  
  // Filter by status
  if (statusFilter === 'Available') {
    filteredItems = filteredItems.filter(item => item.status);
  } else {
    filteredItems = filteredItems.filter(item => !item.status);
  }
  
  // Filter by category
  if (categoryFilter !== 'All-Categories') {
    filteredItems = filteredItems.filter(item => {
      return item.category_name && 
        item.category_name.toLowerCase().includes(categoryFilter.toLowerCase());
    });
  }
  
  // Sort items
  if (sortOrder === 'a-z') {
    filteredItems.sort((a, b) => a.item_name.localeCompare(b.item_name));
  } else if (sortOrder === 'z-a') {
    filteredItems.sort((a, b) => b.item_name.localeCompare(a.item_name));
  }
  
  // Reset to page 1 whenever filters change
  currentPage = 1;
  
  // Go to first page with filtered items
  goToPage(currentPage, filteredItems);
  
  // Update item count
  const countElement = document.querySelector('.items-count');
  if (countElement) {
    countElement.innerHTML = `<span>${filteredItems.length}</span> items found`;
  }
}

// Add this function to handle search separately from filters
function searchItems(items, searchQuery) {
  if (!searchQuery.trim()) {
    return items; // Return all items if search query is empty
  }
  
  searchQuery = searchQuery.toLowerCase().trim();
  
  // Filter items by search query
  return items.filter(item => {
    return (
      (item.item_name && item.item_name.toLowerCase().includes(searchQuery)) ||
      (item.item_description && item.item_description.toLowerCase().includes(searchQuery)) ||
      (item.username && item.username.toLowerCase().includes(searchQuery)) ||
      (item.category_name && item.category_name.toLowerCase().includes(searchQuery))
    );
  });
}

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
    const itemGrid = document.querySelector('.items-grid'); // Selecting the item grid container

    borrowableItems.forEach(item => {
        item.type = 'borrowable'; // Setting the type of the item to borrowable
    });
    tradableItems.forEach(item => {
        item.type = 'tradable'; // Setting the type of the item to tradable
    });

    const items = [...borrowableItems, ...tradableItems]; // Merging the borrowable and tradable items into a single array

    const itemCount = document.querySelector('.items-count'); // Selecting the item count element
    itemCount.innerHTML = `<span>${items.length}</span> items found`; 

    // Initialize with page 1
    goToPage(1, items);
  
    // Fixed event listeners for filters
    const filterControls = document.querySelectorAll('.filter-select, #sort-filter');
    filterControls.forEach(control => {
      control.addEventListener('change', () => {
        filterAndSortItems(items);
      });
    });
    
    // Fixed clear filters button
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        // Reset all filters (using correct IDs)
        document.getElementById('status-filter').value = 'Available';
        document.getElementById('category').value = 'All-Categories';
        document.getElementById('item-type-filter').value = '';
        document.getElementById('sort-filter').value = 'a-z';

        if (searchInput) {
          searchInput.value = ''; // Clear search input
        }
        // Reset pagination to page 1
        goToPage(1, items);

        // Update item count
        const itemCount = document.querySelector('.items-count');
        if (itemCount) {
          itemCount.innerHTML = `<span>${items.length}</span> items found`;
        }
       
        // Rerun filter with reset values
        filterAndSortItems(items);
      });
    }
  
    
    // Fixed apply button
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        filterAndSortItems(items);
      });
    }
      
    // Handle URL parameters for category filtering
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
      
    if (category) {
       // Set the category filter
        const categoryFilter = document.getElementById('category');
        
        // Find matching option (case-insensitive)
        const matchingOption = Array.from(categoryFilter.options).find(option => 
          option.value.toLowerCase() === category.toLowerCase()
        );
        
        if (matchingOption) {
          categoryFilter.value = matchingOption.value;
          // Apply filters with the selected category
          filterAndSortItems(items);
        }
    }
    
    // Add sorting functionality
    const sortDropdown = document.getElementById('sort-filter');
    if (sortDropdown) {
      sortDropdown.addEventListener('change', function() {
        sortAndDisplayItems(this.value);
      });
    }
    
    // Function to sort and redisplay items
    function sortAndDisplayItems(sortOrder) {
      // Clear the grid first
      const itemGrid = document.querySelector('.items-grid');
      itemGrid.innerHTML = '';
      
      // Create a copy of the items array to sort
      let sortedItems = [...items];
      
      // Sort based on selected order
      if (sortOrder === 'a-z') {
        sortedItems.sort((a, b) => a.item_name.localeCompare(b.item_name));
      } else if (sortOrder === 'z-a') {
        sortedItems.sort((a, b) => b.item_name.localeCompare(a.item_name));
      }
      
      // Display sorted items
      displayItems(sortedItems);
    }

    // Add search functionality
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (searchButton && searchInput) {
    searchButton.addEventListener('click', () => {
      const searchQuery = searchInput.value;
      
      // Get the original items array
      const searchResults = searchItems(items, searchQuery);
      
      // Update items count
      const itemCount = document.querySelector('.items-count');
      if (itemCount) {
        itemCount.innerHTML = `<span>${searchResults.length}</span> items found`;
      }
      
      // Show search results with pagination
      currentPage = 1; // Reset to first page for search results
      goToPage(1, searchResults);

      // Update filter count if it exists
      const countElement = document.querySelector('.filter-count');
      if (countElement) {
        countElement.textContent = `${searchResults.length} items found`;
      }
      
      // Scroll to top of items grid
      const itemGrid = document.querySelector('.items-grid');
      if (itemGrid) {
        itemGrid.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    // Also add enter key functionality for convenience
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        searchButton.click();
      }
    });
  }
  
  // Make sure other clear buttons also reset search
  const clearFiltersBtns = document.querySelectorAll('.c1');
  clearFiltersBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      });
    });
});
    /*
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
            itemElement.className = 'item-card animate-on-scroll'; // Adding animation class for scroll effect
            itemElement.innerHTML = `
              <div class="item-img" style="background-image: url(${item.image_url ? item.image_url : './resources/images/placeholder.jpg'});">
                <div class="item-owner">By ${item.username}</div>
            </div>
            <div class="item-details">
                <h3>${item.item_name}</h3>
                <div class="item-meta">
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
        window.location.href = 'browse.html'; // Reloading the page to clear the filters
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
    }*/
