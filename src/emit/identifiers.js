module.exports = {
    walkIdentifier: walkIdentifier
};

const mangle = require('../utils/mangle').mangleIdentifier;

function walkIdentifier(astNode) {
    switch (astNode.name) {
        case "NaN":
            return "__js__NaN";
        default:
            return mangle(astNode.name);
    }
}
