module.exports = {
  walkForStatement: walkForStatement,
  walkIfStatement: walkIfStatement,
  walkBlockStatement: walkBlockStatement,
  walkReturnStatement: walkReturnStatement,
  walkWhileStatement: walkWhileStatement,
  walkExpressionStatement: walkExpressionStatement,
  walkSwitchStatement: walkSwitchStatement
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

function walkSwitchStatement(astNode) {
  console.log(astNode.cases[2])

  if (astNode.cases.length === 0)
    return "";

  const discriminant = walk(astNode.discriminant);
  // If it's well written javascript and has a "break" statement, this done goof
  // TODO: FIXME
  const consequent = astNode.cases[0].consequent.map(walk).map((x) => x + ";\n");
  const test = walk(astNode.cases[0].test);
  const astNodeRec = Object.assign({}, astNode);
  astNodeRec.cases = astNode.cases.slice(1);
  const alternate = walk(astNodeRec);

  if (test)
    return `if (${discriminant} == ${test}){\n${consequent}} else {${alternate}}`
  else
    return consequent;
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
