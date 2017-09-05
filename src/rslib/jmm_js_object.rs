trait JmmJsObject {
    fn type_of(&self) -> String;
    fn is_truthy(&self) -> bool;
    fn to_str(&self) -> String;
}

impl JmmJsObject for bool {
    fn type_of(&self) -> String {
        return String::from("boolean");
    }

    fn is_truthy(&self) -> bool {
        return *self;
    }

    fn to_str(&self) -> String {
        match *self {
            true => String::from("true"),
            false => String::from("false"),
        }
    }
}

impl JmmJsObject for String {
    fn type_of(&self) -> String {
        return String::from("string");
    }

    fn is_truthy(&self) -> bool {
        match (*self).len() {
            0 => false,
            _ => true,
        }
    }

    fn to_str(&self) -> String {
        return (*self).clone();
    }
}

impl JmmJsObject for f64 {
    fn type_of(&self) -> String {
        return String::from("number");
    }

    fn is_truthy(&self) -> bool {
        match *self {
            0.0 => false,
            _ => true,
        }
    }

    fn to_str(&self) -> String {
        // TODO -- fully flesh this out
        return (*self).to_string();
    }
}

impl JmmJsObject for NaN {
    fn type_of(&self) -> String {
        return String::from("number");
    }

    fn is_truthy(&self) -> bool {
        return false;
    }

    fn to_str(&self) -> String {
        return String::from("NaN");
    }
}

impl JmmJsObject for Vec<String> {
    fn type_of(&self) -> String {
        return String::from("object");  // TODO -- is this correct? FIXME
    }

    fn is_truthy(&self) -> bool {
        return true;
    }

    fn to_str(&self) -> String {
        ["[".to_string(), self.join(", "), "]".to_string()].join("")
    }
}