impl TypeOf for f64 {
    fn type_of(&self) -> String {
        String::from("number")
    }
}

impl ToBool for f64 {
    fn is_truthy(&self) -> bool {
        match *self {
            0.0 => false,
            _ => true,
        }
    }
}

impl ToString for f64 {
    fn to_str(&self) -> String {
        // TODO -- fully flesh this out
        (*self).to_string()
    }
}

impl ToNum for f64 {
    fn to_num(&self) -> f64 {
        *self
    }
}

trait __js__Number {
    fn __js__toFixed(&self, n: f64) -> String;
}

impl __js__Number for f64 {
    fn __js__toFixed(&self, n: f64) -> String {
        let m = n as usize;
        assert!(n >= 0.0 && m <= 20, "n must be between 0 and 20 inclusive!");

        let x = *self;

        let sign = (if x >= 0.0 { "" } else { "-" });
        let whole = (if x > 0.0 { x.floor() } else { x.ceil() });
        let frac = (x - whole).abs();

        let mut fst = sign.to_string();
        fst.push_str(&whole.to_string());
        fst.push_str(".");
        let mut snd = frac.to_string();
        snd.push_str("000000000000000000000");

        fst.push_str(&snd[2..(m + 2)]);
        fst
    }
}