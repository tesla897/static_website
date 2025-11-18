// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

// Handle contact form submission
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        message: formData.get('message').trim()
    };
    
    // Validate form data
    if (!validateContactForm(data)) {
        return;
    }
    
    try {
        showLoading();
        showToast('Sending your message...', 'info');
        
        const response = await apiCall('/api/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.success) {
            showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            e.target.reset();
            
            // Track successful submission (for analytics)
            trackContactSubmission('success', data);
            
        } else {
            throw new Error(response.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form submission failed:', error);
        showToast('Failed to send message. Please try again later.', 'error');
        
        // Track failed submission
        trackContactSubmission('error', data, error.message);
        
        // Show alternative contact methods
        showAlternativeContactOptions();
        
    } finally {
        hideLoading();
    }
}

// Validate contact form data
function validateContactForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Message validation
    if (!data.message || data.message.length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showToast(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Track contact form submissions for analytics
function trackContactSubmission(status, data, error = null) {
    // This could integrate with Google Analytics, Mixpanel, etc.
    console.log('Contact submission tracked:', {
        status,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...(error && { error })
    });
}

// Show alternative contact options
function showAlternativeContactOptions() {
    const modal = document.createElement('div');
    modal.className = 'alternative-contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Alternative Ways to Contact</h3>
                <button class="modal-close" onclick="closeAlternativeContactModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p>If the form isn't working, you can reach me through these alternative methods:</p>
                
                <div class="contact-options">
                    <div class="contact-option">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h4>Email</h4>
                            <p>contact@mywebsite.com</p>
                            <button class="btn btn-sm btn-outline" onclick="copyToClipboard('contact@mywebsite.com')">Copy Email</button>
                        </div>
                    </div>
                    
                    <div class="contact-option">
                        <i class="fab fa-linkedin"></i>
                        <div>
                            <h4>LinkedIn</h4>
                            <p>Connect with me on LinkedIn</p>
                            <a href="https://linkedin.com" target="_blank" class="btn btn-sm btn-primary">Visit LinkedIn</a>
                        </div>
                    </div>
                    
                    <div class="contact-option">
                        <i class="fab fa-github"></i>
                        <div>
                            <h4>GitHub</h4>
                            <p>Check out my projects on GitHub</p>
                            <a href="https://github.com" target="_blank" class="btn btn-sm btn-primary">Visit GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeAlternativeContactModal()">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = `
        .alternative-contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            padding: 20px;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 10px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6c757d;
            padding: 5px;
        }
        
        .modal-close:hover {
            color: #333;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .contact-options {
            margin-top: 20px;
        }
        
        .contact-option {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        
        .contact-option i {
            color: #3498db;
            font-size: 1.5rem;
            margin-top: 5px;
        }
        
        .contact-option h4 {
            margin: 0 0 5px 0;
            color: #2c3e50;
        }
        
        .contact-option p {
            margin: 0 0 10px 0;
            color: #6c757d;
        }
        
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
            background-color: #f8f9fa;
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#alternative-contact-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'alternative-contact-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }
}

// Close alternative contact modal
function closeAlternativeContactModal() {
    const modal = document.querySelector('.alternative-contact-modal');
    if (modal) {
        modal.remove();
    }
}

// Newsletter signup functionality
function initNewsletterSignup() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
}

async function handleNewsletterSignup(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email').trim();
    
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }
    
    try {
        showLoading();
        showToast('Subscribing to newsletter...', 'info');
        
        const response = await apiCall('/api/newsletter', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        if (response.success) {
            showToast('Successfully subscribed to newsletter!', 'success');
            e.target.reset();
        } else {
            throw new Error(response.message || 'Failed to subscribe');
        }
        
    } catch (error) {
        console.error('Newsletter signup failed:', error);
        showToast('Failed to subscribe. Please try again later.', 'error');
    } finally {
        hideLoading();
    }
}

// Contact form enhancements
function addContactFormEnhancements() {
    // Character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        messageField.setAttribute('maxlength', maxLength);
        
        // Create character counter
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = 'text-align: right; font-size: 0.8rem; color: #6c757d; margin-top: 5px;';
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.style.color = remaining < 50 ? '#e74c3c' : '#6c757d';
        }
        
        messageField.addEventListener('input', function() {
            updateCounter();
            // Auto-resize textarea
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        updateCounter(); // Initial count
    }
}

// Initialize contact form enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    addContactFormEnhancements();
});

// Export functions for global use
window.handleContactFormSubmit = handleContactFormSubmit;
window.closeAlternativeContactModal = closeAlternativeContactModal;
window.copyToClipboard = copyToClipboard;