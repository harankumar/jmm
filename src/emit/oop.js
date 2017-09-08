module.exports = {
    walkNewExpression: walkNewExpression
};

const walk = require('./emit').walk;
const mangle = require('../utils/mangle').mangleIdentifier;

// const type_infer = require('../types').infer;

function walkNewExpression(astNode) {
    const className = astNode.callee.name;
    const arguments = astNode.arguments.map(walk).join(", ");

    return `${mangle(className)}::new(${arguments})`;
}