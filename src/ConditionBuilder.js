import React, { Fragment } from "react";

const ConditionBuilder = ({
  handleChange,
  properties: { parameter, operator, value } = {}
}) => (
  <div>
    <select
      value={parameter}
      style={{ fontWeight: parameter ? "normal" : "bold" }}
      onChange={({ target: { value } }) =>
        handleChange({
          parameter: value
        })
      }
      required
    >
      {!parameter && <option value={"undefined"}>Select a condition</option>}
      <option value={"size"}>Company Size</option>
      <option value={"region"}>Region</option>
    </select>
    {parameter && (
      <select
        style={{ fontWeight: operator ? "normal" : "bold" }}
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
        style={{ fontWeight: value ? "normal" : "bold" }}
        onChange={({ target: { value } }) =>
          handleChange({
            value
          })
        }
        required
      >
        {!value && <option>value</option>}
        {parameter === "size" ? (
          <Fragment>
            <option value={"small"}>small</option>
            <option value={"medium"}>medium</option>
            <option value={"large"}>large</option>
          </Fragment>
        ) : (
          <Fragment>
            <option value={"Asia"}>Asia</option>
            <option value={"Europe"}>Europe</option>
            <option value={"North America"}>North America</option>
          </Fragment>
        )}
      </select>
    )}
  </div>
);

export default ConditionBuilder;
