import React, { Component } from "react";

import { createCompany, validateCombinedGroups } from "./utils";

class Preview extends Component {
  state = {
    companies: []
  };

  Company = (company, combinedPropertyGroups) => {
    const { name, size, region } = company;
    const text = `${name} (${size}, ${region})`;
    if (
      combinedPropertyGroups &&
      validateCombinedGroups(company)(combinedPropertyGroups)
    ) {
      return (
        <p key={text} style={{ color: "green" }}>
          {text}
        </p>
      );
    }
    return (
      <p key={text} style={{ color: "red" }}>
        {text}
      </p>
    );
  };

  addNewCompany = () => {
    const newCompany = createCompany();
    this.setState({
      companies: [...this.state.companies, newCompany]
    });
  };

  render() {
    const { combinedGroups } = this.props;
    return (
      <div>
        <button onClick={this.addNewCompany}>Add User</button>
        {this.state.companies.map(company =>
          this.Company(company, combinedGroups)
        )}
      </div>
    );
  }
}

export default Preview;
