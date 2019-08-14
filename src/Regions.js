import React, { Fragment, useRef, useEffect, useState } from "react";
import { setGlobal, useGlobal } from "reactn";

function Regions(props) {
  const [selectedRegion, setselectedRegion] = useGlobal("region");

  console.log("selectedRegion:", selectedRegion);

  function updateRegion(changeEvent) {
    console.log("inside setselectedRegion");
    console.log("changeEvent.target:", changeEvent.target.value);
    setselectedRegion(changeEvent.target.value);
  }
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
                checked={selectedRegion === props.regionOptions[region]}
                onChange={updateRegion}
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
