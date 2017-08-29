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

function walkCallExpression(astNode) {
  const callee = walk(astNode.callee);
  const args = astNode.arguments.map(walk);

  return `${callee}(${args})`;
}

function walkUnaryExpression(astNode) {
  // TODO -- FIX ME!!
  // Explicitly handle every possible operator

  const argument = walk(astNode.argument);
  const op = astNode.operator;

  // Verify the rust equivalent exists
  if (op === "!")
    return `${op}(${argument})`;
}

function walkBinaryExpression(astNode) {
  // TODO -- FIX ME!!
  // Rust and JS don't actually have a one-to-one correlations in what operations mean
  const left = walk(astNode.left);
  const right = walk(astNode.right);
  // Pull this out
  const op = astNode.operator === "===" ? "==" : astNode.operator;

  if (op === "%")
    return `({${left}}) ${op} ({${right}})`;
  else
    return `${left} ${op} ${right}`;
}

function walkLogicalExpression(astNode) {
  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // Verify that the operator has a rust equivalent
  if (op === "&&" || op === "||")
    return `${left} ${op} ${right}`;
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

  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // NOTE: THIS DOESN'T HANDLE THESE AS EXPRESSIONS

  // TODO -- type inference
  let assignment;

  if (astNode.operator === "+=" && type_infer(astNode.left) === "string")
    assignment = `${left} = [(${left}).to_string(), (${right}).to_string()].join("")`; // Seriously, we need some type inference up in here
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
