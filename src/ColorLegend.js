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


  function ColorLegend(){

    return(
        <Fragment>
            <table id="colorLegendTable">
                {cmap.map((color, i) => {
                return (
                    <tr>
                        <td
                        key={i}
                        style={{
                            backgroundColor: color
                        }}
                        />
                        { i == 0
                            ? <p class="colorLegendLabel">Worse Value</p>
                            : null
                        }
                        { i == cmap.length - 1
                            ? <p class="colorLegendLabel">Better Value</p>
                            : null
                        }
                    </tr>
                );
                })}
            </table>
            <table class="missingLegend">
                <tr>
                    <td style={{
                            backgroundColor: "#808080"
                        }}></td>
                    <p class="colorLegendLabel">Missing Data</p>
                </tr>
            </table>
    </Fragment>
    )

  }

  export default ColorLegend;