// TODO -- make this generic

trait Array {
    fn length(&self) -> f64;
}

impl Array for Vec<String> {
    fn length(&self) -> f64 {
        self.len() as f64
    }
}

impl TypeOf for Vec<String> {
    fn type_of(&self) -> String {
        return String::from("object");  // TODO -- is this correct? FIXME
    }
}

impl ToBool for Vec<String> {
    fn is_truthy(&self) -> bool {
        return true;
    }
}

impl ToString for Vec<String> {
    fn to_str(&self) -> String {
        ["[".to_string(), self.join(", "), "]".to_string()].join("")
    }
}