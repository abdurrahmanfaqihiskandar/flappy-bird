'use client';

import { useEffect, useRef, useState } from 'react';

import './page.css';

export default function CrowFlappy() {
	const [score, setScore] = useState({ current: 0, best: 0 });
	const canvas = useRef();
	const flappyImg = new Image();
	const crowImg = new Image();
	const backgroundImg = new Image();
	flappyImg.src = 'flappy-bird-set.png';
	crowImg.src = 'crow-flying-set.png';
	backgroundImg.src = 'light-city-park.jpg';

	const birdPos = [
		{ x: 40, y: 20 },
		{ x: 177, y: 20 },
		{ x: 308, y: 20 },
		{ x: 442, y: 20 },
		{ x: 577, y: 20 },
		{ x: 44, y: 172 },
		{ x: 177, y: 172 },
		{ x: 308, y: 172 },
		{ x: 441, y: 172 }
	];

	useEffect(() => {
		const canvasHeight = canvas.current.height;
		const canvasWidth = canvas.current.width;
		const ctx = canvas.current.getContext('2d');

		const gravity = 0.5,
			speed = 6.2;
		const birdWidth = canvasWidth / 8;
		const birdHeight = canvasHeight / 10;
		const jumpHeight = -11.5; // Change in flight of bird

		let index = 0, // x-coordinate of canvas
			flyHeight = canvasHeight / 2 - birdHeight / 2, // Height of bird on screen
			flight = 0, // Rate of change of height of bird on screen
			pipes, // array of pipes
			gameStarted = false,
			paused = false;

		// pipe settings
		const pipeWidth = 78; // Width of pipe
		const pipeGap = 270; // Vertical gap between top and bottom pipes
		const topPipeHeight = () =>
			Math.random() * (canvasHeight - (pipeGap + pipeWidth) - pipeWidth) + pipeWidth;

		const setupGame = () => {
			// Reset current score
			setScore((score) => {
				return {
					...score,
					current: 0
				};
			});
			flight = jumpHeight;

			// set initial flyHeight (middle of screen - size of the bird)
			flyHeight = canvasHeight / 2 - birdHeight / 2;

			// setup first 3 pipes
			pipes = Array(3)
				.fill()
				.map((_, i) => [canvasWidth + i * (pipeGap + pipeWidth), topPipeHeight()]);
		};

		const render = () => {
			index++;

			// background first part
			ctx.drawImage(
				backgroundImg,
				2860,
				800,
				1500,
				1400,
				-((index * (speed / 2)) % canvasWidth) + canvasWidth,
				0,
				canvasWidth,
				canvasHeight
			);
			// background second part
			ctx.drawImage(
				backgroundImg,
				2860,
				800,
				1500,
				1400,
				-(index * (speed / 2)) % canvasWidth,
				0,
				canvasWidth,
				canvasHeight
			);
			if (gameStarted) {
				// Draw pipes
				pipes.map((pipe) => {
					// Move pipe right to left
					pipe[0] -= speed;

					// top pipe
					ctx.drawImage(
						flappyImg,
						432, // x-coordinate of pipe image in source image
						588 - pipe[1], // y-coordinate of pipe image in source image clipped to pipe height
						pipeWidth,
						pipe[1], // clipped to pipe height
						pipe[0],
						0, // top of canvas
						pipeWidth,
						pipe[1]
					);
					// bottom pipe
					ctx.drawImage(
						flappyImg,
						432 + pipeWidth, // x-coordinate of pipe image in source image
						108, // y-coordinate of pipe image in source image
						pipeWidth,
						canvasHeight - pipe[1] + pipeGap, // clipped to pipe height
						pipe[0],
						pipe[1] + pipeGap, // top pipe height and pipe gap
						pipeWidth,
						canvasHeight - pipe[1] + pipeGap
					);

					// scoring
					// give 1 point & create new pipe
					if (pipe[0] <= -pipeWidth) {
						// update scores
						setScore((score) => {
							return {
								current: (score.current += 1),
								best: Math.max(score.best, score.current)
							};
						});
						// remove & create new pipe
						pipes = [
							...pipes.slice(1),
							[pipes[pipes.length - 1][0] + pipeGap + pipeWidth, topPipeHeight()]
						];
					}
					// collision detection
					if (
						[
							pipe[0] <= canvasWidth / 10 + birdWidth - 5,
							pipe[0] + pipeWidth >= canvasWidth / 10,
							pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + birdHeight
						].every((elem) => elem)
					) {
						paused = true;
						// gameStarted = false;
						// setupGame();
					}
				});

				// Draw bird
				ctx.drawImage(
					crowImg,
					birdPos[index % 9].x, // x-coordinate of pipe image in source image
					birdPos[index % 9].y, // y-coordinate of pipe image in source image
					120, // width of image to crop
					140, // height of image to crop
					canvasWidth / 10, // x-coordinate of canvas to draw onto
					flyHeight, // y-coordinate of canvas to draw onto
					birdWidth, // width of drawing
					birdHeight // height of drawing
				);
				flight += gravity;
				flyHeight = Math.min(flyHeight + flight, canvasHeight - birdHeight);
			} else {
				ctx.drawImage(
					crowImg,
					birdPos[index % 9].x, // x-coordinate of pipe image in source image
					birdPos[index % 9].y, // y-coordinate of pipe image in source image
					120, // width of image to crop
					140, // height of image to crop
					canvasWidth / 2 - birdWidth / 2, // x-coordinate of canvas to draw onto
					flyHeight, // y-coordinate of canvas to draw onto
					birdWidth, // width of drawing
					birdHeight // height of drawing
				);

				// Text
				ctx.fillText('Press space to play', 45, 370);
				ctx.font = 'bold 30px courier';
			}
			if (!paused) window.requestAnimationFrame(render);
		};
		setupGame();
		render();

		const handleKeyPress = (e) => {
			if (paused) {
				if (e.keyCode === 112) {
					paused = false;
					render();
				}
			} else {
				if (e.keyCode === 32) {
					gameStarted = true;
					flight = jumpHeight;
				} else if (e.keyCode === 112) {
					paused = true;
				}
			}
		};

		// Start game
		window.addEventListener('keypress', handleKeyPress);
		return () => {
			ctx.reset();
			window.removeEventListener('keypress', handleKeyPress);
		};
	}, []);

	return (
		<main>
			<div className="scoreContainer">
				<h1 className="score">Current score: {score.current}</h1>
				<h1 className="score">Best score: {score.best}</h1>
			</div>
			<canvas className="crowCanvas" ref={canvas} width="431" height="600" />
		</main>
	);
}
