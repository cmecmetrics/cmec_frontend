import React, { Fragment, useState } from "react";

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
  clr = isNaN(ind) ? clr : cmap[ind];
  return clr;
}

function toggleChildrenRow(e) {
  const category = e.currentTarget.dataset.category;
  let childLevel =
    e.currentTarget.className === "parent" ? "childVariable" : "childDataset";
  const childRows = document.getElementsByClassName(
    `${childLevel} ${category}`
  );
  for (var dataset of childRows) {
    if (dataset.style.display === "none") {
      dataset.style.display = "table-row";
    } else {
      dataset.style.display = "none";
    }
  }
}

/**
 * Create an array of the length of the number of models that fills each value with -999, the established placeholder
 * for a missing value in the dataset
 */
function handleMissingData(models, filter = undefined) {
  let model_object = {};
  for (let model of models) {
    model_object[model] = -999;
  }
  return model_object;
}

function findLevel(rowName) {
  var count = (rowName.match(/::/g) || []).length;
  console.log("Number of double colons:", count);
  return count;
}

function TableRow(props) {
  // console.log("props:", props);
  console.log("props.row:", props.row);
  console.log("Level:", findLevel(props.row));
  let rowLabel;
  let labelLevel = findLevel(props.row);
  if (labelLevel > 0) {
    let label = props.row.split("::");
    console.log("label:", label);
    let tabs = "\t".repeat(labelLevel);
    rowLabel = tabs + label.slice(-1)[0];
  } else {
    rowLabel = props.row;
  }
  let columns = props.columns;
  const [hovered, setHovered] = useState(false);
  const toggleHover = () => setHovered(!hovered);

  if (typeof columns === "undefined") {
    console.log("found missing data");
    columns = handleMissingData(props.models);
  }
  let children;
  if (props.data["metrics"]) {
    children = props.data["metrics"];
  } else if (props.data["observational_products"]) {
    children = props.data["observational_products"];
  }
  return (
    <Fragment>
      <tr
        className={`${props.level} ${hovered ? "hover" : ""}`}
        key={props.index}
        data-category={props.row}
        style={{
          backgroundColor: props.bgColor,
          display: props.level.includes("childDataset") ? "none" : "table-row"
        }}
        onClick={toggleChildrenRow}
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
      >
        <td className="row-label">{rowLabel}</td>
        {Object.keys(columns).map((column, i) => {
          return (
            <td
              key={i}
              id={`${props.row.split(" ").join("_")}_${props.models[i]}`}
              data-score={column}
              style={{
                backgroundColor: mapToColor(columns[column], cmap)
              }}
              title={columns[column]}
            />
          );
        })}
      </tr>

      {Object.keys(children || {}).map((child, j) => {
        let childLevel =
          props.level === "parent" ? "childVariable" : "childDataset";

        console.log("child:", child);
        console.log("props.data:", props.data);
        let columnData;
        if (props.data["metrics"]) {
          columnData = props.data["metrics"][child]["scores"][props.scalar];
        } else if (props.data["observational_products"]) {
          columnData =
            props.data["observational_products"][child]["scores"][props.scalar];
        } else {
          columnData = props.data["scores"];
        }

        return (
          <TableRow
            key={props.row + " " + child}
            level={`${childLevel} ${props.row}`}
            bgColor={props.bgColor}
            data={
              props.data["metrics"]
                ? props.data["metrics"][child]
                : props.data["observational_products"][child]
            }
            row={child}
            columns={columnData}
            index={j}
            scalar={props.scalar}
            models={props.models}
            filter={props.filter}
          />
        );
      })}
    </Fragment>
  );
}

export default TableRow;
