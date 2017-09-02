# JMM
JMM (Javascript Minus Minus) compiles a subset of javascript to WASM.
It's super experimental, so don't use it in production (duh!).

## Installation & Usage
Clone the git repository and install dependencies:

```
$ git clone https://github.com/harankumar/jmm.git
$ cd jmm
$ npm install
$ cd src
```

Run a test:

```
$ node jmm -t <test>
```

`<test>` is the name of any of the tests in the `/test/` directory. This will create a rust file in the `/test/<test>/build` directory.

If you wish to then compile this to WebAssembly, add the flag `-r true` at the end of the command. It'll automatically generate an HTML page in `test/<test>/build` where you can see the code running.

## Dependencies
JMM requires node, emscripten, and rust to be installed on your system. Make sure your emscripten version is up to date (you might have to build from source) so that you can compile to WASM. The latter two dependencies are technically unnecessary if you just want to generate rust code without running it, but that would be pretty boring, now wouldn't it?

## What's in a subset?
JMM is a subset of Javascript, specifically the [2011 ECMAScript Specification (ECMA-262 5.1)](http://www.ecma-international.org/ecma-262/5.1/).

Ultimately it should include the following:
* all primitive types and operations, except null and undefined
* objects, including arrays, that follow Rust's borrowing/referencing rules
 * objects for which a "fake class" can be created
 * arrays for which all members are the same type
 * objects without functions or `this`, that can be treated as maps
* functions, including closures

### Completeness

| Category | SubCategory |            |           |                |           |                |          |            |          |             |            |             |            
|------------------------|------------|-----------|----------------|-----------|----------------|----------|------------|----------|-------------|------------|-------------|------------|
| **Types**            | :poultry_leg: Undefined  | :poultry_leg: Null      | :hatching_chick: Boolean  | :hatching_chick: String    | :hatching_chick: Number         | :poultry_leg: Object   | :poultry_leg: Reference  | :hatching_chick: List     | :poultry_leg: Completion |         |             |            |
| **Type Conversion**  | :hatching_chick: Primitive  | :hatching_chick: Boolean   | :hatching_chick: Numbers  | :hatching_chick: String    | :poultry_leg: Object         | :poultry_leg: Callable |            |          |            |         |             |            |
| **Expressions**      | :hatching_chick: Primary    | :hatching_chick: LHS       | :hatching_chick: Postfix  | :hatching_chick: Unary     | :hatching_chick: Multiplicative | :hatching_chick: Additive | :hatching_chick: Relational | :hatching_chick: Equality | :egg: Bitwise    | :hatching_chick: Logical | :chicken: Conditional | :hatching_chick: Assignment |
| **Statements**       | :egg: Block      | :hatching_chick: Variable  | :hatching_chick: If       | :hatching_chick: Iteration | :hatching_chick: Continue       | :hatching_chick: Break    | :hatching_chick: Return     | :poultry_leg: With     | :hatching_chick: Switch     |         |             |            |
| **Function**         | :hatching_chick: Definition | :hatching_chick: Call      |          |           |                |          |            |          |            |         |             |            |
| **Built-in Objects** | :poultry_leg: Global     | :poultry_leg: Object    | :egg: Function | :egg: Array     | :egg: String         | :egg: Boolean  | :egg: Number     | :egg: Math     | :egg: Date       | :egg: RegExp  | :poultry_leg: Error       | :poultry_leg: JSON       |
| **Errors**           | :egg: Throw      | :poultry_leg: Try-Catch |          |           |                |          |            |          |            |         |             |            |


:egg: long run feature
:hatching_chick: in the works
:chicken: completed (mostly)
:poultry_leg: probably won't be implemented

## Contributing

I'm currently working on this for a science fair/school project, so I can't really accept any outside assistance. 
But in a few months, I'd be happy to start collaborating. 
Ideally, this project will stay low-key until I'm able to be a proper maintainer and collaborator.

## License

This project is GPLv3. See the license for any legal questions. 
It's best that we keep the web free (in both senses of the word), and open source software is the best way to protect that.