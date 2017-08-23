"use strict";

module.exports = {
  compile: compile,
  walk: walk
};

const acorn = require('acorn');
const fs = require('fs');
const tern = require('tern');
const declarations = require('./declarations');
const statements = require('./statements');
const expressions = require('./expressions');

const walkers = {
  "Program": walkProgram,
  "ExpressionStatement": statements.walkExpressionStatement,
  "CallExpression": expressions.walkCallExpression,
  "VariableDeclaration": declarations.walkVariableDeclaration,
  "VariableDeclarator": declarations.walkVariableDeclarator,
  "Identifier": walkIdentifier,
  "Literal": walkLiteral,
  "ForStatement": statements.walkForStatement,
  "WhileStatement": statements.walkWhileStatement,
  "IfStatement": statements.walkIfStatement,
  "BinaryExpression": expressions.walkBinaryExpression,
  "BlockStatement": statements.walkBlockStatement,
  "UpdateExpression": expressions.walkUpdateExpression,
  "MemberExpression": expressions.walkMemberExpression,
  "AssignmentExpression": expressions.walkAssignmentExpression,
  "FunctionDeclaration": declarations.walkFunctionDeclaration,
  "ReturnStatement": statements.walkReturnStatement
};

function walkProgram(astNode) {
  const body = astNode.body.map(walk).map((s) => s + ";").join("\n");
  return `fn main(){\n${body}\n}`;
}

function walkIdentifier(astNode) {
  return astNode.name;
}

function walkLiteral(astNode) {
  const val = astNode.value;
  switch (typeof val) {
    case "string":
      return `String::from("${val}")`
    case "number":
      return `({${val} as f64})`
  }
}

function walk(astNode) {
  if (astNode && astNode.type && walkers[astNode.type])
    return walkers[astNode.type](astNode);
  else {
    console.log(astNode)
  }
}

function compile(js) {
  const AST = acorn.parse(js);
  const rslib = fs.readFileSync("./rslib/lib.rs")
  return rslib + walk(AST);
}
