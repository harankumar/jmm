module.exports = {
  walkCallExpression: walkCallExpression,
  walkUnaryExpression: walkUnaryExpression,
  walkBinaryExpression: walkBinaryExpression,
  walkLogicalExpression: walkLogicalExpression,
  walkUpdateExpression: walkUpdateExpression,
  walkAssignmentExpression: walkAssignmentExpression,
  walkMemberExpression: walkMemberExpression,
  walkConditionalExpression: walkConditionalExpression
}

const compiler = require('./compiler');
const walk = compiler.walk;
const type_infer = require('./type_infer').infer;

const arithmetic = require('./arithmetic_operators');

function walkCallExpression(astNode) {
  const callee = walk(astNode.callee);
  const args = astNode.arguments
    .map(walk)
    .map((arg) => `(${arg}).clone()`)
    .join(", ");


  console.log(type_infer(astNode.arguments[0]))
  return `${callee}(${args})`;
}

function walkUnaryExpression(astNode) {
  // TODO -- FIX ME!!
  // Explicitly handle every possible operator

  const argument = walk(astNode.argument);
  const op = astNode.operator;

  // Verify the rust equivalent exists
  switch (op) {
    case "!":
      return `js_not((${argument}).clone())`
  }
}

function walkBinaryExpression(astNode) {
  const builders = {
    "+": arithmetic.buildAdd,
    "-": arithmetic.buildSub,
    "*": arithmetic.buildMult,
    "/": arithmetic.buildDiv
  }

  const left_type = type_infer(astNode.left).type;
  const left = walk(astNode.left);
  const right_type = type_infer(astNode.right).type;
  const right = walk(astNode.right);

  return (builders[astNode.operator])(left, right, left_type, right_type);
}



function walkLogicalExpression(astNode) {
  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // Verify that the operator has a rust equivalent
  switch (op) {
    case "&&":
      return `js_and((${left}).clone(), (${right}).clone())`;
    case "||":
      return `js_or((${left}).clone(), (${right}).clone())`;
  }
}

function walkUpdateExpression(astNode) {
  // TODO -- make this complete
  // TODO -- handle prefix

  const arg = walk(astNode.argument);

  if (astNode.operator === "++")
    return `{${arg} += 1.0; ${arg}}`;
  else if (astNode.operator === "--")
    return `{${arg} -= 1.0; ${arg}}`;
}

function walkAssignmentExpression(astNode) {
  // TODO -- make this complete, handle weirdities
  // TODO -- mangle identifiers?

  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // NOTE: THIS DOESN'T HANDLE THESE AS EXPRESSIONS

  // TODO -- type inference
  let assignment;

  console.log(type_infer(astNode.left))

  if (astNode.operator === "+=" && type_infer(astNode.left).name === "string")
    assignment = `${left} = [${left}, (${right}).to_string()].join("")`; // Seriously, we need some type inference up in here
  else
    assignment = `${left} ${op} ${right}`;

  return `${assignment}`
}

function walkMemberExpression(astNode) {
  // TODO -- handle objects differently than structs
  // This should probably use traits to make HashMap same as struct?

  let object = walk(astNode.object);
  let property = walk(astNode.property);

  return `${object}.${property}`;
}

function walkConditionalExpression(astNode) {
  const test = walk(astNode.test);
  const consequent = walk(astNode.consequent);
  const alternate = walk(astNode.alternate);

  return `if (${test}) {${consequent}} else {${alternate}}`
}
