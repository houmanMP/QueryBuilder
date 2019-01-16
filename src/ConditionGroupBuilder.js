import React, { Component, Fragment } from "react";
import last from "lodash/last";
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";

import ConditionBuilder from "./ConditionBuilder";

const Operators = {
  and: "and",
  or: "or"
};

const OperatorDropdown = ({ handleChange, condition }) => (
  <select value={condition} onChange={handleChange} required>
    <option value={Operators.and}>{Operators.and}</option>
    <option value={Operators.or}>{Operators.or}</option>
  </select>
);

class ConditionGroupBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupId: -1,
      conditionId: -1
    };
  }

  componentDidMount() {
    if (this.state.groups.length === 0) {
      this.createGroup();
    }
  }

  changeGroupOperator = (innerOperator, groupId) => {
    const { operator } = this.getGroup(groupId);
    if (innerOperator !== operator) {
      this.updateGroup(groupId, {
        operator: innerOperator
      });
    }
  };

  addCondition = (operator, groupId) => () => {
    this.createCondition({}, groupId, operator);
  };

  deleteGroup = groupId => {
    this.setState({
      groups: this.state.groups.filter(({ id }) => id !== groupId)
    });
  };

  removeCondition = (conditionId, groupId) => () => {
    const group = this.getGroup(groupId);

    const conditions = group.conditions.filter(
      condition => condition.id !== conditionId
    );

    if (conditions.length === 0) {
      this.deleteGroup(groupId);

      if (this.state.groups.length === 1) {
        this.createGroup();
      }
    } else {
      const changes = { conditions };
      if (conditions.length < 2 && group.operator) {
        changes.operator = null;
      }
      this.updateGroup(groupId, changes);
    }
  };

  createGroup = outerOperator => {
    const groupId = this.state.groupId + 1;

    this.setState(
      {
        groupId,
        groups: [
          ...this.state.groups,
          {
            id: groupId,
            outerOperator,
            conditions: []
          }
        ]
      },
      () => {
        this.createCondition({}, groupId);
      }
    );
  };

  lastConditionIsUndefined = conditions => {
    const lastConditionProperties = get(last(conditions), "properties");
    return (
      isUndefined(lastConditionProperties) ||
      isUndefined(lastConditionProperties.parameter) ||
      isUndefined(lastConditionProperties.operator) ||
      isUndefined(lastConditionProperties.value)
    );
  };

  addNewConditionButtons = groupId => {
    const { operator, conditions } = this.getGroup(groupId);

    if (this.lastConditionIsUndefined(conditions)) {
      return null;
    }

    const canAddAnd = !operator || operator === Operators.and;
    const canAddOr = !operator || operator === Operators.or;

    return (
      <Fragment>
        {canAddAnd && (
          <button onClick={this.addCondition(Operators.and, groupId)}>
            +{Operators.and}
          </button>
        )}
        {canAddOr && (
          <button onClick={this.addCondition(Operators.or, groupId)}>
            +{Operators.or}
          </button>
        )}
      </Fragment>
    );
  };

  getGroup = groupId => this.state.groups.find(({ id }) => id === groupId);

  conditionsList = groupId => {
    const groupConditions = this.getGroup(groupId).conditions;
    return groupConditions.map(condition => (
      <div key={condition.id} style={{ display: "flex" }}>
        <ConditionBuilder
          properties={condition.properties}
          handleChange={this.handleConditionChange(condition.id, groupId)}
        />
        {groupConditions.length === 1 &&
        this.state.groups.length === 1 ? null : (
          <button onClick={this.removeCondition(condition.id, groupId)}>
            X
          </button>
        )}
      </div>
    ));
  };

  createCondition = (properties, groupId = 0, operator) => {
    const conditionId = this.state.conditionId + 1;
    const conditions = [
      ...this.getGroup(groupId).conditions,
      {
        id: conditionId,
        properties
      }
    ];

    const changes = { conditions };

    if (operator) {
      changes.operator = operator;
    }

    this.setState(
      {
        conditionId
      },
      () => {
        this.updateGroup(groupId, changes);
      }
    );
  };

  updateGroup = (id, changes) => {
    const groups = this.state.groups.map(group => {
      if (group.id === id) {
        return {
          ...group,
          ...changes
        };
      }
      return group;
    });

    this.setState({
      groups
    });
  };

  handleConditionChange = (conditionId, groupId) => change => {
    const conditions = this.getGroup(groupId).conditions.map(condition => {
      return condition.id !== conditionId
        ? condition
        : {
            id: conditionId,
            properties: {
              ...condition.properties,
              ...change
            }
          };
    });
    this.updateGroup(groupId, { conditions });
  };

  operatorDropdown = groupId => {
    const { operator } = this.getGroup(groupId);
    return operator ? (
      <OperatorDropdown
        condition={this.state.innerOperator}
        handleChange={({ target: { value } }) => {
          this.changeGroupOperator(value, groupId);
        }}
      />
    ) : null;
  };

  conditionGroupContainer = groupId => (
    <div>
      {this.changeOuterOperatorButtons(groupId)}
      <div
        key={groupId}
        style={{
          display: "flex",
          border: "1px solid black",
          borderRadius: "5px",
          padding: 5
        }}
      >
        <div
          style={{
            width: "4rem",
            minWidth: "4rem"
          }}
        >
          {this.operatorDropdown(groupId)}
        </div>
        <div>
          <div>{this.conditionsList(groupId)}</div>
          {this.addNewConditionButtons(groupId)}
        </div>
      </div>
    </div>
  );

  changeOuterOperatorButtons = groupId => {
    const outerOperator = this.getGroup(groupId).outerOperator;
    console.log(outerOperator);
    return !outerOperator ? null : (
      <div>
        {Object.values(Operators).map(operator => {
          const handleClick = () => {
            this.updateGroup(groupId, { outerOperator: operator });
          };

          return outerOperator === operator ? (
            <span>+{operator}</span>
          ) : (
            <button onClick={handleClick}>+{operator}</button>
          );
        })}
      </div>
    );
  };

  addNewGroupButtons = () =>
    Object.values(Operators).map(operator => (
      <button onClick={() => this.createGroup(operator)}>+{operator}</button>
    ));

  render() {
    const groups = this.state.groups;
    return (
      <div>
        {groups.map(({ id, outerOperator }, index) => (
          <div key={id}>{this.conditionGroupContainer(id)}</div>
        ))}
        {this.lastConditionIsUndefined((last(groups) || {}).conditions)
          ? null
          : this.addNewGroupButtons()}
      </div>
    );
  }
}

export default ConditionGroupBuilder;
