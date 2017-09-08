// TODO -- make this generic

trait __js__Array {
    fn __js__length(&self) -> f64;
    fn __js__push(&mut self, val: String) -> f64;
}

impl<'a> __js__Array for &'a mut Vec<String> {
    fn __js__length(&self) -> f64 {
        self.len() as f64
    }
    fn __js__push(&mut self, val: String) -> f64 {
        self.push(val);
        self.len() as f64
    }
}

impl<'a> TypeOf for &'a mut Vec<String> {
    fn type_of(&self) -> String {
        String::from("object")  // TODO -- is this correct? FIXME
    }
}

impl<'a> ToBool for &'a mut Vec<String> {
    fn is_truthy(&self) -> bool {
        true
    }
}

impl<'a> ToString for &'a mut Vec<String> {
    fn to_str(&self) -> String {
        ["[".to_string(), self.join(", "), "]".to_string()].join("")
    }
}