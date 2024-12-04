chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const domain = "http://localhost:5173/";

  if (message.key === "FETCH_PROFILE_INFO") {
    chrome.cookies.getAll({ url: domain }, function (cookies) {
      let loggedInUserEmail = null;

      cookies.forEach((cookie) => {
        if (cookie.name === "email" && cookie.value.length > 0) {
          loggedInUserEmail = cookie.value;
        }
      });

      if (loggedInUserEmail === null) sendResponse({ data: null });

      const url = `http://127.0.0.1:5000/api/getUserProfile?email=${loggedInUserEmail}`;
      fetch(url).then(async (response) => {
        console.log(response);
        const data = await response.json();
        sendResponse({ data: data });
      });
    });
  }

  if (message.key === "FETCH_COOKIES") {
    chrome.cookies.getAll({ url: domain }, function (data) {
      sendResponse(data);
    });
  }

  return true;
});
