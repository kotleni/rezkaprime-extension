function injectScript(filePath) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.runtime.getURL(filePath));
  (document.head || document.documentElement).appendChild(script);
  script.onload = () => {
    script.remove();
  };
}

/* inject main script to page world */
injectScript('content.js');

/* pass events between page and background */
window.addEventListener("message", (event) => {
  browser.runtime.sendMessage(event.data);
});