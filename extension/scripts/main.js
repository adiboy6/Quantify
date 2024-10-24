const article = document.querySelector("article");

// `document.querySelector` may return null if the selector doesn't match anything.
if (article) {
  const text = article.textContent;
  console.log(text);
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}

(async () => {
  // Sends a message to the service worker and receives a tip in response
  const { tip } = await chrome.runtime.sendMessage({ greeting: "tip" });

  const nav = document.querySelector(".upper-tabs > nav");

  const tipWidget = createDomElement(`
    <button type="button" popovertarget="tip-popover" popovertargetaction="show" style="padding: 0 12px; height: 36px;">
      <span style="display: block; font: var(--devsite-link-font,500 14px/20px var(--devsite-primary-font-family));">Tip</span>
    </button>
  `);

  const popover = createDomElement(
    `<div id='tip-popover' popover style="margin: auto;">${tip}</div>`
  );

  document.body.append(popover);
  nav.append(tipWidget);
})();

function createDomElement(html) {
  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom.body.firstElementChild;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("@", message);
  if (message.greeting === "hello from popup") {
    console.log("connection established");
  }
});
