// Using modern MutationObserver instead of deprecated DOM mutation events
const observeDocument = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // Handle DOM changes here
        handleDOMChanges(mutation.target);
      }
    });
  });

  // Configure and start the observer
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
};

const handleDOMChanges = (node) => {
  // Your existing copy functionality here
  // This is a placeholder for whatever copy functionality you need
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', observeDocument);
