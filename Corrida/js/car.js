let carX = 0; // starting position
let carY = 0;
let carSpeed = 0; // starting speed
let acceleration = 0.2; // how quickly the car accelerates
let maxSpeed = 5; // the maximum speed the car can reach

function accelerate() {
    carSpeed += acceleration; // increase speed
    if (carSpeed > maxSpeed) { // check if max speed is exceeded
        carSpeed = maxSpeed;
    }
    carX += carSpeed; // move the car based on its speed
}

function decelerate() {
    carSpeed -= acceleration; // decrease speed
    if (carSpeed < 0) { // prevent negative speed
        carSpeed = 0;
    }
    carX += carSpeed; // move the car based on its speed
}