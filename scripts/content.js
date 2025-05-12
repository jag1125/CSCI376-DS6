chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkCanvasSubmitted') {
      let result = 'Not on an assignment page.';
  
      if (window.location.pathname.includes("/assignments/")) {
        const submitButton = (document.getElementsByClassName("icon-check"))[0];
  
        if (submitButton) {
          const isVisible = submitButton.offsetParent !== null;
          result = isVisible ? 'Submit check is visible' : 'Submit check is hidden';
        } else {
          result = 'Submit check not found';
        }
      }
  
      sendResponse({ result });
      return true;
    }
  });
