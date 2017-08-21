"use strict";

const acorn = require('acorn');
const fs = require('fs');

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
  "MemberExpression": walkMemberExpression,
  "AssignmentExpression": walkAssignmentExpression
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
      return `String::from("${val}")`
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

  if (alternate)
    return `if(${test})\n{${consequent}} \nelse\n {${alternate}}`
  else
    return `if(${test})\n{${consequent}}`
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

function walkAssignmentExpression(astNode) {
  // TODO -- make this complete, handle weirdities

  const left = walk(astNode.left);
  const right = walk(astNode.right);
  const op = astNode.operator;

  // NOTE: THIS DOESN'T HANDLE THESE AS EXPRESSIONS

  // TODO -- type inference
  // if (typeof astNode.left.)
  // let assignment = `${left} ${op} ${right}`;
  // if (typeof astNode.right.value === "string")
  const assignment = `[(${left}).to_string(), (${right}).to_string()].join("")`; // Seriously, we need some type inference up in here
  return `${left} = ${assignment}`
  // return `{${left} = ${assignment}; ${left}}`;
}

function walkMemberExpression(astNode) {
  // TODO
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
  const lib = fs.readFileSync("./lib/lib.rs")
  return lib + walk(AST);
}

module.exports = compile;
