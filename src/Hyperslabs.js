import React, { Fragment, useContext } from "react";
import { useGlobal } from "reactn";
import * as bulmaToast from "bulma-toast";
import hyperslabContext from "./context/hyperslabContext";

function showCheckboxErrorMessage() {
  bulmaToast.toast({
    message: "A maximum of 2 hyperslabs can be selected at a time.",
    type: "is-danger",
    duration: 2000,
    position: "bottom-center",
    closeOnClick: true,
    dismissible: true,
    animate: { in: "fadeIn", out: "fadeOut" }
  });
}

function Hyperslabs(props) {
  const context = useContext(hyperslabContext);
  console.log("context.hyperslabs:", context.hyperslabs);
  const [selectedHyperslab, setselectedHyperslab] = useGlobal("hyperslabs");
  console.log("selectedHyperslab:", selectedHyperslab);

  function updateHyperslab(changeEvent) {
    let targetID = changeEvent.target.id;
    console.log("targetID:", targetID);
    console.log("context.hyperslabs[targetID]:", context.hyperslabs[targetID]);
    if (selectedHyperslab.includes(targetID)) {
      setselectedHyperslab(
        selectedHyperslab.filter(
          arrayItem => arrayItem !== changeEvent.target.id
        )
      );
      return;
    }
    let selectedCheckboxes = document.querySelectorAll(
      "input[type=checkbox]:checked"
    );
    let queue = Array.from(selectedCheckboxes);
    if (queue.length > 2) {
      showCheckboxErrorMessage();
      return;
    } else {
      let tempArr = [...selectedHyperslab];
      tempArr.push(targetID);
      setselectedHyperslab(tempArr);
    }
  }
  return (
    <Fragment>
      <h2>{props.title}</h2>
      <div className="radio">
        {Object.keys(context.hyperslabs).map((hyperslab, i) => {
          console.log("hyperslab in map:", hyperslab);
          // let checked = selectedHyperslab.includes(hyperslab);
          let checked = context.hyperslabs[hyperslab];
          return (
            <Fragment>
              <input
                className="is-checkradio"
                id={hyperslab}
                type="checkbox"
                name={`${hyperslab}Checkbox`}
                checked={checked}
                onChange={updateHyperslab}
              />
              <label key={hyperslab} for={hyperslab} className="label_checkbox">
                {hyperslab}
              </label>
            </Fragment>
          );
        })}
      </div>
    </Fragment>
  );
}

export default Hyperslabs;
