import React, { Fragment } from "react";
import { useGlobal } from "reactn";
import * as bulmaToast from "bulma-toast";

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
  const [selectedHyperslab, setselectedHyperslab] = useGlobal("hyperslabs");
  let selectedCheckboxes = document.querySelectorAll(
    "input[type=checkbox]:checked"
  );

  function updateHyperslab(changeEvent) {
    let targetID = changeEvent.target.id;
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
      <h2>Hyperslabs</h2>
      <div className="radio">
        {props.hyperslabOptions.map((hyperslab, i) => {
          let checked = selectedHyperslab.includes(hyperslab);
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
