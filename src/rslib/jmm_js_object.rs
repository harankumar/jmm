trait JmmJsObject {
    fn type_of (&self) -> String;
    fn to_str (&self) -> String;
}

impl JmmJsObject for bool {
    fn type_of(&self) -> String {
        return String::from("boolean");
    }

    fn to_str (&self) -> String {
      match *self {
        true => String::from("true"),
        false => String::from("false")
      }
    }
}

impl JmmJsObject for String {
    fn type_of(&self) -> String {
        return String::from("string");
    }

    fn to_str (&self) -> String {
      return (*self).clone();
    }
}

// impl JmmJsObject for f64 {
//     fn type_of(&self) -> String {
//         return String::from("number");
//     }
//
//     fn to_str (&self) -> String {
//       return self.to_string();
//     }
// }
