module.exports = {
    generateFakeClasses: generateFakeClasses
};

const walk = require('../emit/emit').walk;
const types = require('../utils/types');
const type_infer = types.infer;
const dedent = require('dedent');
const mangle = require('../utils/mangle').mangleIdentifier;

// Returns a list of classes
// ["Foo", "Bar", "Baz", etc.]
function detectClasses(astRoot) {
    if (!astRoot)
        return [];

    if (astRoot.type === "NewExpression")
        return astRoot.callee.name;

    let ret = [];
    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object")
            ret = ret.concat(detectClasses(astRoot[child]));
    }

    return Array.from(new Set(ret));
}

// Returns the list of classNames with built in classes removed
function removeBuiltinClasses(classNames) {
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
        "JSON",
        // "Int8Array",
        // "Uint8Array",
        // "Uint8ClampedArray",
        // "Int16Array",
        // "Uint16Array",
        // "Int32Array",
        // "Uint32Array",
        // "Float32Array",
        "Float64Array"
    ]);

    return classNames.filter((name) => !builtin.has(name));
}

// Returns the astNode of the constructor for className
// If it can't find it, returns false
// TODO -- handle other common OOP Constructor patterns
function findConstructor(astRoot, className) {
    if (!astRoot)
        return false;

    if (astRoot.type === "FunctionDeclaration"
        && astRoot.id.name === className) {
        // console.log(className, astRoot);
        return astRoot;
    }

    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
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
// TODO -- account for other Rust OOP Patterns
// This code looks in the constructor body for any times that `this.x` is assigned to something.
// It gives a list of all the "x's"
// WARNING: Any weird block scoping stuff will cause weird errors
function detectClassFields(astRoot) {
    if (!astRoot)
        return [];

    if (astRoot.type === "MemberExpression"
        && astRoot.object.type === "ThisExpression"
    ) {
        return [{
            type: types.toRust(type_infer(astRoot.property)),
            name: mangle(astRoot.property.name)
        }];
    }

    let ret = [];
    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
            const temp = detectClassFields(astRoot[child]);
            ret = ret.concat(temp);
        }
    }

    return ret;
}

// Returns rust code for constructor
function generateConstructor(className, fields, constructorAST) {
    // TODO -- actually do stuff in the constructor

    const params = constructorAST.params.map((param) => {
        let type = types.toRust(type_infer(param));
        let id = mangle(param.name);

        return `${id}: ${type}`;
    }).join(", "); // TODO -- params of constructorAST

    const default_vals = {
        "f64": "0.0",
        "String": 'String::from("")',
        "bool": "false"
    };

    const this_default = `${mangle(className)} { ${fields.map((field) => {
        return field.name + ": " + default_vals[field.type];
    }).join(", ")} }`;

    const constructorBody = constructorAST.body.body
        .map(walk)
        .join(";\n");

    return dedent(`
        fn new(${params}) -> ${mangle(className)} {
            let mut this = ${this_default};
            ${constructorBody};
            this
        }
    `);
}

// Returns a list of functions
// [[name, astNode], [name, astNode], ...]
// Detects code of the form:
// CLASSNAME.prototype = {
//      FUNCTIONNAME: function(...){...},
//      ...
// }
// TODO -- handle other common OOP prototype patterns
function detectClassFunctions(astRoot, className) {
    // console.log(JSON.stringify(astRoot, null, 2))
    // console.log("\n\n")
    if (!astRoot)
        return false;

    if (astRoot.type === "AssignmentExpression"
        && astRoot.left.type === "MemberExpression"
        && astRoot.left.object.name === className
        && astRoot.left.property.name === "prototype"
        && astRoot.right.type === "ObjectExpression"
    ) {
        return astRoot.right.properties.map((prop) => [prop.key.name, prop.value]);
    }

    if (astRoot.type === "AssignmentExpression"
        && astRoot.left.type === "MemberExpression"
        && astRoot.left.object.type === "MemberExpression"
        && astRoot.left.object.object.name === className
        && astRoot.left.object.property.name === "prototype"
        && astRoot.right.type === "FunctionExpression"
    ) {
        return [[astRoot.left.property.name, astRoot.right]];
    }

    let ret = [];
    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
            const temp = detectClassFunctions(astRoot[child], className);
            if (temp) {
                ret = ret.concat(temp);
            }
        }
    }

    if (ret.length > 0)
        return ret;

    return false;
}

