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
import { setGlobal, useGlobal } from "reactn";

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
td.row-label {
  width: 325px;
}
`;

export const Visualization = styled.div`
  justify-self: center;
  width: ${width}px;
  height: ${height}px;
  // 6
`;

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

setGlobal({
  scalar: "Overall Score",
  region: "global"
});

function App() {
  const [scalar, setScalar] = useGlobal("scalar");
  const [selectedRegion, setSelectedRegion] = useGlobal("region");
  const [rows, setRows] = useState("");
  const [filter, setFilter] = useState("ALL_SCORES");

  useEffect(() => {
    axios
      // .get("ALL_SCORES_bcc-csm1-1_southamericaamazon.json")
      .get("ALL_REGIONS_Ecosystem and Carbon Cycle.json")
      // .get("sample.json")
      // .get("scalars_test.json")
      .then(response => {
        let rows;
        let responseRegion;
        let data;
        if (filter === "ALL_SCORES") {
          rows = Object.keys(response.data);
          data = response.data;
          modelNames = ["bcc_csm1-1"];
        } else {
          data = response.data[selectedRegion];
          rows = Object.keys(responseRegion);
        }
        let tableRows = rows.map((row, i) => {
          console.log("row:", row);
          let columns = data[row]["scores"][scalar];

          return (
            <TableRow
              key={row}
              level="parent"
              bgColor={scalarColorScale[row]}
              data={data[row]}
              row={row}
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
  }, [scalar, selectedRegion]);

  return (
    <div className="App">
      <GlobalStyle />
      <Header />
      <div className="columns controlColumn">
        <div className="column">
          <Scalars scalars={scalarOptions} scores={scalar} />
        </div>
        <div className="column">
          <Regions
            regionOptions={regionOptions}
            selectedRegion={selectedRegion}
          />
        </div>
      </div>
      <div className="columns is-mobile is-centered is-vcentered tableColumn">
        <div className="column is-four-fifths">
          <Table title={title} modelNames={modelNames} rows={rows} />
        </div>
        <div className="column has-text-centered">
          <p>Relative Scale</p>
          <ColorLegend />
        </div>
      </div>
    </div>
  );
}

export default App;
