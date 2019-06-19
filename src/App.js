import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  ButtonGroup,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const scalarOptions = [
  "Spatial Distribution Score",
  "Bias Score",
  "Overall Score",
  "Seasonal Cycle Score",
  "Interannual Variability Score",
  "RMSE Score",
  "Amplitude Score",
  "Max Phase Score",
  "Min Phase Score",
  "Difference Score",
  "Temporal Distribution Score",
  "Precipitation RMSE Score",
  "SurfaceAirTemperature RMSE Score",
  "Evapotranspiration RMSE Score",
  "SurfaceDownwardSWRadiation RMSE Score",
  "SurfaceNetSWRadiation RMSE Score"
];

const regionOptions = [
  "Global - Land",
  "Global - All",
  "South America - Amazon"
];

var PuOr = [
  "#b35806",
  "#e08214",
  "#fdb863",
  "#fee0b6",
  "#f7f7f7",
  "#d8daeb",
  "#b2abd2",
  "#8073ac",
  "#542788"
];
var GnRd = [
  "#b2182b",
  "#d6604d",
  "#f4a582",
  "#fddbc7",
  "#f7f7f7",
  "#d9f0d3",
  "#a6dba0",
  "#5aae61",
  "#1b7837"
];
// var cmap = GnRd;
// if (document.getElementById("colorblind").checked) cmap = PuOr;

function App() {
  // Declare a new state variable, which we'll call "count"
  // const [scores, setScores] = useState(["Spatial Distribution Score"]);
  return (
    <div className="App">
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">CMEC</NavbarBrand>
      </Navbar>
      <h2>Scalars</h2>
      <div class="radio">
        {scalarOptions.map((scalar, i) => (
          <label class="radio-inline scalarLabel">
            <input type="radio" class="scalarRadio" name="optradio" />
            {scalar}
          </label>
        ))}
      </div>
      <h2>Regions</h2>
      <div class="radio">
        {regionOptions.map((region, i) => (
          <label class="radio-inline scalarLabel">
            <input type="radio" class="scalarRadio" name="optradio" />
            {region}
          </label>
        ))}
      </div>
    </div>
  );
}

export default App;