function thisToSelf(astRoot) {
    if (!astRoot)
        return null;

    if (astRoot.type === "ThisExpression"
    ) {
        astRoot["JMM_THIS_CONVERT"] = "self";
        return astRoot;
    }

    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
            astRoot[child] = thisToSelf(astRoot[child]);
        }
    }

    return astRoot;
}

//
function generateClassFunctions(name, AST) {
    // TODO -- move this stuff into walkFunctionDeclaration

    const params = AST.params.length > 0
        ? ", " + AST.params.map((param) => {

        let type = types.toRust(type_infer(param));
        let id = mangle(param.name);

        return `${id}: ${type}`;
    }).join(", ")
        : "";

    const js_type = type_infer(AST).type.split("->").map((x) => x.trim());
    const return_sig = js_type.length === 2
        ? " -> " + types.toRustFromStr(js_type[1])
        : "";

    const body = AST.body.body.map(walk).join("\n"); // interior of the block statement

    return dedent(`
        fn ${mangle(name)} (&mut self${params}) ${return_sig} {
            ${body}
        } 
    `);
}

// Returns RUST code
function buildFakeClass(className, fields, functionASTs, constructor) {
    const rsStructFields = fields
        .map((field) => `${field.name}: ${field.type}`)
        .join(",\n");

    // TODO -- functions require transformation!!
    const rsFunctions = functionASTs
        ? functionASTs.map(thisToSelf).map((x) => generateClassFunctions(x[0], x[1])).join("\n\n")
        : "";

    // TODO -- handle stuff like toString

    return dedent(`
        struct ${mangle(className)} {
            ${rsStructFields}
        }
        
        impl ${mangle(className)} {
            ${constructor}
            ${rsFunctions}
        }
    `);
}

// "Prune the tree"
// Returns AST without any constructors or prototype stuff
function removeOOP(astRoot, classNames) {
    classNames = new Set(classNames);
    return _removeOOP(astRoot, classNames)
}

// classNames is a Set
function _removeOOP(astRoot, classNames) {
    if (!astRoot)
        return true;

    const isOOP = (astRoot.type === "FunctionDeclaration" && classNames.has(astRoot.id.name))
        || (astRoot.type === "AssignmentExpression"
            && astRoot.left.type === "MemberExpression"
            && classNames.has(astRoot.left.object.name)
            && astRoot.left.property.name === "prototype"
            && astRoot.right.type === "ObjectExpression")
        || (astRoot.type === "AssignmentExpression"
            && astRoot.left.type === "MemberExpression"
            && astRoot.left.object.type === "MemberExpression"
            && classNames.has(astRoot.left.object.object.name)
            && astRoot.left.object.property.name === "prototype"
            && astRoot.right.type === "FunctionExpression");

    if (isOOP) {
        return false;
    }

    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
            const temp = _removeOOP(astRoot[child], classNames);
            if (!temp) {
                astRoot[child] = {type: "JMM_REMOVED"};
            }
        }
    }

    return astRoot;
}

// Returns array [astWithoutClasses, RUST Code]
function generateFakeClasses(astRoot) {
    const classNames = removeBuiltinClasses(detectClasses(astRoot));

    let ret = "";
    for (let className of classNames) {
        const constructorAST = findConstructor(astRoot, className);
        const fields = detectClassFields(constructorAST);
        const functions = detectClassFunctions(astRoot, className); // TODO -- put this stuff into fake class
        const constructor = generateConstructor(className, fields, constructorAST);

        ret += buildFakeClass(className, fields, functions, constructor) + "\n";

    }

    astRoot = removeOOP(astRoot, classNames);

    return [astRoot, ret];
}