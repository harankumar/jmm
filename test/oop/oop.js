function Beep(msg) {
    this.msg = msg;
    console.log("Hello from Beep!");
}

Beep.prototype = {
    beep: function () {
        console.log("BEEP: " + this.msg);
    }
};

function Foo() {
    this.a = "boo";
    console.log("Hello from Foo!");
}

Foo.prototype = {
    blork: function () {
        this.a += "foo";
    },
    quork: function () {
        console.log(this.a);
    },
    zork: function (msg) {
        return this.a + msg;
    }
};

Foo.prototype.nork = function(){
    console.log("nork");
};

function baz(x) {
    console.log("BAZ: " + x.a + x.zork("boo"));
}

function bar(x) {
    x.a += "bar";
}

let x = new Foo(); // Hello from Foo!
let y = new Beep("boop"); // Hello from Beep!
y.beep(); // BEEP: boop
x.quork(); // boo
x.blork();
x.quork(); // boofoo
let p = x.zork("memes");
console.log(p); // boofoomemes
baz(x); // BAZ: boofooboofooboo
bar(x);
x.quork(); // boofoobar
x.nork(); // nork