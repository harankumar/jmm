"use strict";

const execSync = require('child_process').execSync;

const tests = [
    // "arrays",
    "arithmetic",
    "bitwise",
    "bool",
    "comparison",
    "fibonacci",
    "fizzbuzz",
    "functions",
    "helloworld",
    "nan",
    "oop",
    "syntax"
];

for (let test of tests)
    execSync(`node ../src/jmm -t ${test} -r true -v true`);