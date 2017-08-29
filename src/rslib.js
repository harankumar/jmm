const fs = require('fs');

const imports = [
  "jmm_js_object",
  "console",
  "logical_operators"
];

module.exports = function() {
  let lib = "";

  for (let imp of Array.from(imports)) {
    const path = `./rslib/${imp}.rs`;
    lib += fs.readFileSync(path) + "\n\n";
  }

  return lib;
};
