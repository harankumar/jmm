module.exports = {
    buildLessThan: buildLessThan,
    buildLessThanOrEqual: buildLessThanOrEqual,
    buildGreaterThan: buildGreaterThan,
    buildGreaterThanOrEqual: buildGreaterThanOrEqual,
    buildStrictEquality: buildStrictEquality,
    buildEquality: buildEquality,
    buildStrictInequality: buildStrictInequality,
    buildInequality: buildInequality
};

const isNumCoercible = require('./arithmetic_operators').isNumCoercible;

function buildLessThan(left, right, left_type, right_type) {
    // TODO -- handle objects
    if (left_type === right_type)
        return `((${left}) < (${right}))`;
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `((${left}).to_num() < (${right}).to_num())`;
}

function buildGreaterThan(left, right, left_type, right_type) {
    if (left_type === right_type)
        return `((${left}) > (${right}))`;
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `((${left}).to_num() > (${right}).to_num())`;
}

function buildLessThanOrEqual(left, right, left_type, right_type) {
    // TODO -- handle objects
    if (left_type === right_type)
        return `((${left}) <= (${right}))`;
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `((${left}).to_num() <= (${right}).to_num())`;
}

function buildGreaterThanOrEqual(left, right, left_type, right_type) {
    // TODO -- handle objects
    if (left_type === right_type)
        return `((${left}) >= (${right}))`;
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `((${left}).to_num() >= (${right}).to_num())`;
}

function buildStrictEquality(left, right, left_type, right_type) {
    if (left_type !== right_type)
        return "false";
    else
        return `((${left}) == (${right}))`;
}

function buildEquality(left, right, left_type, right_type) {
    if (left_type === right_type)
        return `((${left}) == (${right}))`;
    if (left_type === "string")
        return `((${left}) == (${right}).to_str())`;
    if (right_type === "string")
        return `((${right}) == (${left}).to_str())`;
    else
    // TODO -- find a more elegant solution to this:
        return "false";
    // throw `Doesn't know how to determine equality of ${left_type} and ${right_type}`;
}

function buildStrictInequality(left, right, left_type, right_type) {
    if (left_type !== right_type)
        return "false";
    else
        return `((${left}) == (${right}))`;
}

function buildInequality(left, right, left_type, right_type) {
    if (left_type === right_type)
        return `((${left}) != (${right}))`;
    if (left_type === "string")
        return `((${left}) != (${right}).to_str())`;
    if (right_type === "string")
        return `((${right}) != (${left}).to_str())`;
    else
        return "false";
    // throw `Doesn't know how to determine equality of ${left_type} and ${right_type}`;
}
