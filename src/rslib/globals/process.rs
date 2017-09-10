struct Process {
    __js__argv: Vec<String>
}

// let expression allowed because this file goes into the interior of main
let mut __js__process = Process {__js__argv: std::env::args().collect()};
// First two elements of process.argv are not equivalent to node,
// but this preserves the indexes of the values after that
__js__process.__js__argv.insert(0, "".to_owned());

println!("{}", "");