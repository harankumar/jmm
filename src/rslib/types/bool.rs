impl TypeOf for bool {
    fn type_of(&self) -> String {
        return String::from("boolean");
    }
}

impl ToBool for bool {
    fn is_truthy(&self) -> bool {
        return *self;
    }
}

impl ToString for bool {
    fn to_str(&self) -> String {
        match *self {
            true => String::from("true"),
            false => String::from("false"),
        }
    }
}

impl ToNum for bool {
    fn to_num(&self) -> f64 {
        match *self {
            true => 1.0,
            false => 0.0,
        }
    }
}