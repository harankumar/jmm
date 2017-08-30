fn js_and<T: JmmJsObject>(a: T, b: T) -> T {
    match a.is_truthy() {
        true => b,
        false => a,
    }
}

fn js_or<T: JmmJsObject>(a: T, b: T) -> T {
    match a.is_truthy() {
        true => a,
        false => b,
    }
}

fn js_not<T: JmmJsObject>(a: T) -> bool {
    return !a.is_truthy();
}
