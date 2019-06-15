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

function App() {
  // Declare a new state variable, which we'll call "count"
  // const [scores, setScores] = useState(["Spatial Distribution Score"]);
  return (
    <div className="App">
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">CMEC</NavbarBrand>
      </Navbar>
      <div>
        <ButtonGroup>
          {scalarOptions.map((scalar, i) => (
            <Button>{scalar}</Button>
          ))}
        </ButtonGroup>
      </div>
      <div>
        <ButtonGroup>
          {regionOptions.map((region, i) => (
            <Button>{region}</Button>
          ))}
        </ButtonGroup>
      </div>
    </div>
  );
}

export default App;
