chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.greeting === "tip") {
    fetch("https://randomuser.me/api").then(async (response) => {
      const data = await response.json();
      sendResponse({ tip: data["results"][0]["name"]["last"] });
    });
    return true;
  }
  if (message.greeting === "from pop up") {
    console.log("got message from popup");
  }
});
