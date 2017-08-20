"use strict";

function compile(js){
    return `fn main(){println!("Hello World from Rust!");}`;
}

module.exports = compile;
