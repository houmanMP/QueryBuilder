import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import last from "lodash/last";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import ConditionBuilder from "./ConditionBuilder";

const Operators = {
  add: "add",
  or: "or"
};

const OperatorDropdown = ({ handleChange, condition }) => (
  <select value={condition} onChange={handleChange} required>
    <option value={Operators.add}>{Operators.add}</option>
    <option value={Operators.or}>{Operators.or}</option>
  </select>
);

class ConditionGroupBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupOperator: null,
      conditions: [],
      conditionId: -1,
      groups: [],
      groupId: -1
    };
  }

  componentDidMount() {
    if (this.state.conditions.length === 0) {
      this.createCondition();
    }
  }

  changeGroupOperator = groupOperator => {
    if (groupOperator !== this.state.groupOperator) {
      this.setState({
        groupOperator
      });
    }
  };

  addCondition = condition => () => {
    this.createCondition();
    this.changeGroupOperator(condition);
  };

  removeCondition = conditionId => () => {
    const conditions = this.state.conditions.filter(
      condition => condition.id !== conditionId
    );

    this.setState(
      {
        conditions
      },
      () => {
        if (this.state.conditions.length === 0) {
          this.createCondition();
        }
      }
    );

    if (this.state.conditions.length < 3 && this.state.groupOperator) {
      this.setState({
        groupOperator: null
      });
    }
  };

  addNewConditionButtons = () => {
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
      !this.state.groupOperator || this.state.groupOperator === Operators.add;
    const canAddOr =
      !this.state.groupOperator || this.state.groupOperator === Operators.or;

    return (
      <Fragment>
        {canAddAnd && (
          <button onClick={this.addCondition(Operators.add)}>
            +{Operators.add}
          </button>
        )}
        {canAddOr && (
          <button onClick={this.addCondition(Operators.or)}>
            +{Operators.or}
          </button>
        )}
      </Fragment>
    );
  };

  conditionsList = () =>
    this.state.conditions.map(condition => (
      <div key={condition.id} style={{ display: "flex" }}>
        <ConditionBuilder
          properties={condition.properties}
          handleChange={this.handleConditionChange(condition.id)}
        />
        {this.state.conditions.length === 1 ? null : (
          <button onClick={this.removeCondition(condition.id)}>X</button>
        )}
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

  operatorDropdown = () =>
    this.state.groupOperator ? (
      <OperatorDropdown
        condition={this.state.groupOperator}
        handleChange={({ target: { value } }) => {
          this.changeGroupOperator(value);
        }}
      />
    ) : null;

  conditionGroupContainer = () => (
    <div style={{ display: "flex", border: "1px dashed black" }}>
      <div
        style={{
          width: "4rem",
          minWidth: "4rem"
        }}
      >
        {this.operatorDropdown()}
      </div>
      <div>
        <div>{this.conditionsList()}</div>
        {this.addNewConditionButtons()}
      </div>
    </div>
  );

  addNewConditionGroup = () => {};

  addConditionGroupButton = () => <button>+</button>;

  render() {
    return (
      <div>
        {this.conditionGroupContainer()}
        {this.addConditionGroupButton()}
      </div>
    );
  }
}

export default ConditionGroupBuilder;
