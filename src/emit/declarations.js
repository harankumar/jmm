module.exports = {
    walkVariableDeclaration: walkVariableDeclaration,
    walkVariableDeclarator: walkVariableDeclarator,
    walkFunctionDeclaration: walkFunctionDeclaration
};

const walk = require('./emit').walk;
const type_infer = require('../types').infer;

function walkVariableDeclaration(astNode) {
    // TODO: handle const, var, let differently
    // TODO: fix weird var scoping/hoisting rules
    return astNode.declarations.map(walk).join("");
}

function walkVariableDeclarator(astNode) {
    const id = walk(astNode.id);

    if (astNode.init) {
        const init = walk(astNode.init);
        return `let mut ${id} = ${init};\n`;
    } else {
        return `let mut ${id};\n`;
    }

}

function walkFunctionDeclaration(astNode) {
    // TODO -- handle expressions, generators

    const id = walk(astNode.id);
    const params = astNode.params.map(walk)
        .map((x) => x + ":f64"); // TODO --- type infer!!!
    const body = walk(astNode.body);

    return `fn ${id} (${params.join(", ")}) -> f64 {\n${body}};\n`;
}
