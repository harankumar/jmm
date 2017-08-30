module.exports = {
    walkIdentifier: walkIdentifier
};

function walkIdentifier(astNode) {
    switch (astNode.name) {
    case "NaN":
        return "NaN {}";
    default:
        // TODO -- mangle names
        return astNode.name;
    }
}
