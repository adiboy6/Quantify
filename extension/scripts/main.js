(async () => {
  // Sends a message to the service worker and receives a tip in response
  await chrome.runtime.sendMessage({
    key: "FETCH_PROFILE_INFO",
  });
})();

async function startAutoFill() {
  console.log("starting autofill");

  const data = await chrome.runtime.sendMessage({
    key: "FETCH_PROFILE_INFO",
  });

  console.log(data);

  // Process all form elements
  const allForms = document.querySelectorAll("form");
  allForms.forEach(processForm);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.key === "START_AUTO_FILL") {
    startAutoFill();

    const tabElements = Array.from(
      document
        // Get all elements that can be focusable
        .querySelectorAll(
          "a, button, input, textarea, select, details, [tabindex]"
        )
    )

      // remove any that have a tabIndex of -1
      .filter((element) => element.tabIndex > -1)

      // reverse, then sort by tabIndex descending to put 0s last but maintain original order
      .reverse()
      .sort((a, b) => (a.tabIndex > b.tabIndex ? -1 : 1));

    console.log(tabElements);
    let count = 0;
    tabElements.forEach((element) => {
      if (element.getAttribute("id") === "s2id_autogen3") {
        count += 1;
        setTimeout(() => {
          console.log("focusing on ", element);
          const e = document.getElementById(
            "s2id_job_application_answers_attributes_5_boolean_value"
          );

          const aElement = e.getElementsByTagName("a")[0];
          const event = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
          });
          aElement.dispatchEvent(event);

          const path = `//div[@id="select2-drop" and not(contains(@style, "display: none"))]//ul[@class="select2-results" and @role="listbox"]//li[@role="option" and "Yes"]`;
          const results = document.evaluate(
            path,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
          );

          const yesEle = results.snapshotItem(1);

          yesEle.dispatchEvent(
            new MouseEvent("mouseup", {
              bubbles: true,
              cancelable: true,
            })
          );
        }, 0);
      }
    });
  }
});

function processForm(form) {
  // Process all the children of a form element
  Array.from(form.elements).forEach((element) => {
    // Skip processing if the element is hidden
    if (element.getAttribute("type") !== "hidden") {
      // Get Label of the element
      const labelNodes = element.labels ?? [];
      let labels = [];

      labelNodes.forEach((label) => labels.push(label.innerText));

      const ariaLabelledBy = element.getAttribute("aria-labelledby");
      if (ariaLabelledBy !== null) {
        labels.push(document.getElementById(ariaLabelledBy).innerText);
      }
      labels = labels
        .map((label) => label.replaceAll("\n", "").replaceAll(/[\*]/g, ""))
        .map((label) => label.trim());

      fillField(labels, element);
    }
  });
}

function fillField(labels, element) {
  const matchedKey = getMatchingKey(labels);
  if (matchedKey === null) return;

  const toFill = data[matchedKey];
  if (toFill === null) return;

  console.log(element);

  if (element.type === "text") {
    element.value = toFill;
  }
}

function getMatchingKey(labels) {
  for (let label of labels) {
    const fullMatch = (fieldName) => label.toLowerCase() === fieldName;
    const partialMatch = (fieldName) => label.toLowerCase().includes(fieldName);

    for (let field in fields) {
      if (
        (fields[field]["match"] === "full" &&
          fields[field]["alias"].some(fullMatch)) ||
        (fields[field]["match"] === "partial" &&
          fields[field]["alias"].some(partialMatch))
      ) {
        return field;
      }
    }
  }

  return null;
}

const fields = {
  firstName: { alias: ["first name"], match: "full" },
  lastName: { alias: ["last name"], match: "full" },
  email: { alias: ["email"], match: "full" },
  phone: { alias: ["phone"], match: "full" },
  locationCity: { alias: ["location (city)"], match: "full" },
  linkedIn: { alias: ["linkedin profile"], match: "full" },
  salary: { alias: ["desired salary"], match: "full" },
  sponsorship: { alias: ["will you need sponsorship"], match: "partial" },
  authorizedToWork: {
    alias: ["legal right to work in the united states"],
    match: "partial",
  },
};

const data = {
  firstName: "Peter",
  lastName: "Parker",
  email: "peter@gmail.com",
  phone: "7118082143",
  locationCity: "Herndon, Virginia, United States",
  linkedIn: "https://linkedin.com/peter",
  salary: "$90000",
  sponsorship: "Yes",
  authorizedToWork: "Yes",
};
