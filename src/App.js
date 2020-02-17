import React, { useEffect, useState, useReducer } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import Header from "./Header.js";
import TableRow from "./TableRow.js";
import Table from "./Table.js";
import ColorLegend from "./ColorLegend.js";
import "./App.css";
import "./animate.css";
import { setGlobal, useGlobal, getGlobal } from "reactn";
import Hyperslabs from "./Hyperslabs.js";
import HyperslabSelector from "./HyperslabSelector.js";
import { modelNames } from "./constants.js";

import hyperslabContext from "./context/hyperslabContext";
import hyperslabReducer from "./context/hyperslabReducer";
import {
  UPDATE_X_HYPERSLAB,
  UPDATE_Y_HYPERSLAB,
  UPDATE_METRIC
} from "./context/types";

// const CMEC_API_URL = "https://cmec-backend.herokuapp.com/api";
const CMEC_API_URL = "http://localhost:5000/api";

const width = 1000;
const height = 600;
const black = "#333333";
const title = "CMEC Data Heatmap";

function getBackgroundColor(rowName) {
  if (rowName.includes("Ecosystem and Carbon Cycle")) {
    return "#ECFFE6";
  }
  if (rowName.includes("Hydrology Cycle")) {
    return "#E6F9FF";
  }
  if (rowName.includes("Radiation and Energy Cycle")) {
    return "#FFECE6";
  }
  if (rowName.includes("Forcings")) {
    return "#EDEDED";
  }
  if (rowName.includes("Relationships")) {
    return "#fff2e5";
  }
}

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
  height: 62px;
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
@media all and (min-width: 1216px) {
  td.row-label {
    width: 20%;
  }
 }

td.row-label {
  width: 30%;
}
`;

export const Visualization = styled.div`
  justify-self: center;
  width: ${width}px;
  height: ${height}px;
`;

function findHierarchyLevel(rowName) {
  var count = (rowName.match(/::/g) || []).length;
  let hierarchyLevel;
  if (count === 0) {
    hierarchyLevel = "parent";
  } else if (count === 1) {
    hierarchyLevel = "childVariable";
  } else if (count === 2) {
    hierarchyLevel = "childDataset";
  }
  return [count, hierarchyLevel];
}

function formatRowLabel(rowLevel, row) {
  let rowLabel;
  let parent = "";
  if (rowLevel > 0) {
    let label = row.split("::");
    let tabs = "\t".repeat(rowLevel);
    rowLabel = tabs + label.slice(-1)[0];
    parent = label.slice(-2)[0];
  } else {
    rowLabel = row;
  }
  return [rowLabel, parent];
}

function App() {
  const [selectedScalar] = useGlobal("scalar");
  const [model] = useGlobal("model");
  const [metric] = useGlobal("metric");
  const [region] = useGlobal("region");
  const [hyperslab1] = useGlobal("hyperslab1");
  const [hyperslab2] = useGlobal("hyperslab2");
  const [rows, setRows] = useState("");
  const [apiParameters, setApiParameters] = useState({
    region: "global",
    metric: "",
    scalar: "Overall Score",
    model: ""
  });
  const [tableHeaderValues, setTableHeaderValues] = useGlobal(
    "tableHeaderValues"
  );

  const initialState = {
    region: "",
    metric: "",
    scalar: "",
    model: "",
    xAxisHyperslab: "scalar",
    yAxisHyperslab: "region"
  };
  const [state, dispatch] = useReducer(hyperslabReducer, initialState);

  const updateHyperslabX = hyperslabs => {
    dispatch({
      type: UPDATE_X_HYPERSLAB,
      payload: hyperslabs
    });
  };

  const updateHyperslabY = hyperslabs => {
    dispatch({
      type: UPDATE_Y_HYPERSLAB,
      payload: hyperslabs
    });
  };

  const updateMetric = metric => {
    dispatch({
      type: UPDATE_METRIC,
      payload: metric
    });
  };

  function handleSubmit(event) {
    let parameters = { ...initialState };
    const activeHyperslabs = [hyperslab1, hyperslab2];

    if (activeHyperslabs.includes("region")) {
      parameters["region"] = region;
    }

    if (activeHyperslabs.includes("metric")) {
      parameters["metric"] = metric;
    }

    if (activeHyperslabs.includes("scalar")) {
      parameters["scalar"] = selectedScalar;
    }

    if (activeHyperslabs.includes("model")) {
      parameters["model"] = model;
      setTableHeaderValues([model]);
    } else {
      parameters["model"] = "";
      setTableHeaderValues(modelNames);
    }

    setApiParameters(parameters);
    event.preventDefault();
  }

  useEffect(() => {
    axios.post(`${CMEC_API_URL}/hyperslab`, apiParameters).then(response => {
      let rows;
      let data;
      if (!region) {
        // console.log("all regions selected");
      }
      console.log("region:", region);
      rows = Object.keys(response.data["RESULTS"][region]);
      data = response.data["RESULTS"][region];

      let tableRows = rows.map((row, i) => {
        // console.log("row:", row);
        let [rowLevel, hierarchyLevel] = findHierarchyLevel(row);
        let [rowLabel, parent] = formatRowLabel(rowLevel, row);
        let columns = data[row][selectedScalar];
        // console.log("columns:", columns);

        return (
          <TableRow
            key={row}
            level={hierarchyLevel}
            parent={parent}
            bgColor={getBackgroundColor(row)}
            data={data[row]}
            row={rowLabel}
            columns={columns}
            index={i}
            scalar={selectedScalar}
            models={modelNames}
          />
        );
      });
      setRows(tableRows);
    });
  }, [apiParameters]);

  return (
    <hyperslabContext.Provider
      value={{
        xAxisHyperslab: state.xAxisHyperslab,
        yAxisHyperslab: state.yAxisHyperslab,
        hyperslabs: apiParameters,
        updateHyperslabX,
        updateHyperslabY,
        updateMetric
      }}
    >
      <div className="App">
        <GlobalStyle />
        <Header />
        <form onSubmit={handleSubmit}>
          <div className="columns is-centered is-vcentered">
            <div className="column">
              <Hyperslabs
                hyperslabName="hyperslab1"
                selectedHyperslab={hyperslab1}
                title="X Axis Hyperslabs"
              />
            </div>
            <div className="column">
              <HyperslabSelector
                hyperslabName="xAxisHyperslab"
                selectedHyperslab={hyperslab1}
                hyperslabOptions={initialState.xAxisHyperslab}
              />
            </div>
          </div>
          <div className="columns is-centered is-vcentered">
            <div className="column">
              <Hyperslabs
                hyperslabName="hyperslab2"
                selectedHyperslab={hyperslab2}
                title="Y Axis Hyperslabs"
              />
            </div>
            <div className="column">
              <HyperslabSelector
                hyperslabName="yAxisHyperslab"
                selectedHyperslab={hyperslab2}
                hyperslabOptions={initialState.yAxisHyperslab}
              />
            </div>
            <div className="column has-text-centered">
              <input
                class="button is-primary"
                type="submit"
                value="Update Plot"
              />
            </div>
          </div>
        </form>
        <div className="columns is-mobile is-centered is-vcentered tableColumn">
          <div className="column is-four-fifths">
            <Table
              title={title}
              tableHeaderValues={tableHeaderValues}
              rows={rows}
            />
          </div>
          <div className="column is-2-widescreen has-text-centered">
            <p>Relative Scale</p>
            <ColorLegend />
          </div>
        </div>
      </div>
    </hyperslabContext.Provider>
  );
}

export default App;
