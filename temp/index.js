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

    collide(entity) {
        console.log("collide method: " + entity.isGrounded);
        const box_center = { x: this.x + this.w / 2, y: this.y + this.h / 2 };
        const entity_center = { x: entity.pos.x + entity.hitbox.x / 2, y: entity.pos.y + entity.hitbox.y / 2 };

        const min_dist = { x: entity.hitbox.x / 2 + this.w / 2, y: entity.hitbox.y / 2 + this.h / 2 };
        const delta = { x: box_center.x - entity_center.x, y: box_center.y - entity_center.y };
    
        if (Math.abs(delta.x) <= min_dist.x && Math.abs(delta.y) <= min_dist.y) {
            const overlap = { x: Math.abs(delta.x) - min_dist.x, y: Math.abs(delta.y) - min_dist.y };

            if (overlap.x > overlap.y) {
                const bounce_dir = delta.x > 0 ? 1 : -1;

                entity.pos.x += overlap.x * bounce_dir;
                entity.vel.x = 0;
                console.log("x bounce");
            } else {
                const bounce_dir = delta.y > 0 ? 1 : -1;

                entity.pos.y += overlap.y * bounce_dir;
                entity.vel.y = 0;

                console.log("y bounce " + bounce_dir);
                if (bounce_dir == 1)
                    entity.isGrounded = true;
            }
        }
    }

    drawHitbox() {

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
    wallColliding: false,
    isGrounded: false
}

const dampingFactor = 17.5;
const moveSpeed = 115;
const gravity = 2500;
const jumpForce = 900;

let lastFrame = performance.now();

const isOnGround = playerY => playerY >= canvas.height;

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

ctx.imageSmoothingEnabled = false;

function gameLoop() {

    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    const dt = (performance.now() - lastFrame) / 1000;
    lastFrame = performance.now();
    
    
    ctx.translate(-1 * (player.vel.x * dt), 0);
    
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    if (keyMap.a) player.vel.x -= moveSpeed;
    if (keyMap.d) player.vel.x += moveSpeed;
    
    player.pos.x += player.vel.x * dt;
    player.pos.y += player.vel.y * dt;
    
    player.vel.x /= 1 + dampingFactor * dt;

    player.isGrounded = false;
    
    for (const box of boxes) {
        box.collide(player);
        box.drawHitbox();
        console.log(player.isGrounded);
    }

    if (player.pos.y + player.hitbox.y >= canvas.height) {
        player.isGrounded = true;
        player.pos.y = canvas.height - player.hitbox.y;
        player.vel.y = 0;
    }

    if (!player.isGrounded)
        player.vel.y += gravity * dt;
    
    ctx.fillStyle = "blue";
    ctx.fillRect(player.pos.x, player.pos.y, player.hitbox.x, player.hitbox.y);
    
    requestAnimationFrame(gameLoop);

}


WallCollision.addWall(1000, 700, 15, 100);
WallCollision.addWall(900, 700, 15, 100);
WallCollision.addWall(800, 600, 15, 160);
WallCollision.addWall(500, 675, 150, 50);
gameLoop();