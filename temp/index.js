const canvas = document.querySelector("#game-canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1200
canvas.height = 800

const FPS = 40

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

function gameLoop(){

    gravity(player, 2)
    playerMovement()

    player.pos.x += player.vel.x
    player.pos.y += player.vel.y

    player.vel.x /= 2

    console.log(currentKeysPressed)

    ctx.imageSmoothingEnabled = false
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "blue"
    ctx.fillRect(player.pos.x, player.pos.y, player.hitbox.x, -1*player.hitbox.y)
}

function isOnGround(pos){
    if (pos.y >= canvas.height) return true
    else return false
}

function gravity(entity, force){
    if (!isOnGround(entity.pos)){
        entity.vel.y += force
    } else {
        entity.vel.y = 0
        entity.pos.y = canvas.height
    }
}

function playerMovement(){
    if (currentKeysPressed["a"] == true) player.vel.x -= 5
    if (currentKeysPressed["d"] == true) player.vel.x += 5
}

gameInterval = setInterval(gameLoop, 1000 / FPS)

function onKeypress(event) {
    if (event.key == "a" || event.key == "d") currentKeysPressed[event.key] = true;
    if (event.key == "w" && isOnGround(player.pos)){
        player.pos.y -= 1
        player.vel.y -= 23
        console.log("jump")
    }
}

function onKeyUp(event) {
    if (event.key == "a" || event.key == "d") currentKeysPressed[event.key] = false;
}

window.addEventListener('keydown', onKeypress);
window.addEventListener('keyup', onKeyUp);