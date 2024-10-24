document.addEventListener("DOMContentLoaded", function () {
  console.log(document);
  console.log("here");
  const startBtn = document.getElementById("startBtn");

  try {
    startBtn.addEventListener("click", async () => {
      console.log("inside click");

      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { greeting: "hello from popup" });
      });
    });
  } catch (error) {
    console.log(error);
  }
});
