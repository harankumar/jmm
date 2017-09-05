module.exports = {
    generateFakeClasses: generateFakeClasses
};

const walk = require('../emit/emit').walk;
const types = require('../types');
const type_infer = types.infer;
const dedent = require('dedent');

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
        "JSON"
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
            name: astRoot.property.name
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

function removeThisInConstructor(astRoot) {
    if (!astRoot)
        return null;

    if (astRoot.type === "ThisExpression"
    ) {
        return {
            "type": "Identifier",
            "start": 528,
            "end": 529,
            "name": "this"
        };
    }

    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
            astRoot[child] = removeThisInConstructor(astRoot[child]);
        }
    }

    return astRoot;
}

// Returns rust code for constructor
function generateConstructor(className, fields, constructorAST) {
    // TODO -- actually do stuff in the constructor

    const params = constructorAST.params.map((param) => {
        let type = types.toRust(type_infer(param));
        let id = param.name;

        return `${id}: ${type}`;
    }).join(", "); // TODO -- params of constructorAST

    const default_vals = {
        "f64": "0.0",
        "String": 'String::from("")',
        "bool": "false"
    };

    const this_default = `${className} { ${fields.map((field) => {
        return field.name + ": " + default_vals[field.type];
    }).join(", ")} }`;

    const constructorBody = constructorAST.body.body
        .map(removeThisInConstructor)
        .map(walk)
        .join(";\n");

    return dedent(`
        fn new(${params}) -> ${className} {
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

    for (let child in astRoot) {
        if (!astRoot.hasOwnProperty(child))
            continue;

        if (typeof astRoot[child] === "object") {
            const temp = detectClassFunctions(astRoot[child], className);
            if (temp) {
                return temp;
            }
        }
    }

    return false;
}

function thisToSelf(astRoot) {
    if (!astRoot)
        return null;

    if (astRoot.type === "ThisExpression"
    ) {
        return {
            "type": "Identifier",
            "start": 528,
            "end": 529,
            "name": "self"
        };
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
    const params = AST.params.length > 0
        ? ", " + AST.params.map((param) => {

        let type = types.toRust(type_infer(param));
        let id = param.name;

        return `${id}: ${type}`;
    }).join(", ")
        : "";

    const js_type = type_infer(AST).type.split("->").map((x) => x.trim());
    const return_sig = js_type.length === 2
        ? " -> " + types.toRustFromStr(js_type[1])
        : "";

    const body = AST.body.body.map(walk).join("\n"); // interior of the block statement

    return dedent(`
        fn ${name} (&mut self${params}) ${return_sig} {
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
    const rsFunctions = functionASTs.map(thisToSelf).map((x) => generateClassFunctions(x[0], x[1])).join("\n\n");
    console.log(rsFunctions)

    // TODO -- handle stuff like toString

    return dedent(`
        struct ${className} {
            ${rsStructFields}
        }
        
        impl ${className} {
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
            && astRoot.right.type === "ObjectExpression");

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