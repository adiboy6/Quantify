document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("startBtn").addEventListener("click", startAutoFill);
});

function startAutoFill() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { key: "START_AUTO_FILL" });
  });
}
