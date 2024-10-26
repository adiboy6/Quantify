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
