// Toast notification system with debugging
(function() {
  console.log('🍞 Toast notification system initializing...');
  
  // Create toast container
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  document.body.appendChild(toastContainer);
  console.log('✅ Toast container added to body');
  
  // Add styles for toasts
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    #toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .toast {
      background-color: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      min-width: 250px;
      max-width: 320px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      animation: toast-in-right 0.7s;
      opacity: 1;
      transition: opacity 0.5s;
    }
    
    .toast.success {
      background-color: #4CAF50;
      border-left: 6px solid #2E7D32;
    }
    
    .toast.error {
      background-color: #F44336;
      border-left: 6px solid #B71C1C;
    }
    
    .toast.info {
      background-color: #2196F3;
      border-left: 6px solid #0D47A1;
    }
    
    .toast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .toast-title {
      font-weight: bold;
      font-size: 1.1em;
    }
    
    .toast-close {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1.2em;
      padding: 0;
      line-height: 1;
    }
    
    .toast-body {
      margin-bottom: 8px;
    }
    
    .toast-icon {
      margin-right: 8px;
    }
    
    .toast-details {
      margin-top: 5px;
      padding-top: 5px;
      border-top: 1px solid rgba(255,255,255,0.3);
      font-size: 0.9em;
    }
    
    .toast-detail-item {
      margin-top: 4px;
    }
    
    @keyframes toast-in-right {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    .toast-out {
      opacity: 0;
    }
    
    @media (max-width: 768px) {
      #toast-container {
        bottom: 10px;
        right: 10px;
        left: 10px;
      }
      
      .toast {
        min-width: unset;
        max-width: unset;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
  console.log('✅ Toast styles added to head');
  
  // Global function to show toast notifications
  window.showToast = function(options) {
    console.log('🍞 showToast called with options:', options);
    
    const { title, message, type = 'info', duration = 4000, details = null } = options;
    
    try {
      // Create toast element
      const toast = document.createElement('div');
      toast.classList.add('toast', type);
      
      // Choose icon based on type
      let icon = 'info-circle';
      if (type === 'success') icon = 'check-circle';
      if (type === 'error') icon = 'exclamation-circle';
      
      // Toast header with title and close button
      const header = document.createElement('div');
      header.classList.add('toast-header');
      header.innerHTML = `
        <div class="toast-title">
          <i class="fas fa-${icon} toast-icon"></i>${title}
        </div>
        <button class="toast-close">&times;</button>
      `;
      
      // Toast body with message
      const body = document.createElement('div');
      body.classList.add('toast-body');
      body.textContent = message;
      
      // Add details if provided
      let detailsElement = null;
      if (details) {
        detailsElement = document.createElement('div');
        detailsElement.classList.add('toast-details');
        
        // Convert details object to HTML
        Object.entries(details).forEach(([key, value]) => {
          if (value) {
            const item = document.createElement('div');
            item.classList.add('toast-detail-item');
            item.innerHTML = `<strong>${key}:</strong> ${value}`;
            detailsElement.appendChild(item);
          }
        });
      }
      
      // Assemble toast
      toast.appendChild(header);
      toast.appendChild(body);
      if (detailsElement) toast.appendChild(detailsElement);
      
      // Add toast to container
      toastContainer.appendChild(toast);
      console.log('✅ Toast element created and added to container');
      
      // Make sure the toast is visible by forcing display
      toast.style.display = 'block';
      toastContainer.style.display = 'flex';
      
      // Setup close button
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => {
        console.log('🍞 Toast close button clicked');
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 500);
      });
      
      // Auto remove after duration
      setTimeout(() => {
        console.log('🍞 Toast auto-removal timeout reached');
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 500);
      }, duration);
      
      return toast;
    } catch (error) {
      console.error('❌ Error creating toast:', error);
      return null;
    }
  };
  
  // Verify the function is available globally
  console.log('✅ showToast function defined, type:', typeof window.showToast);
})(); 