module.exports = {
    walkNewExpression: walkNewExpression
};

const walk = require('./emit').walk;

// const type_infer = require('../types').infer;

function walkNewExpression(astNode) {
    const className = astNode.callee.name;
    const arguments = astNode.arguments.map(walk).join(", ");

    return `${className}::new(${arguments})`;
}