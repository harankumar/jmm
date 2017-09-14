fn main() {
    trait ToBool {
        fn is_truthy(&self) -> bool;
    }

    trait ToNum {
        fn to_num(&self) -> f64;
    }

    trait ToString {
        fn to_str(&self) -> String;
    }

    trait TypeOf {
        fn type_of(&self) -> String;
    }

    impl TypeOf for bool {
        fn type_of(&self) -> String {
            String::from("boolean")
        }
    }

    impl ToBool for bool {
        fn is_truthy(&self) -> bool {
            *self
        }
    }

    impl ToString for bool {
        fn to_str(&self) -> String {
            match *self {
                true => String::from("true"),
                false => String::from("false"),
            }
        }
    }

    impl ToNum for bool {
        fn to_num(&self) -> f64 {
            match *self {
                true => 1.0,
                false => 0.0,
            }
        }
    }

    #[derive(Clone)]
    struct __js__Array<T: ToString> {
        val: Vec<T>,
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



    use std::ops::{Index, IndexMut};

    struct __js__Float64Array {
        val: Vec<f64>,
        __js__length: f64,
    }

    impl __js__Float64Array {
        fn new(size: f64) -> __js__Float64Array {
            __js__Float64Array {
                val: vec![0.0; size as usize],
                __js__length: size,
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

    struct __js__NaN;

    impl Clone for __js__NaN {
        fn clone(&self) -> __js__NaN {
            __js__NaN
        }
    }


    impl TypeOf for __js__NaN {
        fn type_of(&self) -> String {
            String::from("number")
        }
    }

    impl ToBool for __js__NaN {
        fn is_truthy(&self) -> bool {
            false
        }
    }

    impl ToString for __js__NaN {
        fn to_str(&self) -> String {
            String::from("__js__NaN")
        }
    }


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

    impl TypeOf for String {
        fn type_of(&self) -> String {
            String::from("string")
        }
    }

    impl ToBool for String {
        fn is_truthy(&self) -> bool {
            match (*self).len() {
                0 => false,
                _ => true,
            }
        }
    }

    impl ToString for String {
        fn to_str(&self) -> String {
            (*self).clone()
        }
    }

    impl ToNum for String {
        fn to_num(&self) -> f64 {
            (*self).parse().unwrap()
        }
    }

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


    struct Console;

    impl Console {
        fn __js__log<T: ToString>(&self, x: T) {
            println!("{}", x.to_str())
        }
    }

    static __js__console: Console = Console;


    struct Math;

    impl Math {
        fn __js__sqrt(&self, a: f64) -> f64 {
            a.sqrt()
        }
    }

    static __js__Math: Math = Math;

    struct Process {
        __js__argv: __js__Array<String>,
    }

    // let expression allowed because this file goes into the interior of main
    let mut __js__process = Process { __js__argv: __js__Array::new(std::env::args().collect()) };
    // First two elements of process.argv are not equivalent to node,
    // but this preserves the indexes of the values after that
    __js__process.__js__argv.val.insert(0, "".to_owned());


    fn __js__fannkuch(__js__n: f64) -> __js__Array<f64> {
        let mut __js__p = __js__Array::new(vec![]);
        let mut __js__q = __js__Array::new(vec![]);
        let mut __js__s = __js__Array::new(vec![]);
        let mut __js__sign = 1.0;
        let mut __js__maxflips = 0.0;
        let mut __js__sum = 0.0;
        let mut __js__m = ((__js__n) - (1.0));
        {
            let mut __js__i = 0.0;
            while (((__js__i) < (__js__n))) {
                __js__p.__js__push(__js__i);
                __js__q.__js__push(__js__i);
                __js__s.__js__push(__js__i);

                __js__i += 1.0;
            }
        }
        loop {
            let mut __js__q0 = __js__p[0.0];
            if (((__js__q0) != (0.0))) {
                {
                    let mut __js__i = 1.0;
                    while (((__js__i) < (__js__n))) {
                        __js__q[__js__i] = __js__p[__js__i];

                        __js__i += 1.0;
                    }
                }
                let mut __js__flips = 1.0;
                loop {
                    let mut __js__qq = __js__q[__js__q0];
                    if (((__js__qq) == (0.0))) {
                        __js__sum += ((__js__sign) * (__js__flips));
                        if (((__js__flips) > (__js__maxflips))) {
                            __js__maxflips = __js__flips;
                        }
                        break;
                    }
                    __js__q[__js__q0] = __js__q0;
                    if (((__js__q0) >= (3.0))) {
                        let mut __js__i = 1.0;
                        let mut __js__j = ((__js__q0) - (1.0));
                        let mut __js__t;
                        loop {
                            __js__t = __js__q[__js__i];
                            __js__q[__js__i] = __js__q[__js__j];
                            __js__q[__js__j] = __js__t;
                            __js__i += 1.0;
                            __js__j -= 1.0;

                            if (!(((__js__i) < (__js__j)))) {
                                break;
                            }
                        }
                    }
                    __js__q0 = __js__qq;
                    __js__flips += 1.0;

                    if (!(true)) {
                        break;
                    }
                }
            }
            if (((__js__sign) == (1.0))) {
                let mut __js__t = __js__p[1.0];
                __js__p[1.0] = __js__p[0.0];
                __js__p[0.0] = __js__t;
                __js__sign = (0.0 - (1.0));
            } else {
                let mut __js__t = __js__p[1.0];
                __js__p[1.0] = __js__p[2.0];
                __js__p[2.0] = __js__t;
                __js__sign = 1.0;
                {
                    let mut __js__i = 2.0;
                    while (((__js__i) < (__js__n))) {
                        let mut __js__sx = __js__s[__js__i];
                        if (((__js__sx) != (0.0))) {
                            __js__s[__js__i] = ((__js__sx) - (1.0));
                            break;
                        }
                        if (((__js__i) == (__js__m))) {
                            return (__js__Array::new(vec![__js__sum, __js__maxflips]));
                        }
                        __js__s[__js__i] = __js__i;
                        __js__t = __js__p[0.0];
                        {
                            let mut __js__j = 0.0;
                            while (((__js__j) <= (__js__i))) {
                                __js__p[__js__j] = __js__p[((__js__j) + (1.0))];

                                __js__j += 1.0;
                            }
                        }
                        __js__p[((__js__i) + (1.0))] = __js__t;

                        __js__i += 1.0;
                    }
                }
            }

            if (!(true)) {
                break;
            }
        }
        return __js__Array::new(vec![]);
    };
    let mut __js__n = (0.0 + (__js__process.__js__argv[2.0]).to_num());
    let mut __js__pf = __js__fannkuch(__js__n);
    __js__console.__js__log(
        ([
            ([
                ([
                    ([
                        ([
                            (__js__pf[0.0]).to_str(),
                            (String::from(
                                "
",
                            )).to_str(),
                        ].join(""))
                            .to_str(),
                        (String::from("Pfannkuchen(")).to_str(),
                    ].join(""))
                        .to_str(),
                    (__js__n).to_str(),
                ].join(""))
                    .to_str(),
                (String::from(") = ")).to_str(),
            ].join(""))
                .to_str(),
            (__js__pf[1.0]).to_str(),
        ].join(""))
            .clone(),
    );

}
