trait ToNum {
    fn to_num(&self) -> f64;
}

impl ToNum for bool {
    fn to_num(&self) -> f64 {
        match *self {
            true => 1.0,
            false => 0.0,
        }
    }
}

impl ToNum for f64 {
    fn to_num(&self) -> f64 {
        return *self;
    }
}
