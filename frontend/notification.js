document.addEventListener('DOMContentLoaded', async () => {
    // Category link functionality from profile page
    const links = document.querySelectorAll('.cat-links');
    links.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const value = this.textContent.trim();
        const url = `browse.html?category=${value}`;
        window.location.href = url;
      });
    });

    // Get notification filter options
    const filterOptions = document.querySelectorAll('.filter-option');
    const currentFilter = 'all';

    // Function to update nav menu
    async function updateNavigation() {
      try {
        const response = await fetch('http://127.0.0.1:8808/user/', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.status === 200) {
          const loginBtn = document.querySelector('.login-btn');
          const signupBtn = document.querySelector('.signup-btn');
          
          // Change login button to user profile icon
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
            try {
              const response = await fetch('http://127.0.0.1:8808/logout', {
                method: "POST",
                credentials: 'include'
              });
              
              if(response.status === 200) {
                window.localStorage.setItem('loggedIn', 'false');
                window.location.href = "index.html";
              } else {
                alert("Error logging out. Please try again.");
              }
            } catch (error) {
              console.error('Logout error:', error);
              alert("Error logging out. Please try again.");
            }
          };
        } else {
          // User is not logged in, redirect to login
          window.location.href = "login.html";
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        alert("Error checking authentication. Please try again.");
      }
    }

    // Function to load notifications
    async function loadNotifications() {
      try {
        const response = await fetch('http://127.0.0.1:8808/notifications', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.status === 200) {
          const data = await response.json();
          const container = document.getElementById('notifications-container');
          const emptyState = document.getElementById('empty-state');
          
          // console.log(data); // Debugging line to check the data structure
          // Update notification count
          document.getElementById('notification-count').textContent = data.length;
          
          // Hide all cards first (for filtering)
          container.querySelectorAll('.notification-card').forEach(card => {
            card.style.display = 'none';
          });
          
          // If there are no notifications, show empty state
          if (data.length === 0) {
            emptyState.style.display = 'block';
            return;
          } else {
            emptyState.style.display = 'none';
          }
          
          // Clear container if loading full set
          if (currentFilter === 'all') {
            container.innerHTML = '';
          }
          
          // Create notification cards
          data.forEach((notification, index) => {
            
            // Create notification card
            const card = document.createElement('div');
            card.className = `notification-card`;
            card.setAttribute('data-id', notification.notification_id);
            
            // Set icons based on notification type
          let iconClass = 'fas fa-bell';
            
            // Format time
            const notificationTime = new Date(notification.creation_date);
            const now = new Date();
            const diffTime = Math.abs(now - notificationTime);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeString = '';
            if (diffDays > 0) {
              timeString = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
            } else if (diffHours > 0) {
              timeString = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            } else if (diffMinutes > 0) {
              timeString = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
            } else {
              timeString = 'Just now';
            }
            
            // Create notification card HTML
            card.innerHTML = `
              <div class="notification-icon">
                <i class="${iconClass}"></i>
              </div>
              <div class="notification-content">
                <div class="notification-title">${index + 1}</div>
                <div class="notification-message">${notification.notification}</div>
                <div class="notification-time">${timeString}</div>
              </div>
              <div class="notification-close" data-id="${notification.notification_id}">
                <i class="fas fa-times"></i>
              </div>
            `;
            
            container.appendChild(card);
            
            // Add event listener to close button
            card.querySelector('.notification-close').addEventListener('click', function(e) {
              e.stopPropagation();
              const notificationId = this.getAttribute('data-id');
              markAsRead(notificationId);
            });
            
          });
        } else {
          console.error('Failed to load notifications', response.status);
          document.getElementById('empty-state').style.display = 'block';
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        document.getElementById('empty-state').style.display = 'block';
      }
    }
    
    // Function to mark notification as read
    async function markAsRead(notificationId, callback) {
      try {
        const response = await fetch(`http://127.0.0.1:8808/notifications/${notificationId}`, {
          method: 'PUT',
          credentials: 'include'
        });
        
        if (response.status === 200) {
          // Remove the notification card with animation
          const card = document.querySelector(`.notification-card[data-id="${notificationId}"]`);
          card.style.opacity = '0';
          card.style.transform = 'translateX(100px)';
          
          setTimeout(() => {
            card.remove();
            
            // Update notification count
            const countElement = document.getElementById('notification-count');
            const currentCount = parseInt(countElement.textContent);
            countElement.textContent = currentCount - 1;
            
            // Show empty state if no notifications left
            if (currentCount - 1 === 0) {
              document.getElementById('empty-state').style.display = 'block';
            }
            
            // Execute callback if provided
            if (callback) callback();
          }, 300);
        } else {
          console.error('Failed to mark notification as read');
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Function to mark all notifications as read
    async function markAllAsRead() {
      try {
        const response = await fetch('http://127.0.0.1:8808/notifications/mark-all-read', {
          method: 'POST',
          credentials: 'include'
        });
        
        if (response.status === 200) {
          // Remove all notification cards with animation
          const cards = document.querySelectorAll('.notification-card');
          cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(100px)';
          });
          
          setTimeout(() => {
            document.getElementById('notifications-container').innerHTML = '';
            document.getElementById('notification-count').textContent = '0';
            document.getElementById('empty-state').style.display = 'block';
          }, 300);
        } else {
          console.error('Failed to mark all notifications as read');
        }
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }

    // Add event listener to "Mark All as Read" button
    document.getElementById('mark-all-read-btn').addEventListener('click', markAllAsRead);
    
    // Initial load
    updateNavigation();
    loadNotifications();
    
    
  });