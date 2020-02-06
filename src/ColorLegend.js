import React, { Fragment } from "react";

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

function ColorLegend() {
  return (
    <Fragment>
      <table id="colorLegendTable">
        <tbody>
          {cmap.map((color, i) => {
            return (
              <tr>
                <td
                  key={i}
                  style={{
                    backgroundColor: color
                  }}
                />
                {i === 0 ? (
                  <span className="colorLegendLabel">Worse Value</span>
                ) : null}
                {i === cmap.length - 1 ? (
                  <span className="colorLegendLabel">Better Value</span>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
      <table className="missingLegend">
        <tbody>
          <tr>
            <td
              style={{
                backgroundColor: "#808080"
              }}
            ></td>
            <span className="colorLegendLabel">Missing Data</span>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
}

export default ColorLegend;
