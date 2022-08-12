var myGamePiece;

function startGame() {
    myGamePiece = new component(15, 26, "red", 225, 225);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1340;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
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
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {

    this.type = type;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.delta = 0.05;
    this.deltaSpeed = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();    
    }
    this.newPos = function() {
        // if(this.speed == 0)
        //     this.deltaSpeed = 0;
        // else
            this.deltaSpeed += this.delta;
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += (this.deltaSpeed) * Math.sin(this.angle);
        this.y -= (this.deltaSpeed) * Math.cos(this.angle)
        document.getElementById("speed").innerText = "Speed:" + (this.speed);
        document.getElementById("delta").innerText = "Delta:" + this.delta + " = " + this.deltaSpeed;
    }

    this.accelerate = function(n) {
        this.delta = n
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.moveAngle = -4; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.moveAngle = 4; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speed= 4; accelerate(0.1)}
    else if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed= -4; accelerate(-0.3)}
    //else {accelerate(-0.05)}
    myGamePiece.newPos();
    myGamePiece.update();
}

function accelerate(n) {
    myGamePiece.delta = n;
}