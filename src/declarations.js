module.exports = {
  walkVariableDeclaration: walkVariableDeclaration,
  walkVariableDeclarator: walkVariableDeclarator,
  walkFunctionDeclaration: walkFunctionDeclaration
}

const compiler = require('./compiler');
const walk = compiler.walk;

function walkVariableDeclaration(astNode) {
  // TODO: handle const, var, let differently
  // TODO: fix weird var scoping/hoisting rules
  return astNode.declarations.map(walk).join(";\n");
}

function walkVariableDeclarator(astNode) {
  const id = walk(astNode.id);
  const init = walk(astNode.init);

  return `let mut ${id} = ${init}`;
}

function walkFunctionDeclaration(astNode) {
  // TODO -- handle expressions, generators

  const id = walk(astNode.id);
  const params = astNode.params.map(walk)
    .map((x) => x + ":f64"); // TODO --- type infer!!!
  const body = walk(astNode.body);

  return `fn ${id} (${params.join(", ")}) -> f64 {\n${body}\n};`;
}
