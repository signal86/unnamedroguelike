const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 800;

const boxes = [];


const keyMap = {};

const background = new Image();
background.src = "./Assets/testbackground.png";

class WallCollision {

    static addWall(x, y, w, h) {

        boxes.push(new WallCollision(x, y, w, h));

    }

    constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

    }

    collide(box, player) {
        
    }

    draw() {

        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.w, this.h);

    }

}

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
    },
    wallColliding: false
}

const dampingFactor = 17.5;
const moveSpeed = 115;
const gravity = 2500;
const jumpForce = 900;

let lastFrame = performance.now();


const isOnGround = playerY => playerY >= canvas.height;


function applyGravity(entity, force, dt) {
    if (!isOnGround(entity.pos.y + entity.hitbox.y)){
        entity.vel.y += force * dt;
    } else {
        entity.vel.y = 0;
        entity.pos.y = canvas.height - entity.hitbox.y;
    }
}

function playerMovement() {
    if (player.wallColliding)
        console.log("uhoh!");

    if (keyMap.a) player.vel.x -= moveSpeed;
    if (keyMap.d) player.vel.x += moveSpeed;
    let v = false;
    for (const box of boxes) {
        // console.log("box.x = " + box.x + "\nplayer = " + player.hitbox.x + player.vel.x);
        if (
            box.x <= player.hitbox.x + player.pos.x &&
            box.x + box.w >= player.pos.x &&
            box.y <= player.hitbox.y + player.pos.y &&
            box.y + box.h >= player.pos.y
        ) {
            v = true;
            player.wallColliding = true;
        }
    } if (!v) player.wallColliding = false;
}

window.addEventListener('keydown', event => {
    keyMap[event.key.toLowerCase()] = true;
    
    // if ((event.key.toLowerCase() == "arrowup" || event.key.toLowerCase() == "w" || event.key.toLowerCase() == " ") && isOnGround(player.pos.y + player.hitbox.y)){
    if (isOnGround(player.pos.y + player.hitbox.y)) {
        switch (event.key.toLowerCase()) {
            case "arrowup":
            case "w":
            case " ":
                player.pos.y -= 1;
                player.vel.y -= jumpForce;
                console.log("jump");
        }
    }
});

window.addEventListener('keyup', event => { keyMap[event.key] = false; });


function gameLoop() {

    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dt = (performance.now() - lastFrame) / 1000;
    lastFrame = performance.now();
    
    
    ctx.translate(-1 * (player.vel.x * dt), 0);
    
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    player.pos.x += player.vel.x * dt;
    player.pos.y += player.vel.y * dt;
    
    applyGravity(player, gravity, dt);
    playerMovement();
    
    player.vel.x /= 1 + dampingFactor * dt;
    
    // console.log(currentKeysPressed)
    
    
    ctx.fillStyle = "blue";
    ctx.fillRect(player.pos.x, player.pos.y, player.hitbox.x, player.hitbox.y);
    
    for (const box of boxes) box.draw();
    requestAnimationFrame(gameLoop);

}


// WallCollision.addWall(1500, 700, 15, 100);
WallCollision.addWall(1000, 700, 15, 100);
WallCollision.addWall(900, 700, 15, 100);
WallCollision.addWall(800, 600, 15, 160);
gameLoop();