// TODO -- change prefixing

fn __jmm__and<T: ToBool>(a: T, b: T) -> T {
    match a.is_truthy() {
        true => b,
        false => a,
    }
}

fn __jmm__or<T: ToBool>(a: T, b: T) -> T {
    match a.is_truthy() {
        true => a,
        false => b,
    }
}

fn __jmm__not<T: ToBool>(a: T) -> bool {
    !a.is_truthy()
}
