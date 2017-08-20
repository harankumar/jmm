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
      return `${callee}(${args})`;
    case "MemberExpression":
      if (astNode.object.name === "console" &&
        astNode.property.name === "log")
        return "println!"
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
