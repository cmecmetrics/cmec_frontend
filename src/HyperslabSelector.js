import React, { Fragment, useContext } from "react";
import { useGlobal } from "reactn";
import * as bulmaToast from "bulma-toast";
import hyperslabContext from "./context/hyperslabContext";
import {
  modelNames,
  regionOptions,
  metricOptions,
  hyperslabOptions,
  scalarOptions
} from "./constants.js";
import Models from "./Models.js";
import Scalars from "./Scalars.js";
import Regions from "./Regions.js";
import Metrics from "./Metrics.js";

function HyperslabSelector(props) {
  const context = useContext(hyperslabContext);
  console.log("context.hyperslabs:", context.hyperslabs);

  return (
    <div className="columns controlColumn is-vcentered">
      {context.hyperslabs["model"] ? (
        <div className="column">
          <Models models={modelNames} />
        </div>
      ) : null}

      {context.hyperslabs["scalar"] ? (
        <div className="column">
          <Scalars
            scalars={scalarOptions}
            scores={context.hyperslabs["scalar"]}
          />
        </div>
      ) : null}

      {context.hyperslabs["region"] ? (
        <div className="column">
          <Regions
            regionOptions={regionOptions}
            selectedRegion={context.hyperslabs["region"]}
          />
        </div>
      ) : null}

      {context.hyperslabs["metric"] ? (
        <div className="column">
          <Metrics
            metrics={metricOptions}
            selectedMetric={context.hyperslabs["metric"]}
          />
        </div>
      ) : null}
      <div className="column has-text-centered">
        <input class="button is-primary" type="submit" value="Update Plot" />
      </div>
    </div>
  );
}

export default HyperslabSelector;
