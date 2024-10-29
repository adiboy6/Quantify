import { useState, useEffect } from "react";

export function Profile() {
  const keys = {
    firstName: "First Name",
    lastName: "Last Name",
    education: "Education",
    address: {
      street: "Street",
      apt: "Apt",
      city: "City",
      state: "State",
      zipcode: "Zipcode",
    },
    linkedIn: "LinkedIn",
    portfolio: "Portfolio",
  };

  const initialData = {
    firstName: "",
    lastName: "",
    education: "",
    address: {
      street: "",
      apt: "",
      city: "",
      state: "",
      zipcode: "",
    },
    linkedIn: "",
    portfolio: "",
  };

  const [data, setData] = useState(initialData);
  function handleChange(e, k, addressKey = null) {
    const clone = structuredClone(data);
    if (addressKey != null) {
      clone[k][addressKey] = e.target.value;
    } else {
      clone[k] = e.target.value;
    }
    setData(clone);
  }

  const fields = [];
  for (let k in keys) {
    if (k === "linkedIn" || k === "portfolio") {
      fields.push(
        <div key={k}>
          <label htmlFor={k}>{keys[k]}:</label>
          <input
            type="url"
            name={k}
            id={k}
            placeholder="https://example.com"
            pattern="https://.*"
            size="30"
            value={data[k]}
            onChange={(e) => handleChange(e, k)}
          />
        </div>
      );
    } else if (k == "address") {
      {
        console.log(data);
      }
      for (let addressKey in keys[k]) {
        fields.push(
          <div key={addressKey}>
            <label htmlFor={addressKey}>{keys[k][addressKey]}:</label>
            <input
              type="text"
              name={addressKey}
              id={addressKey}
              size="30"
              value={data[k][addressKey]}
              onChange={(e) => handleChange(e, k, addressKey)}
            />
          </div>
        );
      }
    } else {
      fields.push(
        <div key={k}>
          <label htmlFor={k}>{keys[k]}:</label>
          <input
            type="text"
            name={k}
            id={k}
            size="30"
            value={data[k]}
            onChange={(e) => handleChange(e, k)}
          />
        </div>
      );
    }
  }

  return <div>{fields}</div>;
}
