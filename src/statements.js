module.exports = {
  walkForStatement: walkForStatement,
  walkIfStatement: walkIfStatement,
  walkBlockStatement: walkBlockStatement,
  walkReturnStatement: walkReturnStatement,
  walkWhileStatement: walkWhileStatement,
  walkExpressionStatement: walkExpressionStatement
}

const compiler = require('./compiler');
const walk = compiler.walk;

function walkForStatement(astNode) {
  const init = walk(astNode.init);
  const test = walk(astNode.test);
  const update = walk(astNode.update);
  const body = walk(astNode.body);

  return `${init};\n while(${test}){\n${body}; ${update};\n}`
}

function walkWhileStatement(astNode) {
  const test = walk(astNode.test);
  const body = walk(astNode.body);

  return `while(${test}){\n${body}\n}`
}

function walkIfStatement(astNode) {
  const test = walk(astNode.test);
  const consequent = walk(astNode.consequent);
  const alternate = walk(astNode.alternate);

  if (alternate)
    return `if(${test})\n{${consequent}} \nelse\n {${alternate}}`
  else
    return `if(${test})\n{${consequent}}`
}

function walkBlockStatement(astNode) {
  // TODO -- FIX ME!!
  // This probably mangles scoping rules and stuff

  const body = astNode.body.map(walk).map((s) => s + ";").join("\n");
  return body;
}

function walkExpressionStatement(astNode) {
  return `${walk(astNode.expression)};`;
}

function walkReturnStatement(astNode) {
  const ret = walk(astNode.argument);

  return `return (${ret})`;
}
