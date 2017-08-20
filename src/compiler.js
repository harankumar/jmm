"use strict";

const acorn = require('acorn');

function walk(astNode) {
  switch (astNode.type) {
    case "Program":
      const body = astNode.body.map(walk).map((s) => s + ";").join("\n");
      return `fn main(){${body}}`;
    case "ExpressionStatement":
      return walk(astNode.expression);
    case "CallExpression":
      const callee = walk(astNode.callee);
      const args = astNode.arguments.map(walk);

      // TODO -- use namespacing or structs to handle this
      if (astNode.callee.type === "MemberExpression" &&
        astNode.callee.object.name === "console" &&
        astNode.callee.property.name === "log")
        return `println!("{}", ${args})`

      return `${callee}(${args})`;
    case "VariableDeclaration":
      return astNode.declarations.map(walk).join(";\n");
    case "VariableDeclarator":
      const id = walk(astNode.id);
      const init = walk(astNode.init);

      return `let mut ${id} = ${init}`;
      // TODO: handle const, var, let differently
      // TODO: fix weird var scoping/hoisting rules
    case "Identifier":
      return astNode.name;
    case "Literal":
      const val = astNode.value;
      switch (typeof val) {
        case "string":
          return `"${val}"`
      }
    default:
      console.log(astNode);
      console.log("IDK what to do with this!!!");
  }
}

function compile(js) {
  const AST = acorn.parse(js);
  return walk(AST);
}

module.exports = compile;
