chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(chrome.cookies);
  console.log(message);
  if (message.key === "FETCH_PROFILE_INFO") {
    chrome.storage.session.get(["lastName"]).then((result) => {
      if (result["lastName"] !== undefined) {
        console.log("data cached... returning");
        sendResponse({ last: result["lastName"] });
      } else {
        fetch("https://randomuser.me/api").then(async (response) => {
          const data = await response.json();
          const lastName = data["results"][0]["name"]["last"];

          chrome.storage.session.set({ lastName }).then(() => {
            console.log("Value was set");
          });

          sendResponse({ last: data["results"][0]["name"]["last"] });
        });
      }
    });
  }

  if (message.key === "FETCH_COOKIES") {
    const domain = "http://localhost:5173/";
    chrome.cookies.getAll({ url: domain }, function (data) {
      sendResponse({ data: data });
    });
  }

  return true;
});
