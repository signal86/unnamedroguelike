const canvas = document.querySelector("#game-canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1200
canvas.height = 800

const currentKeysPressed = {};

const background = new Image();
background.src = "./Assets/space.jpg";

const player = {
    pos: {
        x: 600,
        y: 400
    },
    vel: {
        x: 0,
        y: 0
    },
    hitbox: {
        x: 40,
        y: 50
    }
}

const dampingFactor = 17.5;
const moveSpeed = 115;
const gravity = 2500;
const jumpForce = 900;

let lastFrame = performance.now();

function gameLoop(){
    const dt = (performance.now() - lastFrame) / 1000;
    lastFrame = performance.now();

    
    player.pos.x += player.vel.x * dt
    player.pos.y += player.vel.y * dt
    
    applyGravity(player, gravity, dt)
    playerMovement()

    player.vel.x /= 1 + dampingFactor * dt;

    // console.log(currentKeysPressed)

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "blue"
    ctx.fillRect(player.pos.x, player.pos.y, player.hitbox.x, -1*player.hitbox.y)

    requestAnimationFrame(gameLoop)
}


const isOnGround = playerY => playerY >= canvas.height


function applyGravity(entity, force, dt){
    if (!isOnGround(entity.pos.y)){
        entity.vel.y += force * dt
    } else {
        entity.vel.y = 0
        entity.pos.y = canvas.height
    }
}

function playerMovement(){
    if (currentKeysPressed["a"] == true) player.vel.x -= moveSpeed;
    if (currentKeysPressed["d"] == true) player.vel.x += moveSpeed;
}

gameLoop();

function onKeypress(event) {
    
    if (event.key.toLowerCase() == "a" || event.key.toLowerCase() == "d" || event.key.toLowerCase() == "arrowleft" || event.key.toLowerCase() == "arrowright") currentKeysPressed[event.key.toLowerCase()] = true;
    if ((event.key.toLowerCase() == "arrowup" || event.key.toLowerCase() == "w" || event.key.toLowerCase() == " ") && isOnGround(player.pos.y)){
        player.pos.y -= 1
        player.vel.y -= jumpForce
        console.log("jump")
    }
}

function onKeyUp(event) {
    if (event.key == "a" || event.key == "d") currentKeysPressed[event.key] = false;
}

window.addEventListener('keydown', onKeypress);
window.addEventListener('keyup', onKeyUp);