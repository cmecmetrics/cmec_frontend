import React, { Fragment } from "react";
import { useGlobal } from "reactn";

function Regions(props) {
  const [selectedRegion, setselectedRegion] = useGlobal("region");

  function updateRegion(changeEvent) {
    setselectedRegion(changeEvent.target.value);
  }
  return (
    <Fragment>
      <h2>Regions</h2>
      <div className="radio">
        {Object.keys(props.regionOptions).map((region, i) => {
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
