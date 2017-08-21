"use strict";

const acorn = require('acorn');

const walkers = {
  "Program": walkProgram,
  "ExpressionStatement": walkExpression,
  "CallExpression": walkCall,
  "VariableDeclaration": walkDeclaration,
  "VariableDeclarator": walkDeclarator,
  "Identifier": walkIdentifier,
  "Literal": walkLiteral,
  "ForStatement": walkForStatement,
  "IfStatement": walkIfStatement,
  "BinaryExpression": walkBinaryExpression,
  "BlockStatement": walkBlockStatement,
  "UpdateExpression": walkUpdateExpression,
  "MemberExpression": walkMemberExpression
};

// TODO: de-clutter/categorize this stuff

function walkProgram(astNode) {
  const body = astNode.body.map(walk).map((s) => s + ";").join("\n");
  return `fn main(){\n${body}\n}`;
}

function walkExpression(astNode) {
  return walk(astNode.expression)
}

function walkCall(astNode) {
  const callee = walk(astNode.callee);
  const args = astNode.arguments.map(walk);

  // TODO -- use namespacing or structs to handle this
  if (astNode.callee.type === "MemberExpression" &&
    astNode.callee.object.name === "console" &&
    astNode.callee.property.name === "log")
    return `println!("{}", ${args})\n`

  return `${callee}(${args})`;
}

function walkDeclaration(astNode) {
  // TODO: handle const, var, let differently
  // TODO: fix weird var scoping/hoisting rules
  return astNode.declarations.map(walk).join(";\n");
}

function walkDeclarator(astNode) {
  const id = walk(astNode.id);
  const init = walk(astNode.init);

  return `let mut ${id} = ${init}`;
}

function walkIdentifier(astNode) {
  return astNode.name;
}

function walkLiteral(astNode) {
  const val = astNode.value;
  switch (typeof val) {
    case "string":
      return `"${val}"`
    case "number":
      return `({${val} as f64})`
  }
}

function walkForStatement(astNode) {
  const init = walk(astNode.init);
  const test = walk(astNode.test);
  const update = walk(astNode.update);
  const body = walk(astNode.body);

  return `${init};\n while(${test}){\n${body}; ${update};\n}`
}

function walkIfStatement(astNode) {
  const test = walk(astNode.test);
  const consequent = walk(astNode.consequent);
  const alternate = walk(astNode.alternate);

  return `if(${test})\n{${consequent}} \nelse\n {${alternate}}`
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

function walkBlockStatement(astNode) {
  // TODO -- FIX ME!!
  // This probably mangles scoping rules and stuff

  const body = astNode.body.map(walk).map((s) => s + ";").join("\n");
  return body;
}

function walkUpdateExpression(astNode) {
  // TODO -- make this complete
  // TODO -- handle prefix

  const arg = walk(astNode.argument);

  if (astNode.operator === "++")
    return `{${arg} += 1.0; ${arg}}`
}

function walkMemberExpression(astNode) {
  // TODO
}

function walk(astNode) {
  if (walkers[astNode.type])
    return walkers[astNode.type](astNode);
  else {
    console.log(astNode)
  }
}

function compile(js) {
  const AST = acorn.parse(js);
  return walk(AST);
}

module.exports = compile;
