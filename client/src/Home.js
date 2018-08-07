import React, { Component } from "react";
import { Switch, Route, NavLink, BrowserRouter } from "react-router-dom"; 

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Enigma Data Marketplace</h1>
        <p>This is the Enigma Data Marketplace home.</p>
      </div>
    );
  }
}

export default Home;
