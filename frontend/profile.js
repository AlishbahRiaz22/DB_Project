
document.addEventListener('DOMContentLoaded', async () => {
    // Profile editing functionality
    const editButton = document.getElementById('edit-profile-btn');
    const updateButton = document.getElementById('update-info-btn');
    const cancelButton = document.getElementById('cancel-btn');
    const profileFields = document.querySelectorAll('.profile-info input');

    // Tab switching functionality
    const tabs = document.querySelectorAll('.section-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
        
            // Add active class to clicked tab
            tab.classList.add('active');
        
            // Hide all tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
        
            // Show the selected tab content
            const tabContentId = tab.getAttribute('data-tab');
            document.getElementById(tabContentId).classList.add('active');
        });
    });

    // Profile editing functionality
    editButton.addEventListener('click', () => {
        // Enable all fields except CMS ID
        profileFields.forEach(input => {
            if (input.id !== 'cms-id') {
                input.disabled = false;
            }

            if (input.id === 'password') {
                input.value = ''; // Clear password field for editing
            }
        });
      
        // Show update and cancel buttons, hide edit button
        updateButton.style.display = 'inline-block';
        cancelButton.style.display = 'inline-block';
        editButton.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        // Disable all fields and reset to original values
        profileFields.forEach(input => {
            input.disabled = true;
            input.value = input.getAttribute('data-original-value');
        });
      
        // Hide update and cancel buttons, show edit button
        updateButton.style.display = 'none';
        cancelButton.style.display = 'none';
        editButton.style.display = 'inline-block';
    });


    // Add input event listeners for real-time validation
    document.getElementById('full-name').addEventListener('input', function() {
        const result = validateName(this.value);
        if (!result.valid) {
            showValidationError(this, result.message);
        } else {
            clearValidationError(this);
        }
    });

    document.getElementById('email').addEventListener('input', function() {
        const result = validateEmail(this.value);
        if (!result.valid) {
            showValidationError(this, result.message);
        } else {
            clearValidationError(this);
        }
    });

    document.getElementById('phone').addEventListener('input', function() {
        const result = validatePhone(this.value);
        if (!result.valid) {
            showValidationError(this, result.message);
        } else {
            clearValidationError(this);
        }
    });

    document.getElementById('password').addEventListener('input', function() {
        const result = validatePassword(this.value);
        if (!result.valid) {
            showValidationError(this, result.message);
        } else {
            clearValidationError(this);
        }
    });

    // Update the update button click handler to include validation
    updateButton.addEventListener('click', async () => {
        try {
            // Get input values
            const fullName = document.getElementById('full-name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const cmsId = document.getElementById('cms-id').value;
      
            // Validate all fields
            const nameValidation = validateName(fullName);
            const emailValidation = validateEmail(email);
            const phoneValidation = validatePhone(phone);
            const passwordValidation = validatePassword(password);
      
            // Clear previous errors
            clearValidationError(document.getElementById('full-name'));
            clearValidationError(document.getElementById('email'));
            clearValidationError(document.getElementById('phone'));
            clearValidationError(document.getElementById('password'));
      
            // Check if there are any validation errors
            let hasErrors = false;
      
            if (!nameValidation.valid) {
                showValidationError(document.getElementById('full-name'), nameValidation.message);
                hasErrors = true;
            }
      
            if (!emailValidation.valid) {
                showValidationError(document.getElementById('email'), emailValidation.message);
                hasErrors = true;
            }
      
            if (!phoneValidation.valid) {
                showValidationError(document.getElementById('phone'), phoneValidation.message);
                hasErrors = true;
            }
      
            if (!passwordValidation.valid) {
                showValidationError(document.getElementById('password'), passwordValidation.message);
                hasErrors = true;
            }
      
            // If there are validation errors, stop form submission
            if (hasErrors) {
                return;
            }
      
            // Prepare updated user data
            const userData = {
                name: fullName,
                email: email,
                phone: phone === 'Not provided' ? '' : phone,
                cms_id: cmsId,
                password: password
            };
      
            // Send update request
            const response = await fetch('http://127.0.0.1:8808/signup/update/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
      
            if (response.status === 200) {
                // Update was successful
                showToast('Profile updated successfully!', 'success');
                
                // Update data-original-value attributes
                Object.keys(userData).forEach(key => {
                    const input = document.getElementById(key === 'name' ? 'full-name' : key);
                    if (input && key !== 'password') {
                        input.setAttribute('data-original-value', userData[key]);
                    }
                });
        
                // If password was changed, update the password field
                if (userData.password) {
                    document.getElementById('password').value = '********';
                    document.getElementById('password').setAttribute('data-original-value', '********');
                }
        
                // Disable fields
                profileFields.forEach(input => {
                    input.disabled = true;
                });
                
                // Hide update and cancel buttons, show edit button
                updateButton.style.display = 'none';
                cancelButton.style.display = 'none';
                editButton.style.display = 'inline-block';
            } else {
                const errorData = await response.json();
                showToast(`Error updating profile: ${errorData.error || 'Unknown error'}`, 'error');
            }    
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Error updating profile. Please try again later.', 'error');
        }
    });
    
    // Initialize the page
    loadUserData();
    loadNotificationCount();
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
// Functions

// Load user data
async function loadUserData() {
    const userData = await checkUserLoggedIn();
    
    // console.log(userData);
    if (userData) {
        // Populate user info
        document.getElementById('cms-id').value = userData.cms_id;
        document.getElementById('cms-id').setAttribute('data-original-value', userData.cms_id);
      
        document.getElementById('full-name').value = userData.full_name;
        document.getElementById('full-name').setAttribute('data-original-value', userData.full_name);
      
        document.getElementById('email').value = userData.email;
        document.getElementById('email').setAttribute('data-original-value', userData.email);
        
        document.getElementById('phone').value = userData.phone || 'Not provided';
        document.getElementById('phone').setAttribute('data-original-value', userData.phone || 'Not provided');
      
      
        // Load user listings
        loadUserListings();
        
        // Load incoming Borrow requests
        loadIncomingBorrowRequests();
  
        // Load incoming Trade requests
        loadIncomingTradeRequests();
        
        // Load outgoing requests
        loadOutgoingRequests();
        
        // Update navigation menu based on login status
        updateNavigation(true);
    }
}

// Add a function to load notification count
async function loadNotificationCount() {
    try {
        const response = await fetch('http://127.0.0.1:8808/notifications/count', {
            method: 'GET',
            credentials: 'include'
        });
      
        if (response.status === 200) {
            const data = await response.json();
            const countElement = document.getElementById('notification-count');
            countElement.textContent = data.count;
        
            // Hide badge if no notifications
            if (data.count === 0) {
                countElement.style.display = 'none';
            } else {
                countElement.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error loading notification count:', error);
    }
}

// Check login status
async function checkUserLoggedIn() {
    try {
        const response = await fetch(`http://127.0.0.1:8808/user/`, {
            method: 'GET',
            credentials: 'include'
        });
      
        if (response.status === 200) {
            return await response.json();
        } else {
            // Redirect to login if not logged in
            window.location.href = 'login.html';
            return null;
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        return null;
    }
}

// Function to delete an item
async function deleteItem(itemId, itemType) {
    try {
        const response = await fetch(`http://127.0.0.1:8808/user/listings/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                itemId: itemId,
                itemType: itemType
            })
        });
      
        if (response.status === 200) {
            showToast('Item deleted successfully', 'success');
            // Reload the listings to update the view
            loadUserListings();
        } else {
            const errorData = await response.json();
            showToast(`Error deleting item: ${errorData.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        showToast('Error deleting item. Please try again later.', 'error');
    }
}

// Load user listings
async function loadUserListings() {
    try {
        const response = await fetch('http://127.0.0.1:8808/user/listings/', {
            method: 'GET',
            credentials: 'include'
        });
      
        const container = document.querySelector('.listings-grid');
        const hide = document.querySelector('.listing');

      
        if (response.status === 200) {
            const data = await response.json();
        
            if (data.length === 0) {
                container.style.display = 'none';
                hide.style.display = 'none';
                setTimeout(() => {
                    showToast('No listings found', 'info');
                }
                , 0);
                return;
            }
        
            container.innerHTML = '';
        
            data.forEach(item => {
                const statusClass = item.status ? 'status-available' : 'status-traded';
                const statusText = item.status ? 'Available' : 'Traded/Borrowed';
                console.log(item);
          
                container.innerHTML += `
                    <div class="listing-item" style="width: 100%; height: 500px;">
                        <div class="item-main-img zoom-img" style="background-image: url(${data.image_url ? data.image_url : './resources/images/placeholder.jpg'}); height: 50%;"></div>
                        <div class="listing-content">
                        <h4>${item.item_name}</h4>
                        <p>${item.item_description}</p>
                        <div class="listing-details">
                            <span class="listing-status status-available">${statusText}</span>
                            <button class="delete-btn" data-item-id="${item.item_id}" data-item-type="${item.type}" data-item-status="${statusText}">Delete</button>
                        </div>
                    </div>
                `;  
           });  
        
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {

                    if (e.target.getAttribute('data-item-status') === 'Traded/Borrowed') {
                        showToast('This item cannot be deleted as it is currently traded or borrowed.');  
                        return;
                    }

                    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
                        const itemId = e.target.getAttribute('data-item-id');
                        const itemType = e.target.getAttribute('data-item-type');
                        await deleteItem(itemId, itemType);
                    }
                });
           });
        } else {
            container.style.display = 'none';
            hide.style.display = 'none';
            setTimeout(() => {
                showToast('No Listings found', 'info');
            }, 0);
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        document.getElementById('listings-container').style.display = 'none';
        document.querySelector('.listing').style.display = 'none';
        setTimeout(() => {
            showToast('Error loading listings. Please try again later.', 'error');
        }, 0);
    }
}

// Function to handle request actions (accept/decline)
async function handleTradeRequestAction(requestId, action, itemName, requesterId, offeredItem = null, requestedId = null, offeredId = null) {
    const payload = {
        requestId: requestId,
        action: action,
        itemName: itemName,
        offeredItem: offeredItem,
        requesterId: requesterId,
        requestedId: requestedId,
        offeredId: offeredId
    };

    const response = await fetch('http://127.0.0.1:8808/requests/trade/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    });
    
    if (response.status === 200) {
        showToast(`Request ${action}ed successfully!`, 'success');
        loadIncomingTradeRequests();
    } else {
        const errorData = await response.json();
        showToast(`Error ${action}ing request: ${errorData.error || 'Unknown error'}`, 'error');
    }
}

// Load incoming trade requests
async function loadIncomingTradeRequests() {
    try {
        const response = await fetch('http://127.0.0.1:8808/user/incoming-requests/trade/', {
            method: 'GET',
            credentials: 'include'
        });

        const container = document.getElementById('incoming-trade-requests-container');
        const hide = document.querySelector('.trade');

        if (response.status === 200) {
            const data = await response.json();
  
            if (data.length === 0) {
                container.style.display = 'none';
                hide.style.display = 'none';
                setTimeout(() => {
                    showToast('No incoming trade requests found', 'info');
                }, 2000);
                return;
            }

            container.innerHTML = '';

            data.forEach(request => {
                container.innerHTML += `
                  <div class="request-card" data-request-id="${request.request_id}">
                    <div class="request-header">
                      <div class="request-title">Trade Request</div>
                      <div class="item-status">Pending</div>
                    </div>
                    <div class="request-details">
                      <div class="request-item-image">
                        <img src="${request.image_url || './resources/images/placeholder.jpg'}" alt="${request.item_name}">
                      </div>
                      <div class="request-info">
                        <p><strong>Item:</strong> ${request.item_name}</p>
                        <p><strong>Offered Item:</strong> ${request.offered_item}</p>
                        <p><strong>From:</strong> ${request.full_name}</p>
                        <p><strong>Requested on:</strong> ${new Date(request.creation_date).toLocaleDateString()}</p>
                        <p><strong>Reason: </strong> ${request.reason || 'Not provided'}</p>
                      </div>
                    </div>
                    <div class="request-actions">
                      <button class="accept-btn" data-request-id="${request.id}" data-offered-item="${request.offered_item}" data-requested-id="${request.requested_id}" data-offered-id="${request.offered_id}" data-item-name="${request.item_name}" data-requester-id="${request.requester_id}">Accept</button>
                      <button class="decline-btn" data-requester-id="${request.requester_id}" data-request-id="${request.id}" data-item-name="${request.item_name}">Decline</button>
                    </div>
                  </div>
                `;
            });
    
            // console.log(data);
            // Add event listeners for accept/decline buttons
            document.querySelectorAll('.accept-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const requestId = e.target.getAttribute('data-request-id');
                    const requesterId = e.target.getAttribute('data-requester-id');
                    
                    await handleTradeRequestAction(requestId, 'accept', e.target.getAttribute('data-item-name'), requesterId, e.target.getAttribute('data-offered-item'), e.target.getAttribute('data-requested-id'), e.target.getAttribute('data-offered-id'));
                    });
            });  

            document.querySelectorAll('.decline-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const requestId = e.target.getAttribute('data-request-id');
    
                    await handleTradeRequestAction(requestId, 'decline', e.target.getAttribute('data-item-name'), e.target.getAttribute('data-requester-id'));
                }) ;
            });
        } else {
            container.style.display = 'none';
            hide.style.display = 'none';
            setTimeout(() => {
                showToast('No Incoming Trade Request found', 'info');
            }, 2000);
        }
    }
    catch (error) {
        console.error('Error loading incoming trade requests:', error);
        document.getElementById('incoming-trade-requests-container').style.display = 'none';
        document.querySelector('.trade').style.display = 'none';
        setTimeout(() => {
            showToast('Error loading incoming trade requests. Please try again later.', 'error');
        }, 2000);
    }
}

