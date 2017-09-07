impl TypeOf for String {
    fn type_of(&self) -> String{
        String::from("string")
    }
}

impl ToBool for String {
    fn is_truthy(&self) -> bool {
        match (*self).len() {
            0 => false,
            _ => true,
        }
    }
}

impl ToString for String {
    fn to_str(&self) -> String {
        (*self).clone()
    }
}