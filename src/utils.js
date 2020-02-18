import styled, { createGlobalStyle } from "styled-components";

export function formatRowLabel(rowLevel, row) {
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

export function findHierarchyLevel(rowName) {
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

export function getBackgroundColor(rowName) {
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

const width = 1000;
const height = 600;
const black = "#333333";

export const Visualization = styled.div`
  justify-self: center;
  width: ${width}px;
  height: ${height}px;
`;

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
