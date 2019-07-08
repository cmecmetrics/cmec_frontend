import React, { Fragment, useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { json } from "d3-request";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import useAxios from "axios-hooks";
import logo from "./logo.svg";
import "./App.css";
import { scaleOrdinal } from "d3-scale";
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

const width = 1000;
const height = 600;
const black = "#333333";
const title = "My Data Visualization";
const scalarColorScale = {
  "Ecosystem and Carbon Cycle": "#ECFFE6",
  "Hydrology Cycle": "#E6F9FF",
  "Radiation and Energy Cycle": "#FFECE6",
  Forcings: "#EDEDED",
  Relationships: "#fff2e5"
};

export const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Raleway:400,600&display=swap');

body {
  font-family: 'Raleway', Arial, Helvetica, sans-serif;
  color: ${black};
  padding: 0;
  margin: 0;
}

table.table-header-rotated {
  border-collapse: collapse;
}

th.rotate {
  height: 82px;
  white-space: nowrap;
  font-weight: normal;
}
th.rotate > div {
  transform: translate(10px, 36px) rotate(-45deg);
  width: 0px;
}
th.rotate > div > span {
}
td {
  height: 25px;
  width: 25px;
  border: 1px solid;
}
td.row-label {
  width: 325px;
}
`;

export const Container = styled.div`
  display: grid;
  grid-template-rows: 30px 1fr;
  align-items: center;
  .title {
    font-size: 25px;
    font-weight: 600;
    padding-left: 20px;
  }
`;

export const Visualization = styled.div`
  justify-self: center;
  width: ${width}px;
  height: ${height}px;
  // 6
`;

const modelNames = [
  "bcc-csm1-1",
  "bcc-csm1-1-m",
  "CESM1-BGC",
  "GFDL-ESM2G",
  "inmcm4",
  "IPSL-CM5A-LR",
  "MIROC-ESM",
  "MPI-ESM-LR",
  "NorESM1-ME",
  "MeanCMIP5",
  "BCC-CSM2-MR",
  "BCC-ESM1",
  "CESM2",
  "CESM2-WACCM",
  "CNRM-CM6-1",
  "CNRM-ESM2-1",
  "E3SMv1-CTC",
  "GISS-E2-1-G",
  "GISS-E2-1-H",
  "IPSL-CM6A-LR",
  "MIROC6",
  "MRI-ESM2-0",
  "MeanCMIP6"
];

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

const regionOptions = {
  "Global - Land": "global",
  "Global - All": "globe",
  "South America - Amazon": "southamericaamazon"
};

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

var cmap = PuOr;
// if (document.getElementById("colorblind").checked) cmap = PuOr;

function mapToColor(value, cmap) {
  var clr = "#808080";
  var nc = cmap.length;
  if (value > -900) {
    var ae = Math.abs(value);
    var ind;
    if (ae >= 0.25) {
      ind = Math.round(2 * value + 4);
    } else {
      ind = Math.round(4 * value + 4);
    }
  }
  //Calculated index for colormap
  ind = Math.min(Math.max(ind, 0), nc - 1);
  console.log("color index:", ind);
  clr = isNaN(ind) ? clr : cmap[ind];
  // console.log("clr:", clr)
  return clr;
}

// function colorizeRow(row, table, scores, selectedRegion) {
//   let scalar_name = `${scores} ${selectedRegion.value}`;
//   console.log("scalar_name:", scalar_name);
//   let columns = response.data[row][scalar_name];
//   let newRow = table.insertRow(-1);

// }

function toggleChildrenRow(e) {
  console.log("parent row clicked", e);
}

function TableRow(props) {
  console.log("data:", props.data);
  // console.log("level:", props.level);
  let columns = props.data[props.row][props.scalar];
  let children = props.data[props.row].children;
  console.log("children:", children);
  return (
    <Fragment>
      <tr
        className={props.level}
        key={props.index}
        style={{
          backgroundColor: props.bgColor,
          display: props.level.includes("childDataset") ? "none" : "table-row"
        }}
        onClick={toggleChildrenRow}
      >
        <td className="row-label">{props.row}</td>
        {columns.map((column, i) => {
          console.log("column:", mapToColor(column, cmap));
          return (
            <td
              key={i}
              style={{
                backgroundColor: mapToColor(column, cmap)
              }}
            />
          );
        })}
      </tr>

      {Object.keys(children).map((child, j) => {
        // console.log("child:", child);
        let childLevel =
          props.level === "parent" ? "childVariable" : "childDataset";
        return (
          <TableRow
            key={props.row + " " + child}
            level={`${childLevel} ${props.row}`}
            bgColor={props.bgColor}
            data={props.data[props.row].children}
            row={child}
            columns={columns}
            index={j}
            scalar={props.scalar}
          />
        );
      })}
    </Fragment>
  );
}

function App() {
  // Declare a new state variable, which we'll call "count"
  // const [scores, setScores] = useState(["Spatial Distribution Score"]);

  const visualization = useRef(null);
  // const [{ data, loading, error }, refetch] = useAxios("test.json");
  const [scores, setScores] = useState("Overall Score");
  const [selectedRegion, setSelectedRegion] = useState({
    region: "Global - Land",
    value: "global"
  });
  const [rows, setRows] = useState("");

  // if (!loading) {
  //   console.log("json data:", data);
  //   console.log("data type:", typeof data);
  //   for (let h1 in data) {
  //     console.log("h1:", h1);
  //   }
  //   let tableRows = Object.keys(data).map((row, i) => {
  //     console.log("row:", row);
  //     console.log("scores:", scores);
  //     console.log("selectedRegion:", selectedRegion);
  //     let scalar_name = `${scores} ${selectedRegion.value}`;
  //     console.log("scalar_name:", scalar_name);
  //     // let columns = data[row][scalar_name]
  //     let columns = data[row][scalar_name];
  //     return (
  //       <tr
  //         className="parent"
  //         key={i}
  //         style={{ backgroundColor: scalarColorScale[row] }}
  //       >
  //         <td className="row-label">{row}</td>
  //         {columns.map((column, i) => {
  //           console.log("column:", mapToColor(column, cmap));
  //           return <td style={{ backgroundColor: mapToColor(column, cmap) }} />;
  //         })}
  //       </tr>
  //     );
  //   });

  //   console.log("rows:", rows);
  // }

  useEffect(() => {
    var table = document.getElementById("scoresTable");
    axios.get("scalars_test.json").then(response => {
      console.log("data:", response.data);
      let tableRows = Object.keys(response.data).map((row, i) => {
        console.log("row:", row);
        console.log("scores:", scores);
        console.log("selectedRegion:", selectedRegion);
        // colorizeRow(row, table, scores, selectedRegion);
        let scalar_name = `${scores} ${selectedRegion.value}`;
        console.log("scalar_name:", scalar_name);
        // let columns = data[row][scalar_name]
        let columns = response.data[row][scalar_name];
        let children = response.data[row].children;
        console.log("children:", children);

        // TODO: Break creating Table Rows into it's own component; Create list to hold the table rows returned from the function; Pass in parent row and loop over children rows passing them in to the function
        return (
          <TableRow
            key={row}
            level="parent"
            bgColor={scalarColorScale[row]}
            data={response.data}
            row={row}
            columns={columns}
            index={i}
            scalar={scalar_name}
          />
        );
      });
      console.log("rows:", rows);
      setRows(tableRows);
    });
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">CMEC</NavbarBrand>
      </Navbar>
      <h2>Scalars</h2>
      <div className="radio">
        {scalarOptions.map((scalar, i) => (
          <label key={scalar} className="radio-inline scalarLabel">
            <input
              key={scalar}
              type="radio"
              className="radioLabel"
              name="scalarRadio"
              checked={scores === scalar}
            />
            {scalar}
          </label>
        ))}
      </div>
      <h2>Regions</h2>
      <div className="radio">
        {Object.keys(regionOptions).map((region, i) => {
          console.log("region:", region);
          console.log("region value:", regionOptions[region]);
          return (
            <label key={region} className="radio-inline scalarLabel">
              <input
                type="radio"
                className="radioLabel"
                name="regionRadio"
                value={regionOptions[region]}
                checked={selectedRegion["region"] === region}
              />
              {region}
            </label>
          );
        })}
      </div>
      <Container>
        <div className="title">{title}</div>
        <table id="scoresTable" className="table-header-rotated">
          <thead>
            <tr>
              <th />
              {modelNames.map((model, i) => (
                <th key={model} className="rotate">
                  <div>{model}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </Container>
    </div>
  );
}

export default App;
