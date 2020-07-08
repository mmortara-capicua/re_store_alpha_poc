import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="layout-container">
      <div className="header">header</div>
      <div className="main">
        <div className="grid-container">
          <div className="ChatForm">ChatForm</div>
          <div className="ChatTimeLine">ChatTimeLine</div>
          <div className="VideoPlayer">VideoPlayer</div>
        </div>
      </div>
      <div className="footer">footer</div>
    </div>
  );
}

export default App;
