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
const identifiers = require('./identifiers');

const rslibgen = require('./rslib');
const type_infer = require('./type_infer');

const walkers = {
    "Program": walkProgram,
    "Identifier": identifiers.walkIdentifier,
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
    "UnaryExpression": expressions.walkUnaryExpression,
    "BinaryExpression": expressions.walkBinaryExpression,
    "LogicalExpression": expressions.walkLogicalExpression,
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

function walk(astNode) {
    if (astNode && astNode.type && walkers[astNode.type])
        return walkers[astNode.type](astNode);
    else {
        console.log("JMM DOESN'T KNOW HOW TO HANDLE " + astNode);
    }
}

function compile(js) {
    const AST = acorn.parse(js);
    console.log("AST\n\n" + JSON.stringify(AST, null, 2) + "\n\n");

    type_infer.registerFile(js);
    const generatedRust = walk(AST);
    console.log("GENERATED RUST\n\n" + generatedRust + "\n\n");

    const rslib = rslibgen();
    return rslib + walk(AST);
}
