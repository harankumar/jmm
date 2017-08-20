"use strict";

const acorn = require('acorn');

const walkers = {
  "Program": walkProgram,
  "ExpressionStatement": walkExpression,
  "CallExpression": walkCall,
  "VariableDeclaration": walkDeclaration,
  "VariableDeclarator": walkDeclarator,
  "Identifier": walkIdentifier,
  "Literal": walkLiteral
};

function walkProgram(astNode) {
  const body = astNode.body.map(walk).map((s) => s + ";").join("\n");
  return `fn main(){${body}}`;
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
    return `println!("{}", ${args})`

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
  }
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