async function handleOutgoingRequest(requestId, isBorrowRequest) {
    try {
        let type;
        if (isBorrowRequest === true) {
            type = 'borrow';
        } else {
            type = 'trade';
        }

          // console.log(type);
          // console.log(requestId);
          // console.log(isBorrowRequest);
          // Send a DELETE request to cancel the outgoing request
        const response = await fetch(`http://127.0.0.1:8808/user/outgoing-requests/${type}/cancel/${requestId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
            // console.log(response.status);
        if (response.status === 200) {
            showToast('Request canceled successfully', 'success');
            loadOutgoingRequests();
        } else {
            const errorData = await response.json();
            showToast(`Error canceling request: ${errorData.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Error canceling request:', error);
        showToast('Error canceling request. Please try again later.', 'error');
    }
        
};

 // Load outgoing requests
 async function loadOutgoingRequests() {
    try {
        const response = await fetch('http://127.0.0.1:8808/user/outgoing-requests/', {
            method: 'GET',
            credentials: 'include'
        });
        // console.log(response.status);
        const container = document.getElementById('outgoing-requests-container');
        const hide = document.querySelector('.request');
      
        if (response.status === 200) {
            const data = await response.json();
        
            // console.log(data);
            if (data.length === 0) {
                container.style.display = 'none';
                hide.style.display = 'none';
                setTimeout(() => {
                    showToast('No outgoing requests found', 'info');
                }, 3000);
                return;
            }
        
            container.innerHTML = '';
        
            data.forEach(request => {
              container.innerHTML += `
                <div class="request-card">
                  <div class="request-header">
                    <div class="request-title">${(request.borrow_dur !== null && request.borrow_dur !== undefined) ? 'Borrow Request' : 'Trade Request'}</div>
                    <div class="item-status pending">Pending</div>
                  </div>
                  <div class="request-details">
                    <div class="request-item-image">
                      <img src="${request.image_url || './resources/images/placeholder.jpg'}" alt="${request.item_name}">
                    </div>
                    <div class="request-info">
                      <p><strong>Item:</strong> ${request.item_name}</p>
                      <p><strong>Owner:</strong> ${request.username}</p>
                      <p><strong>Requested on:</strong> ${new Date(request.creation_date).toLocaleDateString()}</p>
                      ${(request.borrow_dur !== null && request.borrow_dur !== undefined) ? `<p><strong>Duration:</strong> ${request.borrow_dur} days</p>` : ''}
                      <p><strong>Reason:</strong> ${request.reason}</p>
                    </div>
                  </div>
                    <div class="request-actions">
                      <button class="cancel-btn" data-request-id="${request.id}" data-borrow="${(request.borrow_dur !== null && request.borrow_dur !== undefined)}">Cancel Request</button>
                    </div>
                </div>`
            });
        
            // Add event listeners for cancel buttons
            document.querySelectorAll('.cancel-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const requestId = e.target.getAttribute('data-request-id');
                    const borrow = e.target.getAttribute('data-borrow');
                    await handleOutgoingRequest(requestId, borrow);
                });
            });
        } else {
            container.style.display = 'none';
            hide.style.display = 'none';
            setTimeout(() => { 
                showToast('No outgoing Requests found.', 'info');
            }, 3000);
        }
    } catch (error) {
        console.error('Error loading outgoing requests:', error);
        document.getElementById('outgoing-requests-container').style.display = 'none';
        document.querySelector('.request').style.display = 'none';
        setTimeout(() => {
            showToast('Error loading outgoing requests. Please try again later.', 'error');
        }, 3000);
    }
}

