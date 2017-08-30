module.exports = {
  buildLessThan: buildLessThan,
  buildGreaterThan: buildGreaterThan,
  buildStrictEquality: buildStrictEquality,
  buildEquality: buildEquality,
  buildStrictInequality: buildStrictInequality,
  buildInequality: buildInequality
}

function buildLessThan(left, right, left_type, right_type) {

}

function buildGreaterThan(left, right, left_type, right_type) {

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
        console.log(left, right);
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
        console.log(left, right);
}
