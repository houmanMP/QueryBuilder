import React from "react";

const ConditionBuilder = ({
  handleChange,
  properties: { parameter, operator, value } = {}
}) => (
  <div>
    <select
      value={parameter}
      onChange={({ target: { value } }) =>
        handleChange({
          parameter: value
        })
      }
      required
    >
      {!parameter && <option value={"undefined"}>Select a condition</option>}
      <option value={"companySize"}>Company Size</option>
    </select>
    {parameter && (
      <select
        value={operator}
        onChange={({ target: { value } }) =>
          handleChange({
            operator: value
          })
        }
        required
      >
        {!operator && <option>operator</option>}
        <option value={"is"}>is</option>
        <option value={"isNot"}>is not</option>
      </select>
    )}
    {parameter && (
      <select
        value={value}
        onChange={({ target: { value } }) =>
          handleChange({
            value
          })
        }
        required
      >
        {!value && <option>value</option>}
        <option value={"small"}>small</option>
        <option value={"medium"}>medium</option>
        <option value={"large"}>large</option>
      </select>
    )}
  </div>
);

export default ConditionBuilder;
