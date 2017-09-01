module.exports = {
    generateFakeClasses: generateFakeClasses
};

const walk = require('../emit/emit').walk;
const types = require('../types');
const type_infer = types.infer;

// Returns a list of classes
// ["Foo", "Bar", "Baz", etc.]
function detectClasses(astRoot){
    if (!astRoot)
        return [];

    if (astRoot.type === "NewExpression")
        return astRoot.callee.name;

    console.log(astRoot.type)

    let ret = [];
    for (let child in astRoot){
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object")
            ret = ret.concat(detectClasses(astRoot[child]));
    }

    console.log(ret);

    return Array.from(new Set(ret));
}

// Returns a list of fields
// [{type: _____, name: ______}]
// where type is the corresponding Rust Type
function detectClassFields(astRoot, className){

}

// Returns rust code for constructor
function generateConstructor(astRoot, className, fields){
    // TODO -- actually do stuff in the constructor

    const rsFields = fields.map((field) => `${field.name}: ${field.type}`)
        .join(", ");

    return `
        new(${rsFields}){
            ${className} {${fields.map((field) => field + ": " + field).join(", ")}}
        }
    `;
}

// Returns a list of functions
// [astNode, astNode, ...]
function detectClassFunctions(astRoot, className){
}

// Returns RUST code
function buildFakeClass(className, fields, functionASTs, constructor){
    const rsStructFields = fields.map((field) => `${field.name}: ${field.type}`)
        .join(",\n");

    // TODO -- functions require transformation!!
    const rsFunctions = functionASTs.map(walk).join("\n\n");

    // TODO -- handle stuff like toString

    return `
        struct ${className} {
            ${constructor}
            ${rsStructFields}
        }
        
        impl ${className} {
            ${rsFunctions}
        }
    `;
}

// Returns array [astWithoutClasses, RUST Code]
function generateFakeClasses(astRoot){
    const classNames = detectClasses(astRoot);

    let ret = "";
    for (let className of classNames){
        const fields = detectClassFields(astRoot, className);
        const functions = detectClassFunctions(astRoot, className);
        const constructor = generateConstructor(astRoot, className);

        ret += buildFakeClass(className, fields, functions) + "\n";
    }

    return [astRoot, ret];
}