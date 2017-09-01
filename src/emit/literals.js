module.exports = {
    walkLiteral: walkLiteral
};

const walk = require('./emit').walk;
const type_infer = require('../types').infer;

function walkLiteral(astNode) {
    const val = astNode.value;
    switch (typeof val) {
    case "string":
        return `String::from("${val}")`;
    case "number":
        return `({${val} as f64})`;
    case "boolean":
        return val.toString();
    }
}
