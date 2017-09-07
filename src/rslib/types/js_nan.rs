struct __js__NaN;

impl Clone for __js__NaN {
    fn clone(&self) -> __js__NaN {
        return __js__NaN {};
    }
}


impl TypeOf for __js__NaN {
    fn type_of(&self) -> String {
        return String::from("number");
    }
}

impl ToBool for __js__NaN {
    fn is_truthy(&self) -> bool {
        return false;
    }
}

impl ToString for __js__NaN {
    fn to_str(&self) -> String {
        return String::from("__js__NaN");
    }
}
