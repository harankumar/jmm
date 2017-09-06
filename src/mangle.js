module.exports = {
    // mangleIdentifiers: mangleIdentifiers
    mangleIdentifier
};

function mangleIdentifier(identifier){
    return "__js__" + identifier;
}

// const acorn = require('acorn');
// const escodegen = require('escodegen');
//
// // Returns [AST, JS] where AST is the root node of a new AST, JS is the generated JavaScript
//
// // Adds __js__ prefix to identifiers
// function prefixIdentifiers(astRoot){
//     // if (astRoot && astRoot.type === "Identifier") {
//     //     return {
//     //         "type": "Identifier",
//     //         "start": astRoot.start,
//     //         "end": astRoot.end,
//     //         "name": "" + astRoot.name
//     //     };
//     // }
//
//     // for (let child in astRoot) {
//     //     if (!astRoot.hasOwnProperty(child))
//     //         continue;
//     //
//     //     if (typeof astRoot[child] === "object") {
//     //         astRoot[child] = prefixIdentifiers(astRoot[child]);
//     //     }
//     // }
//
//     return astRoot;
// }
//
// function mangleIdentifiers(AST){
//     // traverse tree, replacing identifiers
//     AST = prefixIdentifiers(AST);
//
//     // generate JavaScript
//     const js = escodegen.generate(AST);
//
//     return [AST, js];
// }
