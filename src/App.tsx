import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import PopSlide from "./PopSlide";
import Feed from "./Feed";

function App() {
  const [visible, setVisible] = useState<boolean>(false);

  const onMouseEnter = () => {
    console.log("onMouseEnter");
    setVisible(true);
  };

  const onVisibleChange = (show: boolean) => {
    // console.log("Feed onVisibleChange", show);
    setVisible(show);
  };

  return (
    <div className="transApp">
      <div className="App">
        <div className="warpFeed">
          <PopSlide
            visible={visible}
            popWidth={400}
            onVisibleChange={onVisibleChange}
          >
            <Feed />
          </PopSlide>
        </div>
        <header className="App-header">
          <div onMouseEnter={onMouseEnter}>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </div>
  );
}

export default App;
