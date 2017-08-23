module.exports = {
  walkCallExpression: walkCallExpression,
  walkBinaryExpression: walkBinaryExpression,
  walkUpdateExpression: walkUpdateExpression,
  walkAssignmentExpression: walkAssignmentExpression,
  walkMemberExpression: walkMemberExpression
}

const compiler = require('./compiler');
const walk = compiler.walk;

function walkCallExpression(astNode) {
  const callee = walk(astNode.callee);
  const args = astNode.arguments.map(walk);

  // TODO -- use namespacing or structs to handle this
  if (astNode.callee.type === "MemberExpression" &&
    astNode.callee.object.name === "console" &&
    astNode.callee.property.name === "log")
    return `println!("{}", ${args})\n`

  return `${callee}(${args})`;
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

function walkUpdateExpression(astNode) {
  // TODO -- make this complete
  // TODO -- handle prefix

  const arg = walk(astNode.argument);

  if (astNode.operator === "++")
    return `{${arg} += 1.0; ${arg}}`
}

function walkAssignmentExpression(astNode) {
  // TODO -- make this complete, handle weirdities

  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // NOTE: THIS DOESN'T HANDLE THESE AS EXPRESSIONS

  // TODO -- type inference
  let assignment;

  if (astNode.operator === "+=")
    assignment = `${left} = [(${left}).to_string(), (${right}).to_string()].join("")`; // Seriously, we need some type inference up in here
  else
    assignment = `${left} ${op} ${right}`;

  return `${assignment}`
}

function walkMemberExpression(astNode) {
  // TODO
}
