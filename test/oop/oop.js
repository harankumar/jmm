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
    }
};

let x = new Foo(); // Hello from Foo!
let y = new Beep("boop"); // Hello from Beep!
y.beep(); // BEEP: boop
x.quork(); // boo
x.blork();
x.quork(); // boofoo