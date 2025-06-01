document.addEventListener('DOMContentLoaded', async () => {

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
      checkLoginStatus();      

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

      async function loadNotifications() {
        try {
            const response = await fetch('http://127.0.0.1:8808/notifications', {
            method: 'GET',
            credentials: 'include'
          });

          if (response.status === 200) {
            const data = await response.json();
            return data;
          }
          return null;
        } catch (error) {
            console.error('Error loading notifications:', error);
            return null;
        }
      }

      // Function to load notifications
      async function displayNotifications(data) {  
            const container = document.getElementById("notifications-container");
            
            // Create notification cards
            data.forEach((notification, index) => {
              // Create notification card
              const card = document.createElement('div');
              card.className = `notification-card`;
              card.setAttribute('data-id', notification.notification_id);
              card.setAttribute('data-read', notification.is_read ? 'true' : 'false');

              if (!notification.is_read) {
                card.classList.add('unread');
              }
              
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
                ${notification.is_read ? `` :  `<div class="notification-close" data-id="${notification.notification_id}">
                  <i class="fas fa-times"></i>
                </div>`
                }
              `;
              
              container.appendChild(card);
                if (!notification.is_read) {
                // Add event listener to close button
                card.querySelector('.notification-close').addEventListener('click', function(e) {
                  e.stopPropagation();
                  const notificationId = this.getAttribute('data-id');
                  markAsRead(notificationId);
                });
              }
              
            });
        
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
            
            card.setAttribute('data-read', 'true');
            card.classList.remove('unread');
              
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

            cards.setAttribute('data-read', 'true');
            cards.classList.remove('unread');
            
          } else {
            console.error('Failed to mark all notifications as read');
          }
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
        }
      }

      // Add event listener to "Mark All as Read" button
      document.getElementById('mark-all-read-btn').addEventListener('click', markAllAsRead);
      
      const data = await loadNotifications();
      let cards = null;

      if (data === null || data.length === 0) {
        document.getElementById('empty-state').style.display = 'block';
      } 
      else {
        displayNotifications(data);
        cards = document.querySelectorAll('.notification-card');
      }

      console.log(data);

      // Filter functionality
      const filterOptions = document.querySelectorAll('.filter-option');
      filterOptions.forEach(option => {
        option.addEventListener('click', function() {
          // Remove active class from all options
          filterOptions.forEach(opt => opt.classList.remove('active'));
          // Add active class to clicked option
          this.classList.add('active');
          document.getElementById('empty-state').style.display = 'none';
          let count = 0;
          
          // Here you would filter notifications by type
                    // Here you would filter notifications by type
          if (this.textContent === 'Unread' && cards !== null) {
            // Show only unread notifications
            document.querySelectorAll('.notification-card').forEach(card => {
              if (card.getAttribute('data-read') === 'true') {
                card.style.display = 'none';
              } else {
                card.style.display = 'flex';
                count++;
              }
            });
          } else if (this.textContent === 'Read' && cards !== null) {
            // Show only read notifications
            document.querySelectorAll('.notification-card').forEach(card => {
              if (card.getAttribute('data-read') === 'true') {
                card.style.display = 'flex';
                count++;
              } else {
                card.style.display = 'none';
              }
            });
          } else {
            // Show all notifications
            document.querySelectorAll('.notification-card').forEach(card => {
              card.style.display = 'flex';
              count++;
            });
          }

          if (count === 0) {
                document.getElementById('empty-state').style.display = 'block';
            }
        });
      });
      
      
});