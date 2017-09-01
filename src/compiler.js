module.exports = {
    compile: compile
};

const acorn = require('acorn');
const rslibgen = require('./emit/rslib');
const walk = require('./emit/emit').walk;

const type_infer = require('./types');

function compile(js) {
    const AST = acorn.parse(js);
    console.log("AST\n\n" + JSON.stringify(AST, null, 2) + "\n\n");

    type_infer.registerFile(js);
    const generatedRust = walk(AST);
    console.log("GENERATED RUST\n\n" + generatedRust + "\n\n");

    const rslib = rslibgen();
    return rslib + walk(AST);
}
