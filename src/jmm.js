"use strict";

const fs = require('fs');
const cli = require('cli');
const execSync = require('child_process').execSync;
const compile = require('./compiler');

const opts = cli.parse({
  js: ["j", "A Javascript Input File", "file", "../test/helloworld/helloworld.js"],
  out: ["o", "Output directory", "file", "../test/helloworld/build"]
})

// TODO -- make this cross OS compatible
const stub = opts.js.split("/").slice(-1)[0].split(".")[0];
const rsFile = `${opts.out}/${stub}.rs`;
const htmlFile = `${opts.out}/${stub}.html`;

console.log(stub, rsFile, htmlFile)

const program = fs.readFileSync(opts.js);

const rs = compile(program);
console.log(rs);


fs.writeFileSync(rsFile, rs);
// TODO -- do this better
execSync("rustc --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile)
