module.exports = {
    infer: infer,
    registerFile: registerFile,
    toRust: getCorrespondingRustType,
    toRustFromStr: toRustFromStr
};

const mangle = require('./mangle').mangleIdentifier;
require('tern/plugin/doc_comment');

const tern = new (require('tern').Server)({
    plugins: {
        doc_comment: true
    }

});
const deasync = require('deasync');

function infer(astNode) {
    const params = {
        query: {
            type: "type",
            file: "main",
            start: astNode.start,
            end: astNode.end
        }
    };

    let done = false;
    let data;
    tern.request(params, function (err, results) {
        if (err)
            throw `TERN DONE GOOFED ${err} ${JSON.stringify(astNode)}`;

        data = results;
        done = true;
    });
    deasync.loopWhile(() => !done);

    return data;
}

function registerFile(src) {
    tern.addFile("main", src);
}

function getCorrespondingRustType(tern_obj) {
    return toRustFromStr(tern_obj.type);
}

function toRustFromStr(tern_type) {
    switch (tern_type) {
        case "number":
            return "f64";
        case "string":
            return "String"; // TODO -- change this to &str
        case "boolean":
            return "bool";
    }

    if (tern_type[0] === "[" && tern_type[tern_type.length -1] === "]")
        return `Vec<${toRustFromStr(tern_type.slice(1, -1))}>`

    return mangle(tern_type);
}