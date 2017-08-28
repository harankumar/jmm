"use strict";

module.exports = {
  compile: compile,
  walk: walk
};

const acorn = require('acorn');
const fs = require('fs');

const declarations = require('./declarations');
const statements = require('./statements');
const expressions = require('./expressions');
const literals = require('./literals');

const type_infer = require('./type_infer');

const walkers = {
  "Program": walkProgram,
  "Identifier": walkIdentifier,
  "Literal": literals.walkLiteral,

  "ExpressionStatement": statements.walkExpressionStatement,
  "ForStatement": statements.walkForStatement,
  "WhileStatement": statements.walkWhileStatement,
  "DoWhileStatement": statements.walkDoWhileStatement,
  "IfStatement": statements.walkIfStatement,
  "SwitchStatement": statements.walkSwitchStatement,
  "BlockStatement": statements.walkBlockStatement,
  "ReturnStatement": statements.walkReturnStatement,

  "CallExpression": expressions.walkCallExpression,
  "BinaryExpression": expressions.walkBinaryExpression,
  "MemberExpression": expressions.walkMemberExpression,
  "AssignmentExpression": expressions.walkAssignmentExpression,
  "UpdateExpression": expressions.walkUpdateExpression,
  "ConditionalExpression": expressions.walkConditionalExpression,

  "VariableDeclaration": declarations.walkVariableDeclaration,
  "VariableDeclarator": declarations.walkVariableDeclarator,
  "FunctionDeclaration": declarations.walkFunctionDeclaration
};

function walkProgram(astNode) {
  const body = astNode.body.map(walk).join("");
  return `fn main(){\n${body}}`;
}

function walkIdentifier(astNode) {
  return astNode.name;
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
  type_infer.registerFile(js);
  const rslib = fs.readFileSync("./rslib/lib.rs")
  return rslib + walk(AST);
}
