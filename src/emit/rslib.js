const fs = require('fs');

// TODO -- nest this stuff

const imports = [
    // TRAITS
    "traits/to_bool",
    "traits/to_num",
    "traits/to_string",
    "traits/type_of",
    // TYPES
    "types/bool",
    "types/js_array",
    "types/js_nan",
    "types/number",
    "types/string",
    // OPERATORS
    "operators/logical",
    // GLOBALS
    "globals/console"
];

module.exports = function () {
    let lib = "";

    for (let imp of Array.from(imports)) {
        const path = `./rslib/${imp}.rs`;
        lib += fs.readFileSync(path) + "\n\n";
    }

    return lib;
};