// Handle request actions (accept, decline, cancel)
async function handleRequestAction(requestId, action, item_name, requester_id, duration = null) {
    try {
        const requestData = {
            requestId: requestId,
            item_name: item_name,
            requester_id: requester_id,
            selectedDuration: duration
        };
      
        // Add duration if provided
        if (action === 'accept' && duration) {
            requestData.duration_days = duration;
        }
      
        const response = await fetch(`http://127.0.0.1:8808/requests/${action}/${requestId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestData)
        });
      
        if (response.status === 200) {
            showToast(`Request ${action}ed successfully!`, 'success');
            // Reload the appropriate request lists
            loadIncomingBorrowRequests();
            loadOutgoingRequests();
            // Also reload listings as their status may have changed
            loadUserListings();
        } else {
            const errorData = await response.json();
            showToast(`Error ${action}ing request: ${errorData.error || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error(`Error ${action}ing request:`, error);
        showToast(`Error ${action}ing request. Please try again later.`, 'error');
    }
}

// Load incoming borrow requests
async function loadIncomingBorrowRequests() {
    try {
        const response = await fetch('http://127.0.0.1:8808/user/incoming-requests/borrow/', {
            method: 'GET',
            credentials: 'include'
        });
      
        const container = document.getElementById('incoming-requests-container');
        const hide = document.querySelector('.borrow');
        
        //  console.log(response);
        if (response.status === 200) {
            const data = await response.json();
          
            if (data.length === 0) {
                container.style.display = 'none';
                hide.style.display = 'none';
                setTimeout(() => {
                    showToast('No incoming borrow requests found', 'info');
                }, 1000);
                return;
            }
        
            container.innerHTML = '';
        
        
            data.forEach(request => {
                container.innerHTML += `
                  <div class="request-card" data-request-id="${request.request_id}">
                    <div class="request-header">
                      <div class="request-title">Borrow Request</div>
                      <div class="item-status">Pending</div>
                    </div>
                    <div class="request-details">
                      <div class="request-item-image">
                        <img src="${request.image_url || './resources/images/placeholder.jpg'}" alt="${request.item_name}">
                      </div>
                      <div class="request-info">
                        <p><strong>Item:</strong> ${request.item_name}</p>
                        <p><strong>From:</strong> ${request.full_name}</p>
                        <p><strong>Requested on:</strong> ${new Date(request.creation_date).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> ${request.borrow_dur} days</p>
                      </div>
                    </div>
                    <div class="request-actions">
                      <button class="accept-btn" data-request-id="${request.request_id}" 
                      data-item-name="${request.item_name}" data-borrow-duration=${request.borrow_dur} data-requester-id="${request.requester_id}">Accept</button>
                      <button class="decline-btn" data-requester-id="${request.requester_id}" data-request-id="${request.request_id}" data-item-name="${request.item_name}">Decline</button>
                    </div>
                  </div>
                `;
            });
      

        
            // Add event listeners for accept/decline buttons
            document.querySelectorAll('.accept-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const requestId = e.target.getAttribute('data-request-id');
                    const select = document.querySelector(`.duration-select[data-request-id="${requestId}"]`);
                    const selectedDuration = e.target.getAttribute('data-borrow-duration');
                    const requesterId = e.target.getAttribute('data-requester-id');
                
                    await handleRequestAction(requestId, 'accept', e.target.getAttribute('data-item-name'), requesterId, selectedDuration);
                });
            });
        
            document.querySelectorAll('.decline-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const requestId = e.target.getAttribute('data-request-id');

                await handleRequestAction(requestId, 'decline', e.target.getAttribute('data-item-name'), e.target.getAttribute('data-requester-id'));
                });
            });
        } else {
            container.style.display = 'none';
            hide.style.display = 'none';
            setTimeout(() => {
                showToast('No incoming Borrow Requests', 'info');
            }, 1000);
        }
    } catch (error) {
        console.error('Error loading incoming requests:', error);
        document.getElementById('incoming-requests-container').style.display = 'none';
        document.querySelector('.borrow').style.display = 'none';
        setTimeout(() => {
            showToast('Error loading incoming borrow requests. Please try again later.', 'error');
        }, 1000);
    }
}

