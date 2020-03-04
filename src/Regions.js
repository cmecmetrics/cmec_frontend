import React, { Fragment } from "react";
import { useGlobal } from "reactn";
import Select from "react-select";

function Regions(props) {
  const [selectedRegion, setselectedRegion] = useGlobal("region");
  let regions = [];

  function updateRegion(region) {
    console.log("region select:", region);
    setselectedRegion(region);
  }
  for (let region of props.regions) {
    regions.push({
      label: Object.keys(region)[0],
      value: Object.values(region)[0]
    });
  }
  return (
    <Fragment>
      <h2>Regions</h2>
      <div className="text-center">
        <Select
          onChange={updateRegion}
          options={regions}
          value={{ label: selectedRegion.label, value: selectedRegion.value }}
        />
      </div>
    </Fragment>
  );
}

export default Regions;
