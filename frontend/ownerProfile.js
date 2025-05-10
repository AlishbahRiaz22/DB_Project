async function getOwnerProfile(cms_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8808/userfeedback/user/${cms_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include credentials for CORS
        });

        console.log(response.status);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error fetching owner profile:', response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error fetching owner profile:', error);
        return null;
    }
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

async function getOwnerProfileData(cms_id) {
    const ownerProfile = await getOwnerProfile(cms_id);
    if (ownerProfile) {
        document.getElementById('full-name').value = ownerProfile[0].full_name;
        document.getElementById('cms-id').value = ownerProfile[0].cms_id;
        document.getElementById('phone').value = ownerProfile[0].phone;
    }
    else {
        showToast('Error fetching owner profile data', 'error');
        console.error('Error fetching owner profile data');
        setTimeout(() => {
            window.location.href = './browse.html';
        }, 2000);
    }

    getOwnerFeedbackData(cms_id);
}

// Fetching feedback for the owner 
async function getOwnerFeedback(cms_id) {
    try {
        const response = await fetch(`http://127.0.0.1:8808/userfeedback/feedback/${cms_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Include credentials for CORS
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error fetching owner feedback:', response.statusText);
            return null;
        }
    }
    catch (error) {
        console.error('Error fetching owner feedback:', error);
        return null;
    }
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

async function getOwnerFeedbackData(cms_id) {
    const ownerFeedback = await getOwnerFeedback(cms_id);
    if (ownerFeedback && ownerFeedback.length > 0) {
        const feedbackContainer = document.querySelector('.feedback-container');
        feedbackContainer.innerHTML = ''; // Clear existing feedback

        ownerFeedback.forEach(feedback => {
            console.log(feedback);
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback-item';

            feedbackDiv.innerHTML = `
                <div class="feedback-header">
                    <strong>${feedback.username}</strong> (${feedback.reviewer_id})
                </div>
                <div class="feedback-body">
                    <p>${feedback.review}</p>
                    <div class="rating">
                    <span class="rating-stars">
                    <strong>Rating: </strong></span>
                       ${generateStars(feedback.rating)}
                    </div>   
                </div>
            `;

            feedbackContainer.appendChild(feedbackDiv);
        });
    }
    else {
        showToast('Error fetching owner feedback data', 'error');
        console.error('Error fetching owner feedback data');
        /*setTimeout(() => {
            window.location.href = './browse.html';
        }, 2000);*/
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cms_id = urlParams.get('cms_id');
    // Removing the cms_id from the URL
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({ path: newUrl }, '', newUrl);

    getOwnerProfileData(cms_id);
    setupFeedbackModal(cms_id);
});

function setupFeedbackModal(cms_id) {
    const modal = document.getElementById('feedback-modal');
    const addBtn = document.querySelector('.add-feedback-btn');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const stars = document.querySelectorAll('.rating-star');
    const ratingInput = document.getElementById('rating');
    const form = document.getElementById('feedback-form');
    
    // Show modal when add button is clicked
    addBtn.addEventListener('click', () => {
      modal.style.display = 'flex';
    });
    
    // Hide modal when close button is clicked
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Hide modal when cancel button is clicked
    cancelBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    
    // Hide modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Handle star rating selection
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const rating = star.dataset.rating;
        highlightStars(rating);
      });
      
      star.addEventListener('mouseout', () => {
        highlightStars(ratingInput.value);
      });
      
      star.addEventListener('click', () => {
        const rating = star.dataset.rating;
        ratingInput.value = rating;
        highlightStars(rating);
      });
    });
    
    // Highlight stars up to a specific rating
    function highlightStars(rating) {
      stars.forEach(star => {
        star.classList.toggle('selected', star.dataset.rating <= rating);
      });
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const rating = ratingInput.value;
      const review = document.getElementById('review').value;
      
      if (rating === '0') {
        showToast('Please select a rating', 'error');
        return;
      }
      
      try {
        const response = await fetch('http://127.0.0.1:8808/userfeedback/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: cms_id,
            rating: parseInt(rating),
            review: review
          }),
          credentials: 'include'
        });

        if (response.ok) {
          showToast('Feedback submitted successfully!', 'success');
          modal.style.display = 'none';
          
          // Reset form
          form.reset();
          ratingInput.value = '0';
          highlightStars(0);
          
          // Refresh feedback data
          getOwnerFeedbackData(cms_id);
        } else {
          const error = await response.json();
          showToast(error.error || 'Failed to submit feedback', 'error');
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        showToast('Network error, please try again', 'error');
      }
    });
  }