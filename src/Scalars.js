import React, { Fragment, useRef, useEffect, useState } from "react";

function Scalars(props) {
  console.log("props.scalars:", props);
  return (
    <Fragment>
      <h2>Scalars</h2>
      <div className="radio">
        {props.scalars.map((scalar, i) => (
          <label key={scalar} className="radio-inline scalarLabel">
            <input
              key={scalar}
              type="radio"
              className="radioLabel"
              name="scalarRadio"
              checked={props.scores === scalar}
            />
            {scalar}
          </label>
        ))}
      </div>
    </Fragment>
  );
}

export default Scalars;
