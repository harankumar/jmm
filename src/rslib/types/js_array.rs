// TODO -- make this generic

trait __js__Array<T: ToString> {
    fn __js__length(&self) -> f64;
    fn __js__push(&mut self, val: T) -> f64;
}

impl<'a, T: ToString> __js__Array<T> for &'a mut Vec<T> {
    fn __js__length(&self) -> f64 {
        self.len() as f64
    }
    fn __js__push(&mut self, val: T) -> f64 {
        self.push(val);
        self.len() as f64
    }
}

impl<'a, T> TypeOf for &'a mut Vec<T> {
    fn type_of(&self) -> String {
        String::from("object")  // TODO -- is this correct? FIXME
    }
}

impl<'a, T> ToBool for &'a mut Vec<T> {
    fn is_truthy(&self) -> bool {
        true
    }
}

impl<'a, T: ToString> ToString for &'a mut Vec<T> {
    fn to_str(&self) -> String {
        let mut ret = String::from("[");
        for val in self.iter() {
            ret.push_str(&(val.to_str()));
            ret.push_str(", ");
        }
        ret.pop();
        ret.pop();
        ret.push_str("]");
        ret
    }
}


impl<T: ToString> __js__Array<T> for Vec<T> {
    fn __js__length(&self) -> f64 {
        self.len() as f64
    }
    fn __js__push(&mut self, val: T) -> f64 {
        self.push(val);
        self.len() as f64
    }
}

impl<T: ToString> TypeOf for Vec<T> {
    fn type_of(&self) -> String {
        String::from("object")  // TODO -- is this correct? FIXME
    }
}

impl<T: ToString> ToBool for Vec<T> {
    fn is_truthy(&self) -> bool {
        true
    }
}

impl<T: ToString> ToString for Vec<T> {
    fn to_str(&self) -> String {
        let mut ret = String::from("[");
        for val in self.iter() {
            ret.push_str(&(val.to_str()));
            ret.push_str(", ");
        }
        ret.pop();
        ret.pop();
        ret.push_str("]");
        ret
    }
}
