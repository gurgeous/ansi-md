// Registry for generated-code languages.
// Each entry is one concrete target language renderer.

import go from "./go.ts";
import json from "./json.ts";
import python from "./python.ts";
import ruby from "./ruby.ts";
import rust from "./rust.ts";
import typescript from "./typescript.ts";
import zig from "./zig.ts";

export const languages = [go, json, python, ruby, rust, typescript, zig];
