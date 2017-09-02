"use strict";

const fs = require('fs');
const fsPath = require('fs-path');
const cli = require('cli');
const execSync = require('child_process').execSync;
const compiler = require('./compiler');

const opts = cli.parse({
    test: ["t", "Test to run", "string", null],
    js: ["j", "A Javascript Input File", "file", null],
    out: ["o", "Output directory", "file", null],
    rustc: ["r", "Call rustc?", true, false],
    all: ["a", "Run all tests?", true, false]
});

if (!opts.js && !opts.out) {
    if (opts.all){
        opts.out = `../test/all/build`
    } else if (opts.test){
        opts.js = `../test/${opts.test}/${opts.test}.js`;
        opts.out = `../test/${opts.test}/build`;
    }
}

let program = "", rsFile, htmlFile;

if (opts.out){
    // TODO -- make this cross OS compatible
    const stub = opts.js.split("/").slice(-1)[0].split(".")[0];
    rsFile = `${opts.out}/${stub}.rs`; // Should the .js stay in between?
    htmlFile = `${opts.out}/${stub}.html`;

    program = fs.readFileSync(opts.js, "utf8");
} else {
    let names = fs.readdirSync("../test/");
    for (let name of names)
        program += fs.readFileSync(`../test/${name}/${name}.js`, "utf8") + "\n\n";
    rsFile = "../test/all/build/all.rs";
    htmlFile = "../test/all/build/all.html";
}

const rs = compiler.compile(program);

fsPath.writeFileSync(rsFile, rs);

// TODO -- do this better
if (opts.rustc)
    execSync("rustc --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile);
