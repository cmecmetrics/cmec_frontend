import React, { useEffect, useState } from "react";
import {
  modelNames,
  regionOptions,
  metricOptions,
  hyperslabOptions,
  scalarOptions
} from "./constants.js";

function UpdatePlotForm(props) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="columns is-centered is-vcentered">
        <div className="column">
          <Hyperslabs
            hyperslabOptions={hyperslabOptions}
            selectedHyperslab={selectedHyperslab}
          />
        </div>
      </div>
      <div className="columns controlColumn is-vcentered">
        {selectedHyperslab.includes("model") ? (
          <div className="column">
            <Models models={modelNames} scores={model} />
          </div>
        ) : null}

        {selectedHyperslab.includes("scalar") ? (
          <div className="column">
            <Scalars scalars={scalarOptions} scores={scalar} />
          </div>
        ) : null}

        {selectedHyperslab.includes("region") ? (
          <div className="column">
            <Regions
              regionOptions={regionOptions}
              selectedRegion={selectedRegion}
            />
          </div>
        ) : null}

        {selectedHyperslab.includes("metric") ? (
          <div className="column">
            <Metrics metrics={metricOptions} selectedMetric={metric} />
          </div>
        ) : null}
        <div className="column has-text-centered">
          <input class="button is-primary" type="submit" value="Update Plot" />
        </div>
      </div>
    </form>
  );
}

export default UpdatePlotForm;
