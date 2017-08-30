struct NaN {}

impl Clone for NaN {
    fn clone(&self) -> NaN {
        return NaN {};
    }
}