// ===== Validation Functions =====
function validateName(name) {
    if (name.trim() === '') {
        return { valid: false, message: 'Name cannot be empty' };
    }
    if (name.length < 3) {
        return { valid: false, message: 'Name must be at least 3 characters long' };
    }
    if (!/^[A-Za-z\s.'-]+$/.test(name)) {
        return { valid: false, message: 'Name can only contain letters, spaces, and characters (\'.-, \')' };
    }
    return { valid: true };
}
  
function validateEmail(email) {
    if (email.trim() === '') {
        return { valid: false, message: 'Email cannot be empty' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    return { valid: true };
}
  
function validatePhone(phone) {
    if (phone.trim() === '' || phone === 'Not provided') {
        return { valid: true }; // Phone is optional
    }
    // Allow various phone formats with country codes, dashes, etc.
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phone)) {
        return { valid: false, message: 'Please enter a valid phone number' };
    }
    return { valid: true };
}

function validatePassword(password) {
    if (password === '********') {
        return { valid: true }; // Password unchanged
    }
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one special character' };
    }
        return { valid: true };
}

// Update the navigation function with corrected bell icon placement
function updateNavigation(isLoggedIn) {
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn) {
        // Add bell icon for notifications FIRST - before modifying login button
        // Check if notification bell already exists
        if (!document.querySelector('.notification-bell')) {
            const bellIcon = document.createElement('div');
            bellIcon.className = 'notification-bell';
            bellIcon.innerHTML = '<i class="fas fa-bell"></i><span class="notification-badge" id="notification-count">0</span>';
            bellIcon.onclick = function() {
                window.location.href = "notification.html";
            };
        
            // Insert bell icon BEFORE the login button (left side)
            authButtons.insertBefore(bellIcon, loginBtn);
        }
      
        // Now modify login button to profile icon
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
        loginBtn.onclick = function() {
            window.location.href = "profile.html";
        };
          
        // Change signup button to logout
        signupBtn.textContent = "Logout";
        signupBtn.onclick = async function() {
            const response = await fetch('http://127.0.1:8808/logout/', {
                method: 'POST',
                credentials: 'include'
            });
            if (response.status === 200) {
                showToast('Logout successful!');
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000); // Redirect after 2 seconds
            } else {
                showToast('Logout failed. Please try again.');
            }
        };
          
        // Temporarily set a notification count for testing
        const countElement = document.getElementById('notification-count');
        if (countElement) {
            countElement.textContent = '3';
            countElement.style.display = 'flex';
        }
    }
}

// Function to show validation errors
function showValidationError(inputElement, message) {
    // Remove any existing error messages
    const existingError = inputElement.parentElement.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '-10px';
    errorElement.style.marginBottom = '10px';
    
    // Add error styling to input
    inputElement.style.borderColor = 'red';
    
    // Insert error message after input
    inputElement.parentElement.insertBefore(errorElement, inputElement.nextSibling);
}

// Function to clear validation errors
function clearValidationError(inputElement) {
    const existingError = inputElement.parentElement.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    inputElement.style.borderColor = '';
}