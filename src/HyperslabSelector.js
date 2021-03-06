import React from "react";
import {
  modelNames,
  regionOptions,
  metricOptions,
  scalarOptions
} from "./constants.js";
import Models from "./Models.js";
import Scalars from "./Scalars.js";
import Regions from "./Regions.js";
import Metrics from "./Metrics.js";

function HyperslabSelector(props) {
  return (
    <div className="columns controlColumn is-vcentered">
      {props.selectedHyperslab === "model" ? (
        <div className="column">
          <Models models={modelNames} />
        </div>
      ) : null}

      {props.selectedHyperslab === "scalar" ? (
        <div className="column">
          <Scalars
            scalars={scalarOptions}
            scores={props.hyperslabOptions["scalar"]}
          />
        </div>
      ) : null}

      {props.selectedHyperslab === "region" ? (
        <div className="column">
          <Regions
            regionOptions={regionOptions}
            selectedRegion={props.hyperslabOptions["region"]}
          />
        </div>
      ) : null}

      {props.selectedHyperslab === "metric" ? (
        <div className="column">
          <Metrics
            metrics={metricOptions}
            selectedMetric={props.hyperslabOptions["metric"]}
          />
        </div>
      ) : null}
    </div>
  );
}

export default HyperslabSelector;
