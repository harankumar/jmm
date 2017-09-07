module.exports = {
    compile: compile
};

const acorn = require('acorn');
const rslibgen = require('./emit/rslib');
const walk = require('./emit/emit').walk;
const fake_classes = require('./transform/fake_classes');

const type_infer = require('./types');

function compile(js, verbose) {
    let AST = acorn.parse(js);
    if (verbose)
        console.log("AST\n\n" + JSON.stringify(AST, null, 2) + "\n\n");

    type_infer.registerFile(js);

    let rs_classes;
    [AST, rs_classes] = fake_classes.generateFakeClasses(AST);
    if (verbose) {
        console.log("AST without OOP\n\n" + JSON.stringify(AST, null, 2) + "\n\n");
        console.log("RUST CLASSES\n\n" + rs_classes + "\n\n");
    }

    const generatedRust = walk(AST);
    if (verbose)
        console.log("GENERATED RUST\n\n" + generatedRust + "\n\n");

    const rslib = rslibgen();
    return rslib + rs_classes + generatedRust;
}
