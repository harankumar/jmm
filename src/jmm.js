"use strict";

const fs = require('fs');
const cli = require('cli');
const execSync = require('child_process').execSync;
const compiler = require('./compiler');

const opts = cli.parse({
  js: ["j", "A Javascript Input File", "file", "../test/fibonacci/fibonacci.js"],
  out: ["o", "Output directory", "file", "../test/fibonacci/build"],
  rustc: ["r", "Call rustc?", true, false]
})

// TODO -- make this cross OS compatible
const stub = opts.js.split("/").slice(-1)[0].split(".")[0];
const rsFile = `${opts.out}/${stub}.rs`; // Should the .js stay in between?
const htmlFile = `${opts.out}/${stub}.html`;

console.log(stub, rsFile, htmlFile)

const program = fs.readFileSync(opts.js);

const rs = compiler.compile(program);
console.log(rs);


fs.writeFileSync(rsFile, rs);

// TODO -- do this better
if (opts.rustc)
  execSync("rustc --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile)
