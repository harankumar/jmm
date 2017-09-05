trait Array {
    fn length(&self) -> f64;
}

impl Array for Vec<String> {
    fn length(&self) -> f64 {
        self.len() as f64
    }
}