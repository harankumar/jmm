"use strict";

const fs = require('fs-extra');
const fsPath = require('fs-path');
const cli = require('commander');
const execSync = require('child_process').execSync;
const compiler = require('./compiler');
const path = require('path');

cli
    .version('0.4.0')
    .option('-j, --js [file]', "JavaScript Source")
    .option('-t, --test [test]', "Run a test")
    .option('-o, --out [dir]', "Output Directory")
    .option('-f, --fmt', "Format rust code via rustfmt?")
    .option('-w, --wasm', "Compile to WASM via rustc?")
    .option('-b, --bin', "Compile to executable via rustc?")
    .option('-O, --optimize', "Run rustc in optimize mode?")
    .option('-v, --verbose', "Give verbose output?")
    .parse(process.argv);

if (cli.test) {
    cli.js = path.normalize(`../test/${cli.test}/${cli.test}.js`);
    cli.out = path.normalize(`../test/${cli.test}/build`);
}

const program = fs.readFileSync(cli.js, "utf8");

const stub = cli.js.split("/").slice(-1)[0].split(".")[0];
const rsFile = path.join(cli.out, `${stub}_jmm.rs`);
const htmlFile = path.join(cli.out, `${stub}_jmm.html`);
const output = path.join(cli.out, `${stub}_jmm`);

const rs = compiler.compile(program, cli.verbose);

fs.emptyDirSync(cli.out);

fsPath.writeFileSync(rsFile, rs);

if (cli.fmt){

    execSync(`rustfmt ${rsFile}`);
}

if (cli.wasm) {
    let cmd = "rustc --target=wasm32-unknown-emscripten --color=always ";

    if (cli.optimize)
        cmd += "-C lto -C opt-level=3 ";

    cmd += rsFile + " -o " + htmlFile;

    execSync(cmd);
}

if (cli.bin) {
    let cmd = "rustc --color=always ";

    if (cli.optimize)
        cmd += "-C lto -C opt-level=3 ";

    cmd += rsFile + " -o " + output;

    execSync(cmd);
}
