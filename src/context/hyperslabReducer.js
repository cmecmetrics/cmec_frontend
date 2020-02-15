import { UPDATE_HYPERSLAB } from "./types";

const updateHyperslab = (updatedHyperslabs, state) => {
  const newHyperslabs = updatedHyperslabs;
  //   const defaultConfig = {
  //     width: 10,
  //     newLine: "\n",
  //     indent: ""
  //   };
  return { ...state, hyperslabs: newHyperslabs };
};

export default (state, action) => {
  switch (action.type) {
    case UPDATE_HYPERSLAB:
      return updateHyperslab(action.payload, state);
    default:
      return state;
  }
};
