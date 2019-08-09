import React, { Fragment, useRef, useEffect, useState } from "react";

function Regions(props) {
  return (
    <Fragment>
      <h2>Regions</h2>
      <div className="radio">
        {Object.keys(props.regionOptions).map((region, i) => {
          console.log("region:", region);
          console.log("region value:", props.regionOptions[region]);
          return (
            <label key={region} className="radio-inline scalarLabel">
              <input
                type="radio"
                className="radioLabel"
                name="regionRadio"
                value={props.regionOptions[region]}
                checked={props.selectedRegion["region"] === region}
              />
              {region}
            </label>
          );
        })}
      </div>
    </Fragment>
  );
}

export default Regions;
