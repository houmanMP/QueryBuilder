import React, { Component, Fragment } from "react";
import { PropTypes } from "prop-types";

export default class ExpandableButtons extends Component {
  static propTypes = {
    open: PropTypes.node,
    close: PropTypes.node,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        handleClick: PropTypes.func.isRequired,
        component: PropTypes.node.isRequired
      })
    )
  };

  static defaultProps = {
    open: (
      <span>
        <strong>+</strong>
      </span>
    ),
    close: (
      <span>
        <strong>X</strong>
      </span>
    ),
    items: []
  };

  state = {
    open: false
  };

  toggleOpen = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    return (
      <div>
        {this.state.open ? (
          <Fragment>
            <button
              style={{ display: "inline-block", width: "100%" }}
              onClick={this.toggleOpen}
            >
              {this.props.close}
            </button>
            {this.props.items.map(({ component, key, handleClick }) => (
              <button
                key={key}
                style={{ display: "inline-block", width: "100%" }}
                onClick={() => {
                  handleClick();
                  this.toggleOpen();
                }}
              >
                {component()}
              </button>
            ))}
          </Fragment>
        ) : (
          <button
            style={{ display: "inline-block", width: "100%" }}
            onClick={this.toggleOpen}
          >
            {this.props.open}
          </button>
        )}
      </div>
    );
  }
}
