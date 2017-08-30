"use strict";

const fs = require('fs');
const cli = require('cli');
const execSync = require('child_process').execSync;
const compiler = require('./compiler');

const opts = cli.parse({
  test: ["t", "Test to run", "string", null],
  js: ["j", "A Javascript Input File", "file", null],
  out: ["o", "Output directory", "file", null],
  rustc: ["r", "Call rustc?", true, false]
})

if (!opts.js && !opts.out && opts.test) {
  opts.js = `../test/${opts.test}/${opts.test}.js`;
  opts.out = `../test/${opts.test}/build`;
}

// TODO -- make this cross OS compatible
const stub = opts.js.split("/").slice(-1)[0].split(".")[0];
const rsFile = `${opts.out}/${stub}.rs`; // Should the .js stay in between?
const htmlFile = `${opts.out}/${stub}.html`;

const program = fs.readFileSync(opts.js);

const rs = compiler.compile(program);

fs.writeFileSync(rsFile, rs);

// TODO -- do this better
if (opts.rustc)
  execSync("rustc --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile)
