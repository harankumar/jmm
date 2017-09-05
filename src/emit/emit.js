module.exports = {
    walk: walk
};


const declarations = require('./declarations');
const statements = require('./statements');
const expressions = require('./expressions');
const literals = require('./literals');
const identifiers = require('./identifiers');
const oop = require('./oop');

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
    "NewExpression": oop.walkNewExpression,
    "ArrayExpression": expressions.walkArrayExpression,

    "VariableDeclaration": declarations.walkVariableDeclaration,
    "VariableDeclarator": declarations.walkVariableDeclarator,
    "FunctionDeclaration": declarations.walkFunctionDeclaration,

    "JMM_REMOVED": () => ""
};

function walkProgram(astNode) {
    const body = astNode.body.map(walk).join("");
    return `fn main(){\n${body}}`;
}

function walk(astNode) {
    if (astNode && astNode.type && walkers[astNode.type])
        return walkers[astNode.type](astNode);
    else {
        throw `EMITTER DOESN'T KNOW HOW TO HANDLE ${astNode.type}`;
    }
}