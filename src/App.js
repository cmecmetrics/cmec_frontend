import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import axios from "axios";
import Header from "./Header.js";
import TableRow from "./TableRow.js";
import Scalars from "./Scalars.js";
import Regions from "./Regions.js";
import Table from "./Table.js";
import ColorLegend from "./ColorLegend.js";
import "./App.css";
import "./animate.css";
import { setGlobal, useGlobal } from "reactn";
import Hyperslabs from "./Hyperslabs.js";
import Models from "./Models.js";
import Metrics from "./Metrics.js";

// const CMEC_API_URL = "https://cmec-backend.herokuapp.com/api";
const CMEC_API_URL = "http://localhost:5000/api";

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

let metricOptions = [
  "Ecosystem and Carbon Cycle",
  "Hydrology Cycle",
  "Radiation and Energy Cycle",
  "Forcings",
  "Relationships"
];

let modelNames = [
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

const hyperslabOptions = ["region", "metric", "scalar", "model"];

setGlobal({
  scalar: "Overall Score",
  region: "global",
  hyperslabs: ["region", "scalar"],
  model: "bcc-csm1-1",
  metric: "Ecosystem and Carbon Cycle",
  tableHeaderValues: modelNames
});

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
  const [scalar, setScalar] = useGlobal("scalar");
  const [model, setModel] = useGlobal("model");
  const [metric, setMetric] = useGlobal("metric");
  const [selectedRegion, setSelectedRegion] = useGlobal("region");
  const [selectedHyperslab, setselectedHyperslab] = useGlobal("hyperslabs");
  const [rows, setRows] = useState("");
  const [apiParameters, setApiParameters] = useState({
    region: "global",
    metric: "",
    scalar: "Overall Score",
    model: ""
  });
  const [filter, setFilter] = useState("ALL_SCORES");
  const [hyperslabData, setHyperslabData] = useGlobal("hyperslabData");
  const [tableHeaderValues, setTableHeaderValues] = useGlobal(
    "tableHeaderValues"
  );

  function handleSubmit(event) {
    let parameters = {};
    if (selectedHyperslab.includes("region")) {
      parameters["region"] = selectedRegion;
    } else {
      parameters["region"] = "";
    }

    if (selectedHyperslab.includes("metric")) {
      parameters["metric"] = metric;
    } else {
      parameters["metric"] = "";
    }

    if (selectedHyperslab.includes("scalar")) {
      parameters["scalar"] = scalar;
    } else {
      parameters["scalar"] = "";
    }

    if (selectedHyperslab.includes("model")) {
      parameters["model"] = model;
      setTableHeaderValues([model]);
    } else {
      parameters["model"] = "";
      setTableHeaderValues(modelNames);
    }

    setApiParameters(parameters);
    axios
      .post(`${CMEC_API_URL}/hyperslab`, parameters)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    event.preventDefault();
  }

  useEffect(() => {
    axios.post(`${CMEC_API_URL}/hyperslab`, apiParameters).then(response => {
      let rows;
      let responseRegion;
      let data;
      if (!selectedRegion) {
        console.log("all regions selected");
      }
      console.log("selectedRegion:", selectedRegion);
      if (filter === "ALL_SCORES") {
        rows = Object.keys(response.data["RESULTS"][selectedRegion]);
        data = response.data["RESULTS"][selectedRegion];
      } else {
        data = response.data[selectedRegion];
        rows = Object.keys(responseRegion);
      }

      let tableRows = rows.map((row, i) => {
        let [rowLevel, hierarchyLevel] = findHierarchyLevel(row);
        let [rowLabel, parent] = formatRowLabel(rowLevel, row);
        let columns = data[row][scalar];

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
            scalar={scalar}
            models={modelNames}
            filter={filter}
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
          <div className="column">
            <Hyperslabs
              hyperslabOptions={hyperslabOptions}
              selectedHyperslab={selectedHyperslab}
            />
          </div>
        </div>
        <div className="columns controlColumn is-vcentered">
          {selectedHyperslab.includes("model") ? (
            <div className="column">
              <Models models={modelNames} scores={model} />
            </div>
          ) : null}

          {selectedHyperslab.includes("scalar") ? (
            <div className="column">
              <Scalars scalars={scalarOptions} scores={scalar} />
            </div>
          ) : null}

          {selectedHyperslab.includes("region") ? (
            <div className="column">
              <Regions
                regionOptions={regionOptions}
                selectedRegion={selectedRegion}
              />
            </div>
          ) : null}

          {selectedHyperslab.includes("metric") ? (
            <div className="column">
              <Metrics metrics={metricOptions} selectedMetric={metric} />
            </div>
          ) : null}
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
