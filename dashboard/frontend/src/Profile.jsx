import { useState } from "react";

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
        <div key={k} className="form-group">
          <label htmlFor={k} className="form-label">{keys[k]}:</label>
          <input
            type="url"
            name={k}
            id={k}
            placeholder="https://example.com"
            pattern="https://.*"
            className="form-input"
            value={data[k]}
            onChange={(e) => handleChange(e, k)}
          />
        </div>
      );
    } else if (k === "address") {
      for (let addressKey in keys[k]) {
        fields.push(
          <div key={addressKey} className="form-group">
            <label htmlFor={addressKey} className="form-label">{keys[k][addressKey]}:</label>
            <input
              type="text"
              name={addressKey}
              id={addressKey}
              className="form-input"
              value={data[k][addressKey]}
              onChange={(e) => handleChange(e, k, addressKey)}
            />
          </div>
        );
      }
    } else {
      fields.push(
        <div key={k} className="form-group">
          <label htmlFor={k} className="form-label">{keys[k]}:</label>
          <input
            type="text"
            name={k}
            id={k}
            className="form-input"
            value={data[k]}
            onChange={(e) => handleChange(e, k)}
          />
        </div>
      );
    }
  }

  return (
    <div className="profile-form">
      <h2 className="form-title">Profile Information</h2>
      <form className="form-container">
        {fields}
        <div className="form-group">
          <button type="submit" className="submit-button">
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}