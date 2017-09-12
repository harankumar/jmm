#[derive(Clone)]
struct __js__Array<T: ToString> {
    val: Vec<T>
}

impl<T: ToString> __js__Array<T> {
    fn new(_val: Vec<T>) -> __js__Array<T> {
        __js__Array { val: _val }
    }

    fn __js__push(&mut self, el: T) -> f64 {
        self.val.push(el);
        self.val.len() as f64
    }

    fn __js__length(&self) -> f64 {
        self.val.len() as f64
    }
}

impl<T: ToString> ToString for __js__Array<T> {
    fn to_str(&self) -> String {
        let mut ret = String::from("[");
        for val in self.val.iter() {
            ret.push_str(&(val.to_str()));
            ret.push_str(", ");
        }
        ret.pop();
        ret.pop();
        ret.push_str("]");
        ret
    }
}

impl<'a, T: ToString> ToString for &'a mut __js__Array<T> {
    fn to_str(&self) -> String {
        let mut ret = String::from("[");
        for val in self.val.iter() {
            ret.push_str(&(val.to_str()));
            ret.push_str(", ");
        }
        ret.pop();
        ret.pop();
        ret.push_str("]");
        ret
    }
}

impl<T: ToString> Index<f64> for __js__Array<T> {
    type Output = T;

    fn index(&self, idx: f64) -> &T {
        self.val.index(idx as usize)
    }
}

impl<T: ToString> IndexMut<f64> for __js__Array<T> {
    fn index_mut<'a>(&'a mut self, index: f64) -> &'a mut T {
        self.val.index_mut(index as usize)
    }
}

impl<T: ToString> TypeOf for __js__Array<T> {
    fn type_of(&self) -> String {
        String::from("object")
    }
}

impl<T: ToString> ToBool for __js__Array<T> {
    fn is_truthy(&self) -> bool {
        true
    }
}

