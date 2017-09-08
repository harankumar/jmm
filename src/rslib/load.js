const fs = require('fs');

const imports = {
    "traits": [
        "to_bool",
        "to_num",
        "to_string",
        "type_of"
    ],
    "types": [
        "bool",
        "js_array",
        "js_float64array",
        "js_nan",
        "number",
        "string"
    ],
    "operators": [
        "logical"
    ],
    "globals": [
        "console"
    ]
};

module.exports = function () {
    let gen = "";

    for (let category of Object.keys(imports)) {
        for (let lib of imports[category]){
            const path = `./rslib/${category}/${lib}.rs`;
            gen += fs.readFileSync(path) + "\n\n";
        }
    }

    return gen;
};
