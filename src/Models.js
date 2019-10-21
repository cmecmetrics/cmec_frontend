import React, { Fragment } from "react";
import { useGlobal } from "reactn";
import Select from "react-select";

function Models(props) {
  const [model, setModel] = useGlobal("model");
  let models = [];

  function updateModel(model) {
    setModel(model.label);
  }

  for (let model of props.models) {
    var lastIndex = model.lastIndexOf(" ");
    let value = model.substring(0, lastIndex);
    models.push({ label: model, value: value });
  }
  return (
    <Fragment>
      <h2>Models</h2>
      <div className="text-center">
        <Select
          onChange={updateModel}
          options={models}
          value={{ label: model, value: model }}
        />
      </div>
    </Fragment>
  );
}

export default Models;
