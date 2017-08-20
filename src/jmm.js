"use strict";

const fs = require('fs');
//const cli = require('commander') -- TODO
const execSync = require('child_process').execSync;
const compile = require('./compiler');

const jsFile = "../test/helloworld/helloworld.js";
const rsFile = "../test/helloworld/build/helloworld.rs";
const htmlFile = "../test/helloworld/build/helloworld.html";

const js = fs.readFileSync(jsFile);

const rs = compile(js);
console.log(rs);


fs.writeFileSync(rsFile, rs);
execSync("rustc --target=wasm32-unknown-emscripten " + rsFile + " -o " + htmlFile)
