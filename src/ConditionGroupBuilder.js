import React, { Component, Fragment } from "react";
import last from "lodash/last";

import {
  conditionIsUndefined,
  Operators,
  combineConditionGroups
} from "./utils";
import ConditionBuilder from "./ConditionBuilder";
import Preview from "./Preview";
import ExpandableButtons from "./ExpandableButtons";
import Connection from "./Connection";

const OperatorDropdown = ({ handleChange, operator }) => {
  return (
    <select value={operator} onChange={handleChange} required>
      <option value={Operators.and}>All of</option>
      <option value={Operators.or}>Any of</option>
    </select>
  );
};

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

  changeGroupOperator = (operator, groupId) => {
    const { operator: currentOperator } = this.getGroup(groupId);
    if (operator !== currentOperator) {
      this.updateGroup(groupId, {
        operator
      });
    }
  };

  addCondition = groupId => () => {
    this.createCondition({}, groupId);
  };

  deleteGroup = groupId => {
    const groups = this.state.groups.filter(({ id }) => id !== groupId);
    if (groups[0]) {
      groups[0].outerOperator = null;
    }
    this.setState({
      groups
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

  lastConditionIsUndefined = conditions =>
    conditionIsUndefined(last(conditions));

  addNewConditionButtons = groupId =>
    this.lastConditionIsUndefined(this.getGroup(groupId).conditions) ? null : (
      <button onClick={this.addCondition(groupId)}>+</button>
    );

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

  createCondition = (properties, groupId = 0) => {
    const conditionId = this.state.conditionId + 1;
    const group = this.getGroup(groupId);

    const conditions = [
      ...group.conditions,
      {
        id: conditionId,
        properties
      }
    ];

    const changes = { conditions };

    if (!group.operator && conditions.length > 1) {
      changes.operator = Operators.and;
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
        operator={operator}
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
          border: "1px solid #dcdcdc",
          // borderRadius: "5px",
          padding: 5
        }}
      >
        <div>
          <div
            style={{
              width: "4.5rem",
              minWidth: "4.5rem"
            }}
          >
            {this.operatorDropdown(groupId)}
          </div>
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

    return !outerOperator ? null : (
      <Connection>
        <select
          value={outerOperator}
          onChange={({ target: { value } }) => {
            this.updateGroup(groupId, { outerOperator: value });
          }}
          required={true}
        >
          {Object.values(Operators).map(operator => (
            <option key={operator} value={operator}>
              {operator}
            </option>
          ))}
        </select>
      </Connection>
    );
  };

  addNewGroupButtons = () => (
    <Connection>
      <div style={{ width: "4.5rem" }}>
        <ExpandableButtons
          items={Object.values(Operators).map(operator => ({
            key: operator,
            handleClick: () => this.createGroup(operator),
            component: () => <span>+{operator}</span>
          }))}
        />
      </div>
    </Connection>
  );

  render() {
    const groups = this.state.groups;

    return (
      <div>
        <h2>Query Builder</h2>
        {groups.map(({ id, outerOperator }, index) => (
          <div key={id}>{this.conditionGroupContainer(id)}</div>
        ))}
        {this.lastConditionIsUndefined((last(groups) || {}).conditions)
          ? null
          : this.addNewGroupButtons()}
        <h2>Preview</h2>
        <Preview combinedGroups={combineConditionGroups(groups)} />
      </div>
    );
  }
}

export default ConditionGroupBuilder;
