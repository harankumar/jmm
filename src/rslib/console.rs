struct Console {}

impl Console {
    fn log<T: JmmJsObject>(&self, x: T) {
        println!("{}", x.to_str());
    }
}

static console: Console = Console {};
