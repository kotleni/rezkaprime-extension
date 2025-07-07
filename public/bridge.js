/* bridge between page and background */

window.addEventListener("message", (event) => {
  browser.runtime.sendMessage(event.data);
});