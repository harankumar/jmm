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

    let ret = [];
    for (let child in astRoot){
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object")
            ret = ret.concat(detectClasses(astRoot[child]));
    }

    return Array.from(new Set(ret));
}

// Returns the list of classNames with built in classes removed
function removeBuiltinClasses(classNames){
    const builtin = new Set([
        "Global",
        "Object",
        "Function",
        "Array",
        "String",
        "Boolean",
        "Number",
        "Math",
        "Date",
        "RegExp",
        "Error",
        "JSON"
    ]);

    return classNames.filter((name) => !builtin.has(name));
}

// Returns the astNode of the constructor for className
// If it can't find it, returns false
// TODO -- handle other common OOP Constructor patterns
function findConstructor(astRoot, className){
    if (!astRoot)
        return false;

    if (astRoot.type === "FunctionDeclaration"
        && astRoot.id.name === className){
        // console.log(className, astRoot);
        return astRoot;
    }

    for (let child in astRoot){
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object"){
            const temp = findConstructor(astRoot[child], className);
            if (temp) {
                return temp;
            }
        }
    }

    return false;
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
    const classNames = removeBuiltinClasses(detectClasses(astRoot));

    let ret = "";
    for (let className of classNames){
        const constructorAST = findConstructor(astRoot, className);
        
        const fields = detectClassFields(astRoot, className);
        const functions = detectClassFunctions(astRoot, className);
        const constructor = generateConstructor(astRoot, className);

        ret += buildFakeClass(className, fields, functions) + "\n";
    }

    return [astRoot, ret];
}