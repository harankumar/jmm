// TODO -- change prefixing

fn js_and<T: ToBool>(a: T, b: T) -> T {
    match a.is_truthy() {
        true => b,
        false => a,
    }
}

fn js_or<T: ToBool>(a: T, b: T) -> T {
    match a.is_truthy() {
        true => a,
        false => b,
    }
}

fn js_not<T: ToBool>(a: T) -> bool {
    return !a.is_truthy();
}
