import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import last from "lodash/last";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import ConditionBuilder from "./ConditionBuilder";
import "./styles.css";

const Conditions = {
  add: "add",
  or: "or"
};

const GroupConditionDropdown = ({ handleChange, condition }) => (
  <select value={condition} onChange={handleChange} required>
    <option value={Conditions.add}>{Conditions.add}</option>
    <option value={Conditions.or}>{Conditions.or}</option>
  </select>
);

class ConditionGroupBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupCondition: null,
      conditions: [],
      conditionId: -1
    };
  }

  changeGroupCondition = groupCondition => {
    if (groupCondition !== this.state.groupCondition) {
      this.setState({
        groupCondition
      });
    }
  };

  addFirstCondition = () => {
    const conditionId = this.state.conditionId + 1;
    const conditions = [...this.state.conditions, conditionId];

    this.setState({
      conditions,
      conditionId
    });
  };

  addCondition = condition => () => {
    this.createCondition();
    this.changeGroupCondition(condition);
  };

  removeCondition = conditionId => () => {
    const conditions = this.state.conditions.filter(
      condition => condition.id !== conditionId
    );
    this.setState({
      conditions
    });

    if (conditions.length < 2) {
      this.setState({
        groupCondition: null
      });
    }
  };

  getAddConditions = () => {
    const lastConditionProperties = get(
      last(this.state.conditions),
      "properties"
    );

    if (
      isUndefined(lastConditionProperties) ||
      isUndefined(lastConditionProperties.parameter) ||
      isUndefined(lastConditionProperties.operator) ||
      isUndefined(lastConditionProperties.value)
    ) {
      return null;
    }

    const canAddAnd =
      !this.state.groupCondition ||
      this.state.groupCondition === Conditions.add;
    const canAddOr =
      !this.state.groupCondition || this.state.groupCondition === Conditions.or;

    return (
      <Fragment>
        {canAddAnd && (
          <button onClick={this.addCondition(Conditions.add)}>
            +{Conditions.add}
          </button>
        )}
        {canAddOr && (
          <button onClick={this.addCondition(Conditions.or)}>
            +{Conditions.or}
          </button>
        )}
      </Fragment>
    );
  };

  getConditions = () =>
    this.state.conditions.map(condition => (
      <div key={condition.id} style={{ display: "flex" }}>
        <ConditionBuilder
          properties={condition.properties}
          handleChange={this.handleConditionChange(condition.id)}
        />
        <button onClick={this.removeCondition(condition.id)}>X</button>
      </div>
    ));

  createCondition = properties => {
    const conditionId = this.state.conditionId + 1;

    const condition = {
      id: conditionId,
      properties
    };

    this.setState({
      conditions: [...this.state.conditions, condition],
      conditionId
    });
  };

  handleConditionChange = id => change => {
    if (id >= 0) {
      const conditions = this.state.conditions.map(condition => {
        return condition.id !== id
          ? condition
          : {
              id,
              properties: {
                ...condition.properties,
                ...change
              }
            };
      });
      this.setState({
        conditions
      });
    } else {
      this.createCondition(change);
    }
  };

  render() {
    return (
      <div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              width: "4rem",
              minWidth: "4rem"
            }}
          >
            <p>
              {this.state.groupCondition && (
                <GroupConditionDropdown
                  condition={this.state.groupCondition}
                  handleChange={({ target: { value } }) => {
                    this.changeGroupCondition(value);
                  }}
                />
              )}
            </p>
          </div>
          <div>
            <div>
              {this.state.conditions.length > 0 ? (
                this.getConditions()
              ) : (
                <ConditionBuilder handleChange={this.handleConditionChange()} />
              )}
            </div>
            {this.getAddConditions()}
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<ConditionGroupBuilder />, rootElement);
