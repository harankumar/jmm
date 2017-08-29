module.exports = {
  walkUnary: walkUnary,
  walkLogical: walkLogical,
  walkBinary: walkBinary
}

const compiler = require('./compiler');
const walk = compiler.walk;

function walkUnary(astNode) {
  const argument = walk(astNode.argument);
  const op = astNode.operator;

  if (op === "!")
    return `! (${argument})`;
}

function walkBinary(astNode) {
  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  if (op === "===")
    return `(${left}) == (${right})`;
  else if (op === "!==")
    return `(${left}) != (${right})`;
}

function walkLogical(astNode) {
  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // Verify that the operator has a rust equivalent
  if (op === "&&" || op === "||")
    return `${left} ${op} ${right}`;
}
