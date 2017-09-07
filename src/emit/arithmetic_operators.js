module.exports = {
    buildAdd: buildAdd,
    buildSub: buildSub,
    buildMult: buildTimes,
    buildDiv: buildDiv,
    buildModulo: buildMod,
    isNumCoercible: isNumCoercible
};

const num_coercible = new Set(["number", "bool"]);

function isNumCoercible(type) {
    return num_coercible.has(type);
}

function buildAdd(left, right, left_type, right_type) {
    if (num_coercible.has(left_type) && num_coercible.has(right_type))
        return `((${left}).to_num() + (${right}).to_num())`;
    else
        return `[(${left}).to_str(), (${right}).to_str()].join("")`;
}

function buildSub(left, right, left_type, right_type) {
    if (num_coercible.has(left_type) && num_coercible.has(right_type))
        return `((${left}).to_num() - (${right}).to_num())`;
    else
        return "__js__NaN";
}

function buildTimes(left, right, left_type, right_type) {
    // TODO -- handle Infinity
    if (num_coercible.has(left_type) && num_coercible.has(right_type))
        return `((${left}).to_num() * (${right}).to_num())`;
    else
        return "__js__NaN";
}

function buildDiv(left, right, left_type, right_type) {
    // TODO -- handle Infinity
    if (num_coercible.has(left_type) && num_coercible.has(right_type))
        return `((${left}).to_num() / (${right}).to_num())`;
    else
        return "__js__NaN";
}

function buildMod(left, right, left_type, right_type){
    if (num_coercible.has(left_type) && num_coercible.has(right_type))
        return `((${left}).to_num() % (${right}).to_num())`;
    else
        return "__js__NaN";
}