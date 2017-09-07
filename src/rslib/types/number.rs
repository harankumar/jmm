impl TypeOf for f64 {
    fn type_of(&self) -> String {
        String::from("number")
    }
}

impl ToBool for f64 {
    fn is_truthy(&self) -> bool {
        match *self {
            0.0 => false,
            _ => true,
        }
    }
}

impl ToString for f64 {
    fn to_str(&self) -> String {
        // TODO -- fully flesh this out
        (*self).to_string()
    }
}

impl ToNum for f64 {
    fn to_num(&self) -> f64 {
        *self
    }
}
