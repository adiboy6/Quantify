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
      .filter((element) => element.tabIndex > -1)
      .reverse()
      .sort((a, b) => (a.tabIndex > b.tabIndex ? -1 : 1));

    console.log(tabElements);

    tabElements.forEach((element) => {
      if (
        element.getAttribute("role") === "button" ||
        element.getAttribute("type") === "button"
      ) {
        console.log(element);
        const labels = getLabels(element);

        fillSelectField(element, labels);
        console.log(labels);
        console.log("button");
      }
      // if (element.getAttribute("id") === "s2id_autogen3") {
      //   setTimeout(() => {
      //     console.log("focusing on ", element);
      //     const e = document.getElementById(
      //       "s2id_job_application_answers_attributes_5_boolean_value"
      //     );

      //     const aElement = e.getElementsByTagName("a")[0];
      //     const event = new MouseEvent("mousedown", {
      //       bubbles: true,
      //       cancelable: true,
      //     });
      //     aElement.dispatchEvent(event);

      //     const path = `//div[@id="select2-drop" and not(contains(@style, "display: none"))]//ul[@class="select2-results" and @role="listbox"]//li[@role="option" and "Yes"]`;
      //     const results = document.evaluate(
      //       path,
      //       document,
      //       null,
      //       XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
      //       null
      //     );

      //     const yesEle = results.snapshotItem(1);

      //     yesEle.dispatchEvent(
      //       new MouseEvent("mouseup", {
      //         bubbles: true,
      //         cancelable: true,
      //       })
      //     );
      //   }, 0);
      // }
    });
  }
});

function fillSelectField(element, labels) {
  const matchedKey = getMatchingKey(labels);
  if (matchedKey === null) return;

  const toFill = data[matchedKey];
  if (toFill === null) return;

  const matchedSite = getMatchedSite();
  console.log(toFill);

  greenhouseSelect(element, toFill);
}

function processForm(form) {
  // Process all the children of a form element
  Array.from(form.elements).forEach((element) => {
    // Skip processing if the element is hidden
    if (element.getAttribute("type") !== "hidden") {
      // Get Label of the element
      const labels = getLabels(element);

      fillField(labels, element);
    }
  });
}

function getLabels(element) {
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

  return labels;
}

function fillField(labels, element) {
  console.log(element);

  const matchedKey = getMatchingKey(labels);
  console.log(labels);
  console.log(matchedKey);
  if (matchedKey === null) return;

  const toFill = data[matchedKey];
  if (toFill === null) return;

  if (element.type === "text") {
    element.value = toFill;
  }

  // if (element.id === "gender") {
  //   console.log(element.labels);
  //   const labelEle = element.labels[0];
  //   console.log(labelEle.parentNode);
  //   labelEle.parentNode.dispatchEvent(
  //     new MouseEvent("click", {
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //   );
  // }
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

function getMatchedSite() {
  const url = document.URL;
  for (let key in siteMatch) {
    for (let siteUrl of siteMatch[key]) {
      if (url.indexOf(siteUrl) != -1) return key;
    }
  }

  return null;
}

// Site specific functions
// TODO - find a way to do partial match on ids
function greenhouseSelect(element, value) {
  console.log("greenhouse");
  console.log(element.parentNode);
  console.log(value);

  element = element.parentNode;

  if (element.getElementsByTagName("a").length === 0) return;

  const aElement = element.getElementsByTagName("a")[0];
  const event = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
  });
  aElement.dispatchEvent(event);

  const path = `//div[@id="select2-drop" and not(contains(@style, "display: none"))]//ul[@class="select2-results" and @role="listbox"]//li[@role="option"]`;
  const results = document.evaluate(
    path,
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  let selectElement = null;
  for (let i = 0; i < results.snapshotLength; i++) {
    const text = results.snapshotItem(i).innerText;
    console.log(text);
    if (text.toLowerCase().indexOf(value.toLowerCase()) != -1) {
      selectElement = results.snapshotItem(i);
      break;
    }
  }

  if (selectElement === null) return;
  selectElement.dispatchEvent(
    new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
    })
  );
}

const fields = {
  firstName: { alias: ["first name"], match: "full" },
  lastName: { alias: ["last name"], match: "full" },
  email: { alias: ["email"], match: "full" },
  phone: { alias: ["phone"], match: "full" },
  locationCity: { alias: ["location (city)"], match: "full" },
  linkedIn: { alias: ["linkedin profile"], match: "full" },
  salary: { alias: ["desired salary"], match: "full" },
  sponsorship: {
    alias: [
      "require sponsorship",
      "will you need sponsorship",
      "require visa sponsorship",
      "require visa support",
    ],
    match: "partial",
  },
  authorizedToWork: {
    alias: [
      "legal right to work in the united states",
      "eligible to work in the country",
      "authorized to work",
    ],
    match: "partial",
  },
  state: {
    alias: ["state do you currently reside"],
    match: "partial",
  },
  hybridOpinion: {
    alias: ["comfortable working in a hybrid setting"],
    match: "partial",
  },
  gender: {
    alias: ["gender"],
    match: "full",
  },
  country: {
    alias: ["Where do you currently reside"],
    match: "partial",
  },
  hispanicOption: {
    alias: ["hispanic"],
    match: "partial",
  },
  veteranStatus: {
    alias: ["veteran"],
    match: "partial",
  },
  disabilityStatus: {
    alias: ["disability"],
    match: "partial",
  },
};

const siteMatch = {
  jobBoardsGreenhouse: ["job-boards.greenhouse.io"],
  greenhouse: ["greenhouse.io"],
};

const data = {
  firstName: "Peter",
  lastName: "Parker",
  email: "peter@gmail.com",
  phone: "7118082143",
  locationCity: "Herndon, Virginia, United States",
  linkedIn: "https://linkedin.com/peter",
  salary: "$90000",
  sponsorship: "No",
  authorizedToWork: "Yes",
  state: "Virginia",
  hybridOpinion: "Yes",
  gender: "Male",
  country: "United States of America",
  hispanicOption: "No",
  veteranStatus: "I am not a protected veteran",
  disabilityStatus: "i do not have",
};
