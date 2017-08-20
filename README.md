# JMM
JMM (Javascript Minus Minus) compiles a subset of javascript to WASM.
It's super experimental, so don't use it in production.

## Dependencies
JMM requires node, emscripten, and rust to be installed on your system.

## Versions
0.0 "Hello World"
  Compiles a simple "Hello World" Program
    Supports basic variable assignment
    String literals
    console.log turns into println!("{}", STUFF)
  Rudimentary CLI

## Rough Roadmap
0.1 "FizzBuzz" add in basic control structures, numbers, and booleans
0.2 "Fibonacci" Basic functions (no closures), recursion
0.3 "Dictionary" Basic objects as HashMaps
0.4 "Scoping" Flesh out scoping rules
0.5 "Closures"
0.6 "OOP?"
0.7 "DOM" Get DOM APIs
