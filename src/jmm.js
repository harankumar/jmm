"use strict";

const fs = require('fs-extra');
const fsPath = require('fs-path');
const cli = require('commander');
const execSync = require('child_process').execSync;
const compiler = require('./compiler');

cli
    .version('0.4.0')
    .option('-j, --js [file]', "JavaScript Source")
    .option('-t, --test [test]', "Run a test")
    .option('-o, --out [dir]', "Output Directory")
    .option('-r, --rustc', "Compile to WASM via rustc?")
    .option('-O, --optimize', "Run rustc in optimize mode?")
    .option('-v, --verbose', "Give verbose output?")
    .parse(process.argv);

if (cli.test) {
    cli.js = `../test/${cli.test}/${cli.test}.js`;
    cli.out = `../test/${cli.test}/build`;
}

const program = fs.readFileSync(cli.js, "utf8");

// TODO -- make this cross OS compatible
const stub = cli.js.split("/").slice(-1)[0].split(".")[0];
const rsFile = `${cli.out}/${stub}.rs`; // Should the .js stay in between? -- TODO
const htmlFile = `${cli.out}/${stub}.html`;

const rs = compiler.compile(program, cli.verbose);

fs.emptyDirSync(cli.out);

fsPath.writeFileSync(rsFile, rs);

if (cli.rustc) {
    if (cli.optimize)
        execSync("rustc -C lto -C opt-level=3 --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile);
    else
        execSync("rustc --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile);
}
