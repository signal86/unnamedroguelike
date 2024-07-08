const canvas = document.querySelector("#render_canvas");
const ctx = canvas.getContext("2d");

canvas.width = 640
canvas.height = 360

const background = new Image();
background.src = "./prototypeBackground02.png"

for (let x = 0; x < canvas.width; x += 40) {
	for (let y = 0; y < canvas.height; y += 40) {
		ctx.drawImage(background,(0+(40*(Math.floor(Math.random())))),(0+(40*(Math.floor(Math.random())))),40,40,x,y,40,40);
	}
}

