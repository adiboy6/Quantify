chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const config = {
    dashboard_url: "http://localhost:5173",
    backend_url: "http://127.0.0.1:5000",
  };

  if (message.key === "FETCH_PROFILE_INFO") {
    chrome.cookies.getAll({ url: config["dashboard_url"] }, function (cookies) {
      let loggedInUserEmail = null;

      cookies.forEach((cookie) => {
        if (cookie.name === "email" && cookie.value.length > 0) {
          loggedInUserEmail = cookie.value;
        }
      });

      if (loggedInUserEmail === null) sendResponse({ data: null });

      const url = `${config["backend_url"]}/api/getUserProfile?email=${loggedInUserEmail}`;
      fetch(url).then(async (response) => {
        console.log(response);
        const data = await response.json();
        sendResponse({ data: data });
      });
    });
  }

  if (message.key === "FETCH_CONFIG") {
    sendResponse(config);
  }

  if (message.key === "FETCH_COOKIES") {
    chrome.cookies.getAll({ url: config["dashboard_url"] }, function (data) {
      sendResponse(data);
    });
  }

  return true;
});
