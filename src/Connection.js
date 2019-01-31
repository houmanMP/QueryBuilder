import React from "react";

const linkStyle = {
  padding: 0,
  margin: 0,
  backgroundColor: "#f9f9f9",
  display: "flex"
};

const Link = () => (
  <div style={{ ...linkStyle, height: "1rem" }}>
    <div style={{ width: "50%", borderRight: "1px solid #dcdcdc" }} />
    <div style={{ width: "50%", borderLeft: "1px solid #dcdcdc" }} />
    <div />
  </div>
);

function Connector({ children }) {
  return (
    <div>
      <Link />
      <div style={linkStyle}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {children}
        </div>
      </div>
      <Link />
    </div>
  );
}

function Section({ children }) {
  const style = {
    border: "1px solid #dcdcdc",
    // borderRadius: "5px",
    padding: 0,
    margin: 0,
    width: "100%",
    boxSizing: "border-box"
  };

  return (
    <div style={style}>
      <Connector>{children}</Connector>
    </div>
  );
}

const Options = () => (
  <div style={{ display: "inline-block" }}>
    <select style={{ margin: 0, padding: 0 }}>
      <option>and</option>
      <option>or</option>
    </select>
    <select style={{ margin: 0, padding: 0 }}>
      <option>and</option>
      <option>or</option>
    </select>
  </div>
);
Section.defaultProps = {
  children: <Options />
};

export default Section;
