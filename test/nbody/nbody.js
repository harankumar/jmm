/* The Computer Language Benchmarks Game
   http://benchmarksgame.alioth.debian.org/
   contributed by Isaac Gouy */

// var PI = 3.141592653589793;
// var SOLAR_MASS = (4 * 3.141592653589793 * 3.141592653589793);
// var DAYS_PER_YEAR = 365.24;

function Body(x,y,z,vx,vy,vz,mass){
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
    this.mass = mass;
}

Body.prototype.offsetMomentum = function(px,py,pz) {
    this.vx = -px / (4 * 3.141592653589793 * 3.141592653589793);
    this.vy = -py / (4 * 3.141592653589793 * 3.141592653589793);
    this.vz = -pz / (4 * 3.141592653589793 * 3.141592653589793);
    // return this;
}

function Jupiter(){
    return new Body(
        4.84143144246472090e+00,
        -1.16032004402742839e+00,
        -1.03622044471123109e-01,
        1.66007664274403694e-03 * 365.24,
        7.69901118419740425e-03 * 365.24,
        -6.90460016972063023e-05 * 365.24,
        9.54791938424326609e-04 * (4 * 3.141592653589793 * 3.141592653589793)
    );
}

function Saturn(){
    return new Body(
        8.34336671824457987e+00,
        4.12479856412430479e+00,
        -4.03523417114321381e-01,
        -2.76742510726862411e-03 * 365.24,
        4.99852801234917238e-03 * 365.24,
        2.30417297573763929e-05 * 365.24,
        2.85885980666130812e-04 * (4 * 3.141592653589793 * 3.141592653589793)
    );
}

function Uranus(){
    return new Body(
        1.28943695621391310e+01,
        -1.51111514016986312e+01,
        -2.23307578892655734e-01,
        2.96460137564761618e-03 * 365.24,
        2.37847173959480950e-03 * 365.24,
        -2.96589568540237556e-05 * 365.24,
        4.36624404335156298e-05 * (4 * 3.141592653589793 * 3.141592653589793)
    );
}

function Neptune(){
    return new Body(
        1.53796971148509165e+01,
        -2.59193146099879641e+01,
        1.79258772950371181e-01,
        2.68067772490389322e-03 * 365.24,
        1.62824170038242295e-03 * 365.24,
        -9.51592254519715870e-05 * 365.24,
        5.15138902046611451e-05 * (4 * 3.141592653589793 * 3.141592653589793)
    );
}

function Sun(){
    return new Body(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, (4 * 3.141592653589793 * 3.141592653589793));
}


function NBodySystem(bodies){
    this.bodies = bodies;
    var px = 0.0;
    var py = 0.0;
    var pz = 0.0;
    /** @type {number} */
    var size = this.bodies.length;
    for (var i=0; i<size; i++){
        var b = Object.assign({}, this.bodies[i]);
        /** @type {number} */
        var m = b.mass;
        px += b.vx * m;
        py += b.vy * m;
        pz += b.vz * m;
    }
    this.bodies[0].offsetMomentum(px,py,pz);
}

NBodySystem.prototype.advance = function(dt){
    /** @type {number} */
    var distance;
    var dx, dy, dz, mag;
    /** @type {number} */
    var size = this.bodies.length;

    for (var i=0; i<size; i++) {
        /** @type {Body} */
        var bodyi = Object.assign({}, this.bodies[i]);
        for (var j=i+1; j<size; j++) {
            /** @type {Body} */
            var bodyj = Object.assign({}, this.bodies[j]);
            dx = bodyi.x - bodyj.x;
            dy = bodyi.y - bodyj.y;
            dz = bodyi.z - bodyj.z;

            distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            mag = dt / (distance * distance * distance);

            bodyi.vx -= dx * bodyj.mass * mag;
            bodyi.vy -= dy * bodyj.mass * mag;
            bodyi.vz -= dz * bodyj.mass * mag;

            bodyj.vx += dx * bodyi.mass * mag;
            bodyj.vy += dy * bodyi.mass * mag;
            bodyj.vz += dz * bodyi.mass * mag;

            this.bodies[j] = bodyj;
        }
        this.bodies[i] = bodyi;
    }

    for (var i=0; i<size; i++) {
        /** @type {Body} */
        var body = Object.assign({}, this.bodies[i]);
        body.x += dt * body.vx;
        body.y += dt * body.vy;
        body.z += dt * body.vz;
        this.bodies[i] = body;
    }
}

NBodySystem.prototype.energy = function(){
    /** @type {number} */
    var distance;
    var dx, dy, dz;
    var e = 0.0;
    /** @type {number} */
    var size = this.bodies.length;

    for (var i=0; i<size; i++) {
        var bodyi = Object.assign({}, this.bodies[i]);

        e += 0.5 * bodyi.mass *
            ( bodyi.vx * bodyi.vx
                + bodyi.vy * bodyi.vy
                + bodyi.vz * bodyi.vz );

        for (var j=i+1; j<size; j++) {
            var bodyj = Object.assign({}, this.bodies[j]);
            dx = bodyi.x - bodyj.x;
            dy = bodyi.y - bodyj.y;
            dz = bodyi.z - bodyj.z;

            distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
            e -= (bodyi.mass * bodyj.mass) / distance;
        }
    }
    return e;
}


var n = +process.argv[2];
var bodies = new NBodySystem([
    Sun(),Jupiter(),Saturn(),Uranus(),Neptune()
]);

console.log(bodies.energy().toFixed(9));
for (var i=0; i<n; i++){ bodies.advance(0.01); }
console.log(bodies.energy().toFixed(9));