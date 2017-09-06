struct Console {}

impl Console {
    fn __js__log<T: JmmJsObject>(&self, x: T) {
        println!("{}", x.to_str());
    }
}

static __js__console: Console = Console {};
