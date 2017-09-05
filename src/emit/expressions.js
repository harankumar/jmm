module.exports = {
    walkCallExpression: walkCallExpression,
    walkUnaryExpression: walkUnaryExpression,
    walkBinaryExpression: walkBinaryExpression,
    walkLogicalExpression: walkLogicalExpression,
    walkUpdateExpression: walkUpdateExpression,
    walkAssignmentExpression: walkAssignmentExpression,
    walkMemberExpression: walkMemberExpression,
    walkConditionalExpression: walkConditionalExpression,
    walkArrayExpression: walkArrayExpression
};

const walk = require('./emit').walk;
const type_infer = require('../types').infer;

const arithmetic = require('./arithmetic_operators');
const comparison = require('./comparison_operators');
const bitwise = require('./bitwise_operators');

function walkCallExpression(astNode) {
    const callee = walk(astNode.callee);
    const args = astNode.arguments
        .map(walk)
        .map((arg) => `(${arg}).clone()`)
        .join(", ");

    return `${callee}(${args})`;
}

function walkUnaryExpression(astNode) {
    // TODO -- FIX ME!!
    // Explicitly handle every possible operator
    // TODO -- bitwise operators

    const argument = walk(astNode.argument);
    const op = astNode.operator;

    // Verify the rust equivalent exists
    switch (op) {
        case "!":
            return `js_not((${argument}).clone())`
    }
}

function walkBinaryExpression(astNode) {
    const builders = {
        // ARITHMETIC
        "+": arithmetic.buildAdd,
        "-": arithmetic.buildSub,
        "*": arithmetic.buildMult,
        "/": arithmetic.buildDiv,
        // COMPARISON
        "<": comparison.buildLessThan,
        "<=": comparison.buildLessThanOrEqual,
        ">": comparison.buildGreaterThan,
        ">=": comparison.buildGreaterThanOrEqual,
        "===": comparison.buildStrictEquality,
        "==": comparison.buildEquality,
        "!==": comparison.buildStrictInequality,
        "!=": comparison.buildInequality,
        // BITWISE
        "&": bitwise.buildAND,
        "|": bitwise.buildOR,
        "^": bitwise.buildXOR,
        "<<": bitwise.buildLeftShift,
        ">>": bitwise.buildRightShift,
        ">>>": bitwise.buildZeroFillRightShift
    };

    const left_type = type_infer(astNode.left).type;
    const left = walk(astNode.left);
    const right_type = type_infer(astNode.right).type;
    const right = walk(astNode.right);

    const builder = builders[astNode.operator];
    if (builder)
        return builder(left, right, left_type, right_type);
    else
        throw `DOESN'T KNOW HOW TO HANDLE EXPRESSIONS THAT USE ${astNode.operator}`;
}

function walkLogicalExpression(astNode) {
    const left = walk(astNode.left);
    const right = walk(astNode.right);
    const op = astNode.operator;

    // Verify that the operator has a rust equivalent
    switch (op) {
        case "&&":
            return `js_and((${left}).clone(), (${right}).clone())`;
        case "||":
            return `js_or((${left}).clone(), (${right}).clone())`;
    }
}

function walkUpdateExpression(astNode) {
    // TODO -- make this complete
    // TODO -- handle prefix

    const arg = walk(astNode.argument);

    if (astNode.operator === "++")
        return `{${arg} += 1.0; ${arg}}`;
    else if (astNode.operator === "--")
        return `{${arg} -= 1.0; ${arg}}`;
}

function walkAssignmentExpression(astNode) {
    // TODO -- make this complete, handle weirdities
    // TODO -- mangle identifiers?

    const left = walk(astNode.left);
    const right = walk(astNode.right);
    const op = astNode.operator;

    // NOTE: THIS DOESN'T HANDLE THESE AS EXPRESSIONS

    // TODO -- type inference
    let assignment;

    if (astNode.operator === "+=" && type_infer(astNode.left).name === "string")
        assignment = `${left} = [${left}.to_str(), (${right}).to_str()].join("")`; // Seriously, we need some type inference up in here
    else
        assignment = `${left} ${op} ${right}`;

    return `${assignment}`
}

function walkMemberExpression(astNode) {
    // TODO -- handle objects differently than structs
    // This should probably use traits to make HashMap same as struct?

    let object = walk(astNode.object);
    let property = walk(astNode.property);


    if (type_infer(astNode.object).name === "Array") {
        if (property === "length") {
            return `${object}.length()`
        }
    }

    return `${object}.${property}`;
}

function walkConditionalExpression(astNode) {
    const test = walk(astNode.test);
    const consequent = walk(astNode.consequent);
    const alternate = walk(astNode.alternate);

    return `if (${test}) {${consequent}} else {${alternate}}`
}

function walkArrayExpression(astNode) {
    const elements = astNode.elements.map(walk).join(", ");

    return `vec![${elements}]`;
}