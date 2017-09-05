module.exports = {
    buildAND: buildAND,
    buildOR: buildOR,
    buildXOR: buildXOR,
    buildLeftShift: buildLeftShift,
    buildRightShift: buildRightShift,
    buildZeroFillRightShift: buildZeroFillRightShift
};

// TODO -- move type coercion methods into own module
const isNumCoercible = require('./arithmetic_operators').isNumCoercible;

// JavaScript's bitwise operations first convert operands to 32 bit integers.
// Thus, JMM turns bitwise operations through the following pathway:
// operands -> f64 -> i64 -> perform operation -> f64

function buildAND(left, right, left_type, right_type) {
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `({( ({(${left}).to_num() as i64}) & ({(${right}).to_num() as i64})) as f64})`;
    else
        throw `Bitwise operations only work on numeric-coercible types! Doesn't work with ${left_type} and ${right_type}!`;
}

function buildOR(left, right, left_type, right_type) {
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `({( ({(${left}).to_num() as i64}) | ({(${right}).to_num() as i64})) as f64})`;
    else
        throw `Bitwise operations only work on numeric-coercible types! Doesn't work with ${left_type} and ${right_type}!`;
}

function buildXOR(left, right, left_type, right_type) {
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `({( ({(${left}).to_num() as i64}) ^ ({(${right}).to_num() as i64})) as f64})`;
    else
        throw `Bitwise operations only work on numeric-coercible types! Doesn't work with ${left_type} and ${right_type}!`;
}

function buildLeftShift(left, right, left_type, right_type) {
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `({( ({(${left}).to_num() as i64}) << ({(${right}).to_num() as i64})) as f64})`;
    else
        throw `Bitwise operations only work on numeric-coercible types! Doesn't work with ${left_type} and ${right_type}!`;

}

function buildRightShift(left, right, left_type, right_type) {
    if (isNumCoercible(left_type) && isNumCoercible(right_type))
        return `({( ({(${left}).to_num() as i64}) >> ({(${right}).to_num() as i64})) as f64})`;
    else
        throw `Bitwise operations only work on numeric-coercible types! Doesn't work with ${left_type} and ${right_type}!`;
}

function buildZeroFillRightShift(left, right, left_type, right_type) {
    throw ">>> not yet supported! Sorry.";
}