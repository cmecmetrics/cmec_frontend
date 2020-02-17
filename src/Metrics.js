import React, { Fragment, useContext } from "react";
import { useGlobal } from "reactn";
import Select from "react-select";

function Metrics(props) {
  const [metric, setMetric] = useGlobal("metric");
  let metrics = [];

  function updateMetric(metric) {
    setMetric(metric.label);
  }

  for (let metric of props.metrics) {
    var lastIndex = metric.lastIndexOf(" ");
    let value = metric.substring(0, lastIndex);
    metrics.push({ label: metric, value: value });
  }
  return (
    <Fragment>
      <h2>Metrics</h2>
      <div className="text-center">
        <Select
          onChange={updateMetric}
          options={metrics}
          value={{ label: metric, value: metric }}
        />
      </div>
    </Fragment>
  );
}

export default Metrics;
