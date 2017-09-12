module.exports = {
    walkForStatement: walkForStatement,
    walkIfStatement: walkIfStatement,
    walkBlockStatement: walkBlockStatement,
    walkReturnStatement: walkReturnStatement,
    walkWhileStatement: walkWhileStatement,
    walkExpressionStatement: walkExpressionStatement,
    walkSwitchStatement: walkSwitchStatement,
    walkDoWhileStatement: walkDoWhileStatement,
    walkBreakStatement: walkBreakStatement
};

const walk = require('./emit').walk;
const type_infer = require('../utils/types').infer;

function walkForStatement(astNode) {
    const init = walk(astNode.init);
    const test = walk(astNode.test);
    const update = walk(astNode.update);
    const body = walk(astNode.body);

    return `{${init};\n while(${test}){\n${body}\n${update};\n}}`;
}

function walkWhileStatement(astNode) {
    const test = walk(astNode.test);
    const body = walk(astNode.body);

    return `while(${test}){\n${body}\n}`;
}

function walkDoWhileStatement(astNode) {
    const test = walk(astNode.test);
    const body = walk(astNode.body);

    return `loop {\n ${body} \n if (!(${test})) {break;}\n}`
}

function walkIfStatement(astNode) {
    const test = walk(astNode.test);
    const consequent = walk(astNode.consequent);
    const alternate = astNode.alternate ? walk(astNode.alternate) : "";

    if (alternate)
        return `if(${test})\n{${consequent}} \nelse\n {${alternate}}\n`;
    else
        return `if(${test}){\n${consequent}}\n`;
}

function walkSwitchStatement(astNode) {
    // Doesn't yet handle break statement weirditude...
    // Doesn't handle break statements nested in if statements, etc.
    // Those are kind of a code smell though so it's probably fine
    // TODO: make this fully complete

    const discriminant = walk(astNode.discriminant);

    const ifelses = []; // list of form {tests: ____, consequent: ____}

    let tests = [];
    for (let caseNode of astNode.cases) {
        if (caseNode.test)
            tests.push(walk(caseNode.test));
        else {
            tests.push("default");
        }
        if (caseNode.consequent.length > 0) {
            let consequent = [];

            for (let line of caseNode.consequent) {
                if (line.type === "BreakStatement")
                    break;
                else
                    consequent.push(walk(line));
            }

            ifelses.push({
                test: testBuilder(tests, discriminant),
                consequent: consequent
            });

            tests = [];
        }
    }

    return ifElseBuilder(ifelses) + "\n";
}

function testBuilder(tests, discriminant) {
    return tests.map((test) => {
        if (test === "default")
            return "true";
        else
            return `${discriminant} == (${test})`;
    }).join(" || ");
}

function ifElseBuilder(ifelses) {
    const first = ifelses[0];
    const rest = ifelses.slice(1);

    if (ifelses.length === 0) {
        return "";
    } else if (ifelses.length === 1) {
        if (first.test === "true")
            return `${first.consequent.join(";\n")}\n;`;
        else
            return `if(${first.test}){\n${first.consequent.join(";\n")};\n}`;
    } else {
        return `if(${first.test}){\n${first.consequent.join(";\n")};\n} else {\n${ifElseBuilder(rest)}}\n`;
    }
}

function walkBlockStatement(astNode) {
    // TODO -- FIX ME!!
    // This probably mangles scoping rules and stuff

    const body = astNode.body.map(walk).join("");
    return body;
}

function walkExpressionStatement(astNode) {
    return `${walk(astNode.expression)};\n`;
}

function walkReturnStatement(astNode) {
    const ret = walk(astNode.argument);

    return `return (${ret});\n`;
}

function walkBreakStatement(astNode) {
    return "break;\n";
}