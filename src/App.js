import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import Header from "./Header.js";
import TableRow from "./TableRow.js";
import Table from "./Table.js";
import ColorLegend from "./ColorLegend.js";
import "./App.css";
import "./animate.css";
import { useGlobal } from "reactn";
import Hyperslabs from "./Hyperslabs.js";
import HyperslabSelector from "./HyperslabSelector.js";
import { modelNames } from "./constants.js";
import {
  formatRowLabel,
  findHierarchyLevel,
  getBackgroundColor,
  GlobalStyle
} from "./utils.js";

const CMEC_API_URL = "https://cmec-backend.herokuapp.com/api";
// const CMEC_API_URL = "http://localhost:5000/api";

const title = "CMEC Data Heatmap";

function App() {
  const [selectedScalar] = useGlobal("scalar");
  const [model] = useGlobal("model");
  const [metric] = useGlobal("metric");
  const [region] = useGlobal("region");
  const [rowsHyperslab] = useGlobal("rowsHyperslab");
  const [rowHyperslabDropdown] = useGlobal("rowHyperslabDropdown");
  const [columnHyperslabDropdown] = useGlobal("columnHyperslabDropdown");
  const [columnsHyperslab] = useGlobal("columnsHyperslab");
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
    model: ""
  };

  function handleSubmit(event) {
    let parameters = { ...initialState };
    const activeHyperslabs = [rowsHyperslab, columnsHyperslab];

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
      rows = Object.keys(response.data["RESULTS"][region.value]);
      data = response.data["RESULTS"][region.value];

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
    <div className="App">
      <GlobalStyle />
      <Header />
      <form onSubmit={handleSubmit}>
        <div className="columns is-centered is-vcentered">
          <div className="column is-10">
            <div className="columns is-multiline">
              <div className="column is-5">
                <Hyperslabs
                  hyperslabName="rowsHyperslab"
                  selectedHyperslab={rowsHyperslab}
                  title="Rows"
                />
              </div>
              <div className="column is-5">
                <HyperslabSelector selectedHyperslab={rowHyperslabDropdown} />
              </div>
              <div className="column is-5">
                <Hyperslabs
                  hyperslabName="columnsHyperslab"
                  selectedHyperslab={columnsHyperslab}
                  title="Columns"
                />
              </div>
              <div className="column is-5">
                <HyperslabSelector
                  selectedHyperslab={columnHyperslabDropdown}
                />
              </div>
            </div>
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
  );
}

export default App;
