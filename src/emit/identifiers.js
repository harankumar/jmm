module.exports = {
    walkIdentifier: walkIdentifier
};

const mangle = require('../mangle').mangleIdentifier;

function walkIdentifier(astNode) {
    switch (astNode.name) {
        case "NaN":
            return "NaN {}";
        default:
            // TODO -- mangle names
            return mangle(astNode.name);
    }
}
