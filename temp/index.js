const canvas = document.querySelector("#game-canvas")
const ctx = canvas.getContext("2d")

canvas.width = 1200
canvas.height = 800

const FPS = 24

const background = new Image();
background.src = "./Assets/testbackground.png";

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
    
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "black"
    ctx.fillRect(player.pos.x, player.pos.y, player.hitbox.x, -1*player.hitbox.y)
}

gameInterval = setInterval(gameLoop, 1000 / FPS)
