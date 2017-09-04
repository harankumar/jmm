module.exports = {
    compile: compile
};

const acorn = require('acorn');
const rslibgen = require('./emit/rslib');
const walk = require('./emit/emit').walk;
const fake_classes = require('./transform/fake_classes');

const type_infer = require('./types');

function compile(js) {
    let AST = acorn.parse(js);
    console.log("AST\n\n" + JSON.stringify(AST, null, 2) + "\n\n");

    type_infer.registerFile(js);

    let rs_classes;
    [AST, rs_classes] = fake_classes.generateFakeClasses(AST);

    const generatedRust = walk(AST);
    console.log("GENERATED RUST\n\n" + generatedRust + "\n\n");

    const rslib = rslibgen();
    return rslib + rs_classes + walk(AST);
}
