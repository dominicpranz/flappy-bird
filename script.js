window.addEventListener("DOMContentLoaded", (event) => {
	// variables
	const canvas = document.querySelector("#canvas");
	const context = canvas.getContext("2d");

	let tileSize = canvas.clientWidth * (24 / 400);

	// resize canvas to the size it got from css
	const resizeCanvas = () => {
		canvas.height = canvas.clientHeight;
		canvas.width = canvas.clientWidth;
	};
	resizeCanvas();
	window.addEventListener("resize", resizeCanvas);

	// bird
	let bird = new Image();
	bird.src = "bird.png";
	let birdX = 0;
	let birdY = canvas.clientHeight / 2;
	let birdSize = tileSize;
	let birdWidth = birdSize * (860 / 593);
	let birdHeight = birdSize;
	let birdDY = 0;

	// pipes
	const pipeWidth = birdWidth;
	let pipeX = canvas.clientWidth;

	// score
	let score = 0;
	if (!localStorage.highscore) localStorage.highscore = 0;

	// game constants
	const skyColor = "skyblue";
	const pipeColor = "green";
	const textColor = "black";
	const gravity = canvas.clientHeight * (0.5 / 400);
	const jumpPower = canvas.clientHeight * (9 / 400);
	const pipeSpeed = canvas.clientWidth * (8 / 400);
	let pipeGap = canvas.clientHeight / 2;
	let topPipeBottomY = tileSize;

	const jump = () => {
		birdDY = jumpPower;
	};

	// let the bird fly on click / tap
	document.querySelector("body").addEventListener("click", jump);
	document.addEventListener("keydown", jump);

	// redraw canvas periodically
	const fps = 40;
	const interval = 1000 / fps;
	setInterval(() => {
		// draw background
		context.fillStyle = skyColor;
		context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

		// gravity with delta
		birdY -= birdDY -= gravity;

		// draw and position the bird
		context.drawImage(bird, birdX, birdY, birdWidth, birdHeight);

		// move pipes
		pipeX -= pipeSpeed;
		// if pipe moves out of screen
		if (pipeX < -pipeWidth) {
			// reset pipes
			pipeX = canvas.clientWidth;
			// adjust difficulty
			if (score >= 300) {
				pipeGap = canvas.clientHeight / 3;
			}
			if (score >= 600) {
				pipeGap = canvas.clientHeight / 4;
			}
			if (score >= 900) {
				pipeGap = canvas.clientHeight / 5;
			}
			topPipeBottomY = pipeGap * Math.random();
		}

		// draw pipes
		context.fillStyle = pipeColor;
		context.fillRect(pipeX, 0, pipeWidth, topPipeBottomY); // top pipe
		context.fillRect(pipeX, topPipeBottomY + pipeGap, pipeWidth, canvas.clientHeight); // bottom pipe

		// draw score text
		score++;
		localStorage.highscore = score > localStorage.highscore ? score : localStorage.highscore;
		context.fillStyle = textColor;
		context.fillText(`${score}`, 10, 15);
		context.fillText(`Best: ${localStorage.highscore}`, 10, 30);

		// check if game over
		const birdFallsDown = birdY > canvas.clientHeight;
		const birdCollidesWithPipeY = birdY < topPipeBottomY || birdY > topPipeBottomY + pipeGap;
		const birdCollidesWithPipeX = pipeX < birdWidth;
		const birdCollidesWithPipe = birdCollidesWithPipeY && birdCollidesWithPipeX;
		if (birdFallsDown || birdCollidesWithPipe) {
			// reset bird
			birdDY = 0;
			birdY = canvas.clientHeight / 2;
			// reset pipes
			pipeX = canvas.clientWidth;
			// reset score
			score = 0;
			// reset difficulty
			pipeGap = canvas.clientHeight / 2;
		}
	}, interval);
});
