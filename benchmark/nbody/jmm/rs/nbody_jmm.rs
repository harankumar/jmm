fn main(){
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
    val: Vec<T>
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
    fn type_of(&self) -> String{
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
    __js__argv: __js__Array<String>
}

// let expression allowed because this file goes into the interior of main
let mut __js__process = Process {
    __js__argv: __js__Array::new(std::env::args().collect())
};
// First two elements of process.argv are not equivalent to node,
// but this preserves the indexes of the values after that
__js__process.__js__argv.val.insert(0, "".to_owned());


#[derive(Clone)]
    struct __js__Body {
        __js__x: f64,
__js__y: f64,
__js__z: f64,
__js__vx: f64,
__js__vy: f64,
__js__vz: f64,
__js__mass: f64
    }
    
    impl __js__Body {
        fn new(__js__x: f64, __js__y: f64, __js__z: f64, __js__vx: f64, __js__vy: f64, __js__vz: f64, __js__mass: f64) -> __js__Body {
let mut this = __js__Body { __js__x: 0.0, __js__y: 0.0, __js__z: 0.0, __js__vx: 0.0, __js__vy: 0.0, __js__vz: 0.0, __js__mass: 0.0 };
this.__js__x = __js__x;
;
this.__js__y = __js__y;
;
this.__js__z = __js__z;
;
this.__js__vx = __js__vx;
;
this.__js__vy = __js__vy;
;
this.__js__vz = __js__vz;
;
this.__js__mass = __js__mass;
;
this
}
        fn __js__offsetMomentum (&mut self, __js__px: f64, __js__py: f64, __js__pz: f64)  {
self.__js__vx = (((0.0 - (__js__px))) / (((((4.0) * (3.141592653589793))) * (3.141592653589793))));

self.__js__vy = (((0.0 - (__js__py))) / (((((4.0) * (3.141592653589793))) * (3.141592653589793))));

self.__js__vz = (((0.0 - (__js__pz))) / (((((4.0) * (3.141592653589793))) * (3.141592653589793))));

}
    }
    
    impl ToString for __js__Body {
        fn to_str(&self) -> String {
            String::from("[object Object]")
        }
    }
#[derive(Clone)]
 struct __js__NBodySystem {
     __js__bodies: __js__Array<__js__Body>
 }
 
 impl __js__NBodySystem {
     fn new(__js__bodies: __js__Array<__js__Body>) -> __js__NBodySystem {
    let mut this = __js__NBodySystem { __js__bodies: __js__Array::new(vec![]) };
    this.__js__bodies = __js__bodies;
;
let mut __js__px = 0.0;
;
let mut __js__py = 0.0;
;
let mut __js__pz = 0.0;
;
let mut __js__size = this.__js__bodies.__js__length();
;
{let mut __js__i = 0.0;
;
while(((__js__i) < (__js__size))){
let mut __js__b = (this.__js__bodies[__js__i]).clone();
let mut __js__m = __js__b.__js__mass;
__js__px += ((__js__b.__js__vx) * (__js__m));
__js__py += ((__js__b.__js__vy) * (__js__m));
__js__pz += ((__js__b.__js__vz) * (__js__m));

__js__i += 1.0;
}};
this.__js__bodies[0.0].__js__offsetMomentum(__js__px, __js__py, __js__pz);
;
    this
}
     fn __js__advance (&mut self, __js__dt: f64)  {
    let mut __js__distance;

let mut __js__dx;
let mut __js__dy;
let mut __js__dz;
let mut __js__mag;

let mut __js__size = self.__js__bodies.__js__length();

{let mut __js__i = 0.0;
;
while(((__js__i) < (__js__size))){
let mut __js__bodyi = (self.__js__bodies[__js__i]).clone();
{let mut __js__j = ((__js__i) + (1.0));
;
while(((__js__j) < (__js__size))){
let mut __js__bodyj = (self.__js__bodies[__js__j]).clone();
__js__dx = ((__js__bodyi.__js__x) - (__js__bodyj.__js__x));
__js__dy = ((__js__bodyi.__js__y) - (__js__bodyj.__js__y));
__js__dz = ((__js__bodyi.__js__z) - (__js__bodyj.__js__z));
__js__distance = __js__Math.__js__sqrt(((((((__js__dx) * (__js__dx))) + (((__js__dy) * (__js__dy))))) + (((__js__dz) * (__js__dz)))));
__js__mag = ((__js__dt) / (((((__js__distance) * (__js__distance))) * (__js__distance))));
__js__bodyi.__js__vx -= ((((__js__dx) * (__js__bodyj.__js__mass))) * (__js__mag));
__js__bodyi.__js__vy -= ((((__js__dy) * (__js__bodyj.__js__mass))) * (__js__mag));
__js__bodyi.__js__vz -= ((((__js__dz) * (__js__bodyj.__js__mass))) * (__js__mag));
__js__bodyj.__js__vx += ((((__js__dx) * (__js__bodyi.__js__mass))) * (__js__mag));
__js__bodyj.__js__vy += ((((__js__dy) * (__js__bodyi.__js__mass))) * (__js__mag));
__js__bodyj.__js__vz += ((((__js__dz) * (__js__bodyi.__js__mass))) * (__js__mag));
self.__js__bodies[__js__j] = __js__bodyj;

__js__j += 1.0;
}}self.__js__bodies[__js__i] = __js__bodyi;

__js__i += 1.0;
}}
{let mut __js__i = 0.0;
;
while(((__js__i) < (__js__size))){
let mut __js__body = (self.__js__bodies[__js__i]).clone();
__js__body.__js__x += ((__js__dt) * (__js__body.__js__vx));
__js__body.__js__y += ((__js__dt) * (__js__body.__js__vy));
__js__body.__js__z += ((__js__dt) * (__js__body.__js__vz));
self.__js__bodies[__js__i] = __js__body;

__js__i += 1.0;
}}
}

fn __js__energy (&mut self)  -> f64 {
    let mut __js__distance;

let mut __js__dx;
let mut __js__dy;
let mut __js__dz;

let mut __js__e = 0.0;

let mut __js__size = self.__js__bodies.__js__length();

{let mut __js__i = 0.0;
;
while(((__js__i) < (__js__size))){
let mut __js__bodyi = (self.__js__bodies[__js__i]).clone();
__js__e += ((((0.5) * (__js__bodyi.__js__mass))) * (((((((__js__bodyi.__js__vx) * (__js__bodyi.__js__vx))) + (((__js__bodyi.__js__vy) * (__js__bodyi.__js__vy))))) + (((__js__bodyi.__js__vz) * (__js__bodyi.__js__vz))))));
{let mut __js__j = ((__js__i) + (1.0));
;
while(((__js__j) < (__js__size))){
let mut __js__bodyj = (self.__js__bodies[__js__j]).clone();
__js__dx = ((__js__bodyi.__js__x) - (__js__bodyj.__js__x));
__js__dy = ((__js__bodyi.__js__y) - (__js__bodyj.__js__y));
__js__dz = ((__js__bodyi.__js__z) - (__js__bodyj.__js__z));
__js__distance = __js__Math.__js__sqrt(((((((__js__dx) * (__js__dx))) + (((__js__dy) * (__js__dy))))) + (((__js__dz) * (__js__dz)))));
__js__e -= ((((__js__bodyi.__js__mass) * (__js__bodyj.__js__mass))) / (__js__distance));

__js__j += 1.0;
}}
__js__i += 1.0;
}}
return (__js__e);

}
 }
 
 impl ToString for __js__NBodySystem {
     fn to_str(&self) -> String {
         String::from("[object Object]")
     }
 }
;
fn __js__Jupiter ()  -> __js__Body {
return (__js__Body::new(4.841431442464721, (0.0 - (1.1603200440274284)), (0.0 - (0.10362204447112311)), ((0.001660076642744037) * (365.24)), ((0.007699011184197404) * (365.24)), (((0.0 - (0.0000690460016972063))) * (365.24)), ((0.0009547919384243266) * (((((4.0) * (3.141592653589793))) * (3.141592653589793))))));
 
 };
fn __js__Saturn ()  -> __js__Body {
return (__js__Body::new(8.34336671824458, 4.124798564124305, (0.0 - (0.4035234171143214)), (((0.0 - (0.002767425107268624))) * (365.24)), ((0.004998528012349172) * (365.24)), ((0.000023041729757376393) * (365.24)), ((0.0002858859806661308) * (((((4.0) * (3.141592653589793))) * (3.141592653589793))))));
 
 };
fn __js__Uranus ()  -> __js__Body {
return (__js__Body::new(12.894369562139131, (0.0 - (15.111151401698631)), (0.0 - (0.22330757889265573)), ((0.002964601375647616) * (365.24)), ((0.0023784717395948095) * (365.24)), (((0.0 - (0.000029658956854023756))) * (365.24)), ((0.00004366244043351563) * (((((4.0) * (3.141592653589793))) * (3.141592653589793))))));
 
 };
fn __js__Neptune ()  -> __js__Body {
return (__js__Body::new(15.379697114850917, (0.0 - (25.919314609987964)), 0.17925877295037118, ((0.0026806777249038932) * (365.24)), ((0.001628241700382423) * (365.24)), (((0.0 - (0.00009515922545197159))) * (365.24)), ((0.000051513890204661145) * (((((4.0) * (3.141592653589793))) * (3.141592653589793))))));
 
 };
fn __js__Sun ()  -> __js__Body {
return (__js__Body::new(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, ((((4.0) * (3.141592653589793))) * (3.141592653589793))));
 
 };
;
;
let mut __js__n = (0.0 + (__js__process.__js__argv[2.0]).to_num());
let mut __js__bodies = __js__NBodySystem::new(__js__Array::new(vec![__js__Sun(), __js__Jupiter(), __js__Saturn(), __js__Uranus(), __js__Neptune()]));
__js__console.__js__log(__js__bodies.__js__energy().__js__toFixed(9.0));
{let mut __js__i = 0.0;
;
 while(((__js__i) < (__js__n))){
__js__bodies.__js__advance(0.01);

__js__i += 1.0;
}}__js__console.__js__log(__js__bodies.__js__energy().__js__toFixed(9.0));

}