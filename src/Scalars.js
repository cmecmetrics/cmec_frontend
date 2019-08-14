import React, { Fragment, useRef, useEffect, useState } from "react";
import { setGlobal, useGlobal } from "reactn";
// import SelectSearch from "react-select-search";
import Select from "react-select";
// import "./react_select_search.css";

function Scalars(props) {
  console.log("props.scalars:", props);
  const [scalar, setScalar] = useGlobal("scalar");
  let scalars = [];

  console.log("initial scalar:", scalar);

  function updateScalar(scalar) {
    console.log("inside updateScalar");
    setScalar(scalar.label);
    console.log(`Option selected:`, scalar);
  }

  for (let scalar of props.scalars) {
    var lastIndex = scalar.lastIndexOf(" ");
    let value = scalar.substring(0, lastIndex);
    scalars.push({ label: scalar, value: value });
  }
  console.log("scalars:", scalars);
  return (
    <Fragment>
      <h2>Scalars</h2>
      <div className="text-center">
        <Select onChange={updateScalar} options={scalars} value={scalar} />
      </div>
    </Fragment>
  );
}

export default Scalars;
