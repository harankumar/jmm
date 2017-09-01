const fs = require('fs');

const imports = [
    // TYPES
    "nan",
    // TRAITS
    "jmm_js_object",
    "to_num",
    // OPERATORS
    "logical_operators",
    // STATIC VARIABLES
    "console"
];

module.exports = function() {
    let lib = "";

    for (let imp of Array.from(imports)) {
        const path = `./rslib/${imp}.rs`;
        lib += fs.readFileSync(path) + "\n\n";
    }

    return lib;
};
