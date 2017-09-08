struct Math;

impl Math {
    fn __js__sqrt(&self, a: f64) -> f64 {
        a.sqrt()
    }
}

static __js__Math: Math = Math;