trait JmmJsObject {
    fn type_of (&self) -> String;
    fn is_truthy(&self) -> bool;
    fn to_str (&self) -> String;
    fn to_num (&self) -> f64;
}

impl JmmJsObject for bool {
    fn type_of(&self) -> String {
        return String::from("boolean");
    }

    fn is_truthy(&self) -> bool {
      return *self;
    }

    fn to_str (&self) -> String {
      match *self {
        true => String::from("true"),
        false => String::from("false")
      }
    }

    fn to_num (&self) -> f64 {
      match *self {
        true => 1.0,
        false => 0.0
      }
    }
}

impl JmmJsObject for String {
    fn type_of(&self) -> String {
        return String::from("string");
    }

    fn is_truthy(&self) -> bool{
      match (*self).len() {
        0 => false,
        _ => true
      }
    }

    fn to_str (&self) -> String {
      return (*self).clone();
    }

    fn to_num(&self) -> f64 {
      // TODO -- change me!
      return -42.0;
    }
}

impl JmmJsObject for f64 {
    fn type_of(&self) -> String {
        return String::from("number");
    }

    fn is_truthy(&self) -> bool {
      match *self {
        0.0 => false,
        _ => true
      }
    }

    fn to_str (&self) -> String {
      // TODO -- fully flesh this out
      return (*self).to_string();
    }

    fn to_num(&self) -> f64 {
      return *self;
    }
}
