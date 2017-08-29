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
const boolExpressions = require('./bool_expressions');

function walkCallExpression(astNode) {
  const callee = walk(astNode.callee);
  const args = astNode.arguments.map(walk);

  // TODO -- use namespacing or structs to handle this
  if (astNode.callee.type === "MemberExpression" &&
    astNode.callee.object.name === "console" &&
    astNode.callee.property.name === "log")
    return `println!("{}", ${args})`;

  return `${callee}(${args})`;
}

function walkUnaryExpression(astNode) {
  switch (type_infer(astNode.argument).type) {
    case "bool":
      return boolExpressions.walkUnary(astNode);
  }
}

function walkBinaryExpression(astNode) {
  const left_type = type_infer(astNode.left).type;
  const right_type = type_infer(astNode.right).type;

  if (astNode.operator === "===") {
    if (left_type !== right_type) {
      // TODO -- put warnings in a separate module and make it less crappy
      console.log("JMM WARNING: Mismatched types in " + astNode);
      return "false";
    }
  }

  if (astNode.left_type === "bool" && astNode.right_type === "bool")
    return boolExpressions.walkBinary(astNode);

  /* BEGIN CRAPPY CODE */

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

  /* END CRAPPY CODE*/
}

function walkLogicalExpression(astNode) {
  const left_type = type_infer(astNode.left).type;
  const right_type = type_infer(astNode.right).type;

  if (left_type === "bool" && right_type === "bool")
    return boolExpressions.walkLogical(astNode);
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
  // TODO
}

function walkConditionalExpression(astNode) {
  const test = walk(astNode.test);
  const consequent = walk(astNode.consequent);
  const alternate = walk(astNode.alternate);

  return `if (${test}) {${consequent}} else {${alternate}}`
}
