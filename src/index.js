import React from "react";
import ReactDOM from "react-dom";

import QueryBuilder from "./ConditionGroupBuilder";

import "./styles.css";

const App = () => <QueryBuilder />;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
