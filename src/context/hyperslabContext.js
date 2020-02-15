import { createContext } from "react";

const hyperslabContext = createContext({
  hyperslabs: [],
  updateHyperslabs: hyperslab => {}
});

export default hyperslabContext;
