import { useState } from "react";
import { Box, Grid, Flex } from "@radix-ui/themes";
import { TrashIcon } from "@heroicons/react/24/outline";
const keys = {
  firstName: "First Name",
  lastName: "Last Name",
  education: "Education",
  experience: "Experience",
  address: {
    street: "Street",
    apt: "Apt",
    city: "City",
    state: "State",
    zipcode: "Zipcode",
  },
  linkedIn: "LinkedIn",
  portfolio: "Portfolio",
  resume: "Your CV/Resume",
};

const initialEducationData = {
  timestamp: 1,
  school: "",
  major: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
};

const initialProfessionalExperience = {
  timestamp: 0,
  company: "",
  title: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  description: "",
};
const initialData = {
  firstName: "",
  lastName: "",
  education: [initialEducationData],
  experience: [initialProfessionalExperience],
  address: {
    street: "",
    apt: "",
    city: "",
    state: "",
    zipcode: "",
  },
  linkedIn: "",
  portfolio: "",
  resume: "",
};

export function Profile() {
  const [data, setData] = useState(initialData);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  function handleChange(e, k, addressKey = null) {
    const clone = structuredClone(data);
    if (k === "resume") {
      clone[k] = e.target.files[0];
    } else if (addressKey != null) {
      clone[k][addressKey] = e.target.value;
    } else {
      clone[k] = e.target.value;
    }
    setData(clone);
  }

  async function createProfile() {
    const formData = new FormData();
    setSubmitDisabled(true);

    for (let key in data) {
      if (key === "address") {
        for (let addressKey in data[key]) {
          formData.append(addressKey, data[key][addressKey]);
        }
      } else if (key === "education" || key === "experience") {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const result = await fetch("http://localhost:8000/createProfile", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }

  const fields = [];
  for (let k in keys) {
    if (k === "linkedIn" || k === "portfolio") {
      fields.push(
        <Grid key={k} columns="10rem 35rem">
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
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </Grid>
      );
    } else if (k == "address") {
      for (let addressKey in keys[k]) {
        fields.push(
          <Grid key={addressKey} columns="10rem 35rem">
            <label htmlFor={addressKey}>{keys[k][addressKey]}:</label>
            <input
              type="text"
              name={addressKey}
              id={addressKey}
              size="30"
              value={data[k][addressKey]}
              onChange={(e) => handleChange(e, k, addressKey)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </Grid>
        );
      }
    } else if (k == "education") {
      console.log(data[k]);
      data[k].forEach((eduInfo, index) => {
        console.log(eduInfo);
        fields.push(educationForm(eduInfo, index, data, setData));
      });

      fields.push(
        <Grid key={k} columns="10rem 35rem">
          <div></div>
          <button
            onClick={() => {
              const timestamp = new Date().toISOString();
              const cloneInitialData = structuredClone(initialEducationData);
              cloneInitialData["timestamp"] = timestamp;

              const clone = structuredClone(data);
              clone["education"].push(cloneInitialData);

              setData(clone);
            }}
            className="bg-white text-blue-600 my-8 transition-colors inline-flex gap-2 text-lg font-medium"
          >
            + Education
          </button>
        </Grid>
      );
    } else if (k == "experience") {
      data[k].forEach((expInfo, index) => {
        fields.push(profExperienceForm(expInfo, index, data, setData));
      });

      fields.push(
        <Grid key={k} columns="10rem 35rem">
          <div></div>
          <button
            onClick={() => {
              const timestamp = new Date().toISOString();
              const cloneInitialExpData = structuredClone(
                initialProfessionalExperience
              );
              cloneInitialExpData["timestamp"] = timestamp;

              const clone = structuredClone(data);
              clone["experience"].push(cloneInitialExpData);

              setData(clone);
            }}
            className="bg-white text-blue-600 my-8 transition-colors inline-flex gap-2 text-lg font-medium"
          >
            + Experience
          </button>
        </Grid>
      );
    } else if (k == "resume") {
      fields.push(
        <Grid key={k} columns="10rem 35rem">
          <label htmlFor={k}>{keys[k]}:</label>
          <input
            key={k}
            type="file"
            onChange={(e) => {
              handleChange(e, k);
            }}
          />
        </Grid>
      );
    } else {
      fields.push(
        <Grid key={k} columns="10rem 35rem">
          <label htmlFor={k}>{keys[k]}:</label>
          <input
            type="text"
            name={k}
            id={k}
            size="30"
            value={data[k]}
            onChange={(e) => handleChange(e, k)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </Grid>
      );
    }
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 className="md:text-4xl mb-16 font-bold leading-tight text-blue-600">
        Let's create your Profile
      </h2>

      <Flex direction="column" gap="2">
        {fields}
        <Flex direction="row" justify="center" className="mt-8">
          <button
            disabled={submitDisabled}
            onClick={createProfile}
            className={
              (submitDisabled
                ? "bg-gray-300 text-black"
                : "bg-blue-600 text-white") +
              ` px-8 py-4 rounded-full cursor-pointer inline-flex items-center gap-2`
            }
          >
            {submitDisabled ? "Submitting ..." : "Create Profile"}
          </button>
        </Flex>
      </Flex>
    </Box>
  );
}

function educationForm(eduInfo, index, data, setData) {
  // let key = index + " : " + (eduInfo.school ?? "") + " : ";
  // key += (eduInfo.start ?? "") + " : " + (eduInfo.end ?? "") + " : ";
  // key += (eduInfo.major ?? "") + " : ";

  let key = eduInfo.timestamp;

  const handleChange = (key, value) => {
    const clone = structuredClone(data);
    clone["education"][index][key] = value;
    setData(clone);
  };
  return (
    <Grid key={key} columns="10rem 35rem">
      <label>Education {index + 1}</label>
      <Flex direction="column" gap="2">
        <input
          type="text"
          name="school"
          value={eduInfo.school}
          placeholder="Enter your School name"
          onChange={(e) => handleChange("school", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <input
          type="text"
          name="major"
          size="30"
          placeholder="Enter your School Major"
          value={eduInfo.major}
          onChange={(e) => handleChange("major", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <Flex gap="0.5rem">
          <input
            type="text"
            name="startMonth"
            size="10"
            placeholder="Start Month"
            value={eduInfo.startMonth}
            onChange={(e) => handleChange("startMonth", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="number"
            name="startYear"
            size="10"
            placeholder="Start Year"
            value={eduInfo.startYear}
            onChange={(e) => handleChange("startYear", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </Flex>
        <Flex gap="0.5rem">
          <input
            type="text"
            name="endMonth"
            size="10"
            placeholder="End Month"
            value={eduInfo.endMonth}
            onChange={(e) => handleChange("endMonth", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="number"
            name="endYear"
            size="10"
            placeholder="End Year"
            value={eduInfo.endYear}
            onChange={(e) => handleChange("endYear", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </Flex>
        {data["education"].length > 1 && (
          <button
            onClick={() => {
              const clone = structuredClone(data);
              clone["education"].splice(index, 1);

              setData(clone);
            }}
            style={{ width: "fit-content", marginBottom: "1rem" }}
          >
            <TrashIcon className="mt-8 mb-8 size-6 text-blue-500"></TrashIcon>
          </button>
        )}
      </Flex>
    </Grid>
  );
}

function profExperienceForm(expInfo, index, data, setData) {
  let key = expInfo.timestamp;

  const handleChange = (key, value) => {
    const clone = structuredClone(data);
    clone["experience"][index][key] = value;
    setData(clone);
  };
  return (
    <Grid key={key} columns="10rem 35rem">
      <label>Experience {index + 1}</label>
      <Flex direction="column" gap="2">
        <input
          type="text"
          name="company"
          value={expInfo.company}
          placeholder="Enter your Company name"
          onChange={(e) => handleChange("company", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <input
          type="text"
          name="title"
          size="30"
          placeholder="Enter your Work title"
          value={expInfo.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <Flex gap="0.5rem">
          <input
            type="text"
            name="startMonth"
            size="10"
            placeholder="Start Month"
            value={expInfo.startMonth}
            onChange={(e) => handleChange("startMonth", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="text"
            name="startYear"
            size="10"
            placeholder="Start Year"
            value={expInfo.startYear}
            onChange={(e) => handleChange("startYear", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </Flex>
        <Flex gap="0.5rem">
          <input
            type="text"
            name="endMonth"
            size="10"
            placeholder="End Month"
            value={expInfo.endMonth}
            onChange={(e) => handleChange("endMonth", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <input
            type="text"
            name="endYear"
            size="10"
            placeholder="End Year"
            value={expInfo.endYear}
            onChange={(e) => handleChange("endYear", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </Flex>
        <textarea
          placeholder="Role description"
          value={expInfo.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        ></textarea>
        {data["experience"].length > 1 && (
          <button
            onClick={() => {
              const clone = structuredClone(data);
              clone["experience"].splice(index, 1);

              setData(clone);
            }}
            style={{ width: "fit-content", marginBottom: "1rem" }}
          >
            <TrashIcon className="mt-8 mb-8 size-6 text-blue-500"></TrashIcon>
          </button>
        )}
      </Flex>
    </Grid>
  );
}
