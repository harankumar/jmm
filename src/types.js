module.exports = {
    infer: infer,
    registerFile: registerFile
};

const tern = new(require('tern').Server)({});
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
    tern.request(params, function(err, results) {
        if (err)
            console.log("TERN DONE GOOFED " + err);

        data = results;
        done = true;
    });
    deasync.loopWhile(() => !done);

    return data;
}

function registerFile(src) {
    tern.addFile("main", src);
}

function getCorrespondingRustType(tern_type){
    switch(tern_type.type){
        case "number":
            return "f64";
        case "string":
            return "String"; // TODO -- change this to &str
        case "boolean":
            return "bool";
    }
}