# JMM
JMM (Javascript Minus Minus) compiles a subset of javascript to WASM.
It's super experimental, so don't use it in production (duh!).

## Dependencies
JMM requires node, emscripten, and rust to be installed on your system.

## Completeness

| **Types**            | Undefined  | Null      | Boolean  | String    | Number         | Object   | Reference  | List     | Completion |         |             |            |
|----------------------|------------|-----------|----------|-----------|----------------|----------|------------|----------|------------|---------|-------------|------------|
| **Type Conversion**  | Primitive  | Boolean   | Numbers  | String    | Object         | Callable |            |          |            |         |             |            |
| **Expressions**      | Primary    | LHS       | Postfix  | Unary     | Multiplicative | Additive | Relational | Equality | Bitwise    | Logical | Conditional | Assignment |
| **Statements**       | Block      | Variable  | If       | Iteration | Continue       | Break    | Return     | With     | Switch     |         |             |            |
| **Function**         | Definition | Call      |          |           |                |          |            |          |            |         |             |            |
| **Built-in Objects** | Global     | Object    | Function | Array     | String         | Boolean  | Number     | Math     | Date       | RegExp  | Error       | JSON       |
| **Errors**           | Throw      | Try-Catch |          |           |                |          |            |          |            |         |             |            |

## Versions
0.0 "Hello World"
  Compiles a simple "Hello World" Program
    Supports basic variable assignment
    String literals
    console.log turns into println!("{}", STUFF)
  Rudimentary CLI
0.1 "Fizz Buzz"
  Compiles a simple "Fizz Buzz" Program
    Handles if statements and for loops
    Basic support for numbers
    Better support for strings
    Rudimentary assignment statements like +=
  CLI flag for compiling to rustc or not
0.2 "Fibonacci"
  Compiles a simple "Fibonacci" program
    Basic functions (no closures)
    recursion
    return statements
  Still needs a lot of work, especially type inference
0.3 "Slightly Legit"
  Reorganized compiler into files based on type of astNode (expression, declaration, statement)
  Supports more control flow stuff and other syntax
    while loops
    do-while loops
    most switch statements
        (as long as there's no weird stuff with nested break statements or other stuff you probably shouldn't be doing anyway)
    -- (decrement operator)
    conditional expressions (-?-:-)
  Slightly better code generation -- fewer random semicolons and newlines
  Convenient CLI flag for tests
  Type inference with tern
    Got the library set up with deasync
    Works with += operator... more to come in 0.4!

## Rough Roadmap
0.4 "Flesh"
  fully support all the primitive types in JS and their operators (no objects yet)
    null & undefined (comparison operators)
    bool
    number
      infinity
      NaN
      bitwise operators
    string
  support most basic libraries (static functions)
    Math
    Number
