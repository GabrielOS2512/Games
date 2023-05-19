let car1;
let car2;
let walls = [];
let checkPoints = [];
let gameTick = 0;

function startGame1() {
    ///Create Walls
    walls.push(new Wall(10, 440, "green", 80, 80));
    walls.push(new Wall(500, 10, "green", 80, 80));
    walls.push(new Wall(300, 200, "green", 700, 0));
    walls.push(new Wall(20, 440, "green", 180, 180));
    walls.push(new Wall(90, 50, "green", 180, 170));
    walls.push(new Wall(250, 240, "green", 350, 80));
    walls.push(new Wall(800, 110, "green", 280, 290));
    walls.push(new Wall(800, 120, "green", 280, 400));
    walls.push(new Wall(130, 300, "green", 1080, 100));
    walls.push(new Wall(120, 120, "green", 1180, 490));
    ///Create Players
    car1 = new Car(12, 20, "blue", 20, 400);
    car2 = new Car(12, 20, "red", 55, 400);
    myGameArea.start();
}

function startGame() {
    ///Create Walls
    walls.push(new Wall(20, 450, "green", 80, 80));
    walls.push(new Wall(500, 30, "green", 80, 70));
    walls.push(new Wall(300, 200, "green", 700, 0));
    walls.push(new Wall(20, 440, "green", 180, 180));
    walls.push(new Wall(240, 50, "green", 180, 170));
    walls.push(new Wall(50, 160, "green", 410, 170));
    walls.push(new Wall(80, 240, "green", 530, 70));
    walls.push(new Wall(90, 100, "green", 910, 200));
    walls.push(new Wall(280, 30, "green", 800, 370));
    walls.push(new Wall(300, 110, "green", 530, 290));
    walls.push(new Wall(800, 120, "green", 280, 400));
    
    walls.push(new Wall(60, 100, "green", 280, 300));
    walls.push(new Wall(130, 300, "green", 1080, 100));
    walls.push(new Wall(120, 120, "green", 1180, 490));
    ///Create Players
    car1 = new Car(12, 20, "blue", 20, 400);
    car2 = new Car(12, 20, "red", 55, 400);
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1300;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    myGameArea.clear();
    car1.moveAngle = 0;
    car2.moveAngle = 0;

    /// Build Walls
    for (i = 0; i < walls.length; i += 1) {
        walls[i].update();
    }

    ///Player 1
    if (myGameArea.keys && myGameArea.keys[37]) { car1.left() } ///left
    if (myGameArea.keys && myGameArea.keys[39]) { car1.right() } ///right
    if (myGameArea.keys && myGameArea.keys[32]) { car1.break() } ///space
    if (myGameArea.keys && myGameArea.keys[38]) { car1.accelerate() } ///up
    else if (myGameArea.keys && myGameArea.keys[40]) { car1.backwards() } ///down
    else { car1.pedalReleased() } ///released
    ///Player 2
    if (myGameArea.keys && myGameArea.keys[65]) { car2.left() } ///A
    if (myGameArea.keys && myGameArea.keys[68]) { car2.right() } ///D
    if (myGameArea.keys && myGameArea.keys[88]) { car2.break() } ///X
    if (myGameArea.keys && myGameArea.keys[87]) { car2.accelerate() } ///W
    else if (myGameArea.keys && myGameArea.keys[83]) { car2.backwards() } ///S
    else { car2.pedalReleased() } ///released

    /// Collide with walls
    for (i = 0; i < walls.length; i += 1) {
        if (car1.crashWith(walls[i])) {
            car1.speed = 0.5
        }
    }

    car1.checkCollision();
    //car2.checkCollision();
    car1.newPos();
    car1.update();
    //car2.newPos();
    //car2.update();

    gameTick++;
    document.getElementById("tick").innerText = "Game Tick: " + (gameTick);
}

function Car(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.speed = 0;
    this.maxSpeed = 7;
    this.minSpeed = -2;
    this.delta = 0; // speed variation
    this.acceleration = 0.001;
    this.maxAcceleration = 0.05;
    this.braking = 0.2;
    /// stearing
    this.angle = 0;
    this.moveAngle = 0;
    /// car condition
    this.hp = 100;
    this.tyres = 1.0;
    this.fuel = 1.0;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        if (this.delta !== 0)
            this.speed += this.delta

        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        } else if (this.speed < this.minSpeed) {
            this.speed = this.minSpeed;
        }

        this.angle += this.moveAngle * Math.PI / 180;
        this.x += (this.speed) * Math.sin(this.angle);
        this.y -= (this.speed) * Math.cos(this.angle)
        document.getElementById("speed").innerText = "Speed: " + (this.speed).toFixed(2) +
            "   Delta: " + (this.delta).toFixed(2) +
            "   Fuel: " + ((this.fuel) * 100).toFixed(2) +
            "%   Tyres: " + ((this.tyres) * 100).toFixed(2) + "%";
        document.getElementById("position").innerText = "X: " + (this.x).toFixed(2) + " Y: " + (this.y).toFixed(2);
    }

    this.accelerate = function () {
        if (this.delta < 0)
            this.delta = 0;

        if (this.delta > this.maxAcceleration)
            this.delta = this.maxAcceleration
        else
            this.delta += this.acceleration

        this.fuel -= 0.00008
        this.tyres -= 0.000003
    }

    this.break = function () {
        if (this.speed > 0.1) {
            this.speed -= this.braking
            this.tyres -= 0.0003
        } else if (this.speed < -0.1) {
            this.speed += this.braking
            this.tyres -= 0.0003
        } else
            this.speed = 0
    }

    this.backwards = function () {
        if (this.delta < -0.02){
            this.delta = -0.02
            this.tyres -= 0.00002
        } else {
            this.delta -= this.braking
            this.tyres -= 0.000003
        }
    }

    this.pedalReleased = function () {
        if (this.speed > 0.1) {
            this.delta -= 0.004
        }/* else if (this.speed < -0.1) {
            //this.speed += 0.01
            this.delta += 0.01
        }*/ else {
            this.speed = 0
            this.delta = 0
        }
    }

    this.right = function () {
        if (this.speed == 0) {
            this.moveAngle = 0
        } else if (this.speed <= 1) {            
            this.moveAngle = 1
            this.tyres -= 0.00002
        } else if (this.speed <= 3) {
            this.moveAngle = 4
            this.tyres -= 0.00005
        } else {
            this.moveAngle = 3
            this.tyres -= 0.0001
        }
    }
    this.left = function () {
        if (this.speed == 0) {
            this.moveAngle = 0
        } else if (this.speed <= 1) {            
            this.moveAngle = -1
            this.tyres -= 0.00002
        } else if (this.speed <= 3) {
            this.moveAngle = -4
            this.tyres -= 0.00005
        } else {
            this.moveAngle = -3
            this.tyres -= 0.0001
        }
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

    this.checkCollision = function () {
        let top = 0
        let left = 0
        let right = myGameArea.canvas.width - this.width / 2;
        let bottom = myGameArea.canvas.height - this.height / 2;
        if (this.y < top) {
            this.speed = 1
            this.y = top
        }
        if (this.y > bottom) {
            this.speed = 1
            this.y = bottom
        }
        if (this.x < left) {
            this.speed = 1
            this.x = left
        }
        if (this.x > right) {
            this.speed = 1
            this.x = right
        }
        return false;
    }
}

function Wall(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}