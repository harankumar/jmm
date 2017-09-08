module.exports = {
    walkVariableDeclaration: walkVariableDeclaration,
    walkVariableDeclarator: walkVariableDeclarator,
    walkFunctionDeclaration: walkFunctionDeclaration
};

const mangle = require('../mangle').mangleIdentifier;
const walk = require('./emit').walk;
const types = require('../types');

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
    const params = astNode.params
        .map((param) => {
            let name = mangle(param.name);
            const type = types.infer(param).type;

            let type_sig = "";
            if (types.isMutable(type)){
                type_sig = "&mut ";
                name = "mut " + name;
            }
            type_sig += types.toRustFromStr(type);

            return `${name}: ${type_sig}`
        }); // TODO --- type infer!!!
    const body = walk(astNode.body);

    const js_type = types.infer(astNode.id).type.split("->").map((x) => x.trim());
    const return_sig = js_type.length === 2
        ? " -> " + types.toRustFromStr(js_type[1])
        : "";

    return `fn ${id} (${params.join(", ")}) ${return_sig} {\n${body}};\n`;
}
