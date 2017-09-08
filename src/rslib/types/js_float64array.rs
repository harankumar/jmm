use std::ops::{Index, IndexMut};

struct __js__Float64Array {
    val: Vec<f64>,
    __js__length: f64
}

impl __js__Float64Array {
    fn new(size: f64) -> __js__Float64Array {
        __js__Float64Array {
            val: vec![0.0; size as usize],
            __js__length: size
        }
    }
}

impl Index<f64> for __js__Float64Array {
    type Output = f64;

    fn index(&self, idx: f64) -> &f64 {
        self.val.index(idx as usize)
    }
}

impl IndexMut<f64> for __js__Float64Array {
    fn index_mut<'a>(&'a mut self, index: f64) -> &'a mut f64 {
        self.val.index_mut(index as usize)
    }
}