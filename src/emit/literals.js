module.exports = {
    walkLiteral: walkLiteral
};

const walk = require('./emit').walk;
const type_infer = require('../utils/types').infer;

function walkLiteral(astNode) {
    const val = astNode.value;
    switch (typeof val) {
        case "string":
            return `String::from("${val}")`;
        case "number":
            return walkNumberLiteral(val);
        case "boolean":
            return val.toString();
    }
}

function walkNumberLiteral(val) {
    // Check if it's a double
    // If it is, just return it
    // If it can be converted to f64 easily, do so
    // Otherwise, cast

    val = val.toString();

    let simple_double = val.match(/[0-9]+\.[0-9]*/g);
    if (simple_double && simple_double.length === 1 && simple_double[0] === val)
        return val;

    let simple_int = val.match(/[0-9]+/g);
    if (simple_int && simple_int.length === 1 && simple_int[0] === val)
        return val + ".0";

    return `({${val} as f64})`;
}