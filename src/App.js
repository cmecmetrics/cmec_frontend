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
import HyperslabAxisRadioSelector from "./Hyperslabs.js";
import HyperslabSelector from "./HyperslabSelector.js";
import { modelNames, regionOptions } from "./constants.js";
import {
  formatRowLabel,
  findHierarchyLevel,
  getBackgroundColor,
  GlobalStyle
} from "./utils.js";

// const CMEC_API_URL = "https://cmec-backend.herokuapp.com/api";
const CMEC_API_URL = "http://localhost:5000/api";

const title = "CMEC Data Heatmap";

function App() {
  const [selectedScalar] = useGlobal("scalar");
  const [model] = useGlobal("model");
  const [metric] = useGlobal("metric");
  const [region] = useGlobal("region");
  const [hyperslabs] = useGlobal("hyperslabs");
  const [availableHyperslabs] = useGlobal("availableHyperslabs");
  const [rowsHyperslab] = useGlobal("rowsHyperslab");
  const [rowHyperslabDropdown] = useGlobal("rowHyperslabDropdown");
  const [columnHyperslabDropdown] = useGlobal("columnHyperslabDropdown");
  const [columnsHyperslab] = useGlobal("columnsHyperslab");
  const [rows, setRows] = useState({});
  const [apiParameters, setApiParameters] = useState({
    region: { label: "Global - Land", value: "global" },
    metric: "",
    scalar: "Overall Score",
    model: ""
  });
  const [tableHeaderValues, setTableHeaderValues] = useGlobal(
    "tableHeaderValues"
  );
  const [global, setGlobal] = useGlobal();

  const initialState = {
    region: "",
    metric: "",
    scalar: "",
    model: ""
  };

  function handleSubmit(event) {
    let parameters = { ...initialState };
    const activeHyperslabs = [rowsHyperslab, columnsHyperslab];
    console.log("activeHyperslabs:", activeHyperslabs);
    console.log("availableHyperslabs:", availableHyperslabs);
    // for (const activeHyperslab of activeHyperslabs) {
    //   console.log("activeHyperslab:", activeHyperslab);
    //   setGlobal({
    //     [activeHyperslab]: ""
    //   });
    // }

    if (availableHyperslabs.includes("region")) {
      console.log("region in handleSubmit:", region);
      parameters["region"] = region;
    }

    if (availableHyperslabs.includes("metric")) {
      parameters["metric"] = metric;
    }

    if (availableHyperslabs.includes("scalar")) {
      parameters["scalar"] = selectedScalar;
    }

    if (availableHyperslabs.includes("model")) {
      parameters["model"] = model;
      setTableHeaderValues([model]);
    } else {
      parameters["model"] = "";
      setTableHeaderValues(modelNames);
    }

    setApiParameters(parameters);
    event.preventDefault();
  }

  function createTableRows(data, rows) {
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
    console.log("tableRows:", tableRows);
    return tableRows;
  }

  useEffect(() => {
    axios.post(`${CMEC_API_URL}/hyperslab`, apiParameters).then(response => {
      let responseRows;
      let data;
      let responseRegion;
      let dataByRegion = {};
      console.log("apiParameters in response:", apiParameters);
      if (!apiParameters["region"]) {
        console.log("all regions selected");
        responseRegion = Object.keys(response.data["RESULTS"]);
        console.log("responseRegion:", responseRegion);
        for (const regionName of responseRegion) {
          // console.log("regionName:", regionName);
          data = response.data["RESULTS"][regionName];
          responseRows = Object.keys(response.data["RESULTS"][regionName]);
          dataByRegion[regionName] = createTableRows(data, responseRows);
          // console.log("dataByRegion:", dataByRegion);

          // setRows(newMessageObj);
          // console.log("rows:", rows);
        }
        setRows(dataByRegion);
      } else {
        console.log("response:", response);
        console.log("region:", region);
        responseRegion = Object.keys(response.data["RESULTS"])[0];
        // console.log("responseRegion:", responseRegion);
        responseRows = Object.keys(response.data["RESULTS"][responseRegion]);
        // console.log("responseRows:", responseRows);
        data = response.data["RESULTS"][responseRegion];

        const newMessageObj = {
          [responseRegion]: createTableRows(data, responseRows)
        };
        console.log("newMessageObj:", newMessageObj);
        setRows(newMessageObj);
        // console.log("rows:", rows);
      }
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
                <HyperslabAxisRadioSelector
                  hyperslabName="rowsHyperslab"
                  selectedHyperslab={rowsHyperslab}
                  hyperslabDropdown={"rowHyperslabDropdown"}
                  title="Rows"
                />
              </div>
              <div className="column is-5">
                <HyperslabSelector
                  selectedHyperslab={availableHyperslabs[0]}
                  hyperslabAxis={"rowHyperslabDropdown"}
                />
              </div>
              <div className="column is-5">
                <HyperslabAxisRadioSelector
                  hyperslabName="columnsHyperslab"
                  selectedHyperslab={columnsHyperslab}
                  hyperslabDropdown={"columnHyperslabDropdown"}
                  title="Columns"
                />
              </div>
              <div className="column is-5">
                <HyperslabSelector
                  selectedHyperslab={availableHyperslabs[1]}
                  hyperslabAxis={"columnHyperslabDropdown"}
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
          {Object.keys(rows).map((hyperslabRegion, i) => {
            console.log("hyperslabRegion:", hyperslabRegion);
            console.log("rows[hyperslabRegion]:", rows[hyperslabRegion]);
            return (
              <Table
                title={title}
                tableHeaderValues={tableHeaderValues}
                rows={rows[hyperslabRegion]}
              />
            );
          })}
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
