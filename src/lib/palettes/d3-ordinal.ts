// Adapt D3 categorical schemes into shared scale data.
// Each scheme stays an ordered list of hex colors.
import * as D3Ordinal from "d3-scale-chromatic";

const schemes = {
  category10: D3Ordinal.schemeCategory10,
  accent: D3Ordinal.schemeAccent,
  dark2: D3Ordinal.schemeDark2,
  observable10: D3Ordinal.schemeObservable10,
  paired: D3Ordinal.schemePaired,
  pastel1: D3Ordinal.schemePastel1,
  pastel2: D3Ordinal.schemePastel2,
  set1: D3Ordinal.schemeSet1,
  set2: D3Ordinal.schemeSet2,
  set3: D3Ordinal.schemeSet3,
  tableau10: D3Ordinal.schemeTableau10,
};

export default schemes;
