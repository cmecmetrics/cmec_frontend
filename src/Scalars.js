import React, { Fragment, useRef, useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import "./react_select_search.css";

function Scalars(props) {
  console.log("props.scalars:", props);
  let scalars = [];

  for (let scalar of props.scalars) {
    var lastIndex = scalar.lastIndexOf(" ");
    let value = scalar.substring(0, lastIndex);
    scalars.push({ name: scalar, value: value });
  }
  console.log("scalars:", scalars);
  return (
    <Fragment>
      <h2>Scalars</h2>
      <div className="text-center">
        <SelectSearch
          options={scalars}
          value="Spatial Distribution"
          name="scalars"
          placeholder="Choose a scalar"
        />
      </div>
    </Fragment>
  );
}

export default Scalars;
