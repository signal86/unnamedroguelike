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

    static collide(box, entity) {
        const box_center = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
        const entity_center = { x: entity.pos.x + entity.hitbox.x / 2, y: entity.pos.y + entity.hitbox.y / 2 };

        const min_dist = { x: entity.hitbox.x / 2 + box.w / 2, y: entity.hitbox.y / 2 + box.h / 2 };
        const delta = { x: box_center.x - entity_center.x, y: box_center.y - entity_center.y };
    
        if (Math.abs(delta.x) <= min_dist.x && Math.abs(delta.y) <= min_dist.y) {
            const overlap = { x: Math.abs(delta.x) - min_dist.x, y: Math.abs(delta.y) - min_dist.y };

            if (overlap.x > overlap.y) {
                const bounce_dir = delta.x > 0 ? 1 : -1;

                entity.pos.x += overlap.x * bounce_dir;
                entity.vel.x = 0;
            } else {
                const bounce_dir = delta.y > 0 ? 1 : -1;

                entity.pos.y += overlap.y * bounce_dir;
                entity.vel.y = 0;

                if (bounce_dir == 1) {
                    entity.isGrounded = true;
                    entity.jumpInputTime = 1.0;
                }
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
    isGrounded: false,
    jumpInputTime: 1.0
    
}

const dampingFactor = 17.5;
const moveSpeed = 115;
const gravity = 2500;
const jumpForce = 450;
const jumpBoost = 80;

let lastFrame = performance.now();

window.addEventListener('keydown', event => {
    keyMap[event.key.toLowerCase()] = true;
});

window.addEventListener('keyup', event => { 
    console.log(keyMap);
    keyMap[event.key.toLowerCase()] = false;
    if (event.key = "w") player.jumpInputTime = 0;
});

ctx.imageSmoothingEnabled = false;

function gameLoop() {

    const dt = (performance.now() - lastFrame) / 1000;
    lastFrame = performance.now();
    
    
    ctx.translate(-1 * (player.vel.x * dt), 0);
    
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    if (keyMap.a || keyMap.arrowleft) player.vel.x -= moveSpeed;
    if (keyMap.d || keyMap.arrowright) player.vel.x += moveSpeed;
    if (keyMap.w || keyMap.arrowup || keyMap[" "]) {
        if (player.jumpInputTime == 1.0) {
            player.pos.y -= 1;
            player.vel.y -= jumpForce;
            player.jumpInputTime -= 0.15;
            console.log("jump");
            
        } else if (player.jumpInputTime > 0) {
            player.vel.y -= jumpBoost;
            player.jumpInputTime -= 0.15;
            console.log("jump");
        }
    }
    
    player.pos.x += player.vel.x * dt;
    player.pos.y += player.vel.y * dt;
    
    player.vel.x /= 1 + dampingFactor * dt;

    player.isGrounded = false;
    
    for (const box of boxes) {
        WallCollision.collide(box, player);
        box.drawHitbox();
    }

    if (player.pos.y + player.hitbox.y >= canvas.height) {
        player.isGrounded = true;
        player.jumpInputTime = 1.0;
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