'use client';

import { useEffect, useRef, useState } from 'react';

import './page.css';

export default function ClassicFlappy() {
	const [score, setScore] = useState({ current: 0, best: 0 });
	const canvas = useRef();

	useEffect(() => {
		const img = new Image();
		img.src = 'flappy-bird-set.png';
		const canvasHeight = canvas.current.height;
		const canvasWidth = canvas.current.width;
		const ctx = canvas.current.getContext('2d');

		// general settings
		const gravity = 0.5,
			speed = 6.2;
		const birdWidth = 51;
		const birdHeight = 36;
		const jumpHeight = -11.5;

		let index = 0,
			flight = 0,
			flyHeight = canvasHeight / 2 - birdHeight / 2,
			pipes,
			gameStarted = false,
			paused = false;

		// pipe settings
		const pipeWidth = 78;
		const pipeGap = 270;
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
			// make the pipe and bird moving
			index++;

			// background first part
			ctx.drawImage(
				img,
				0,
				100,
				canvasWidth,
				canvasHeight,
				-((index * (speed / 2)) % canvasWidth) + canvasWidth,
				0,
				canvasWidth,
				canvasHeight
			);
			// background second part
			ctx.drawImage(
				img,
				0,
				100,
				canvasWidth,
				canvasHeight,
				-(index * (speed / 2)) % canvasWidth,
				0,
				canvasWidth,
				canvasHeight
			);

			// pipe display
			if (gameStarted) {
				// Draw pipes
				pipes.map((pipe) => {
					// Move pipe right to left
					pipe[0] -= speed;

					// top pipe
					ctx.drawImage(
						img,
						432,
						588 - pipe[1],
						pipeWidth,
						pipe[1],
						pipe[0],
						0,
						pipeWidth,
						pipe[1]
					);
					// bottom pipe
					ctx.drawImage(
						img,
						432 + pipeWidth,
						108,
						pipeWidth,
						canvasHeight - pipe[1] + pipeGap,
						pipe[0],
						pipe[1] + pipeGap,
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
							pipe[0] <= canvasWidth / 10 + birdWidth,
							pipe[0] + pipeWidth >= canvasWidth / 10,
							pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + birdHeight
						].every((elem) => elem)
					) {
						gameStarted = false;
						setupGame();
					}
				});

				// Draw bird
				ctx.drawImage(
					img,
					432,
					Math.floor((index % 9) / 3) * birdHeight,
					birdWidth,
					birdHeight,
					canvasWidth / 10,
					flyHeight,
					birdWidth,
					birdHeight
				);
				flight += gravity;
				flyHeight = Math.min(flyHeight + flight, canvasHeight - birdHeight);
			} else {
				ctx.drawImage(
					img,
					432,
					Math.floor((index % 9) / 3) * birdHeight,
					birdWidth,
					birdHeight,
					canvasWidth / 2 - birdWidth / 2,
					flyHeight,
					birdWidth,
					birdHeight
				);

				// Text
				ctx.fillText('Press space to play', 45, 370);
				ctx.font = 'bold 30px courier';
			}

			if (!paused) window.requestAnimationFrame(render);
		};

		// launch setup
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

		// start game
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
			<canvas
				className="classicCanvas"
				ref={canvas}
				id="canvas"
				width="431"
				height="600"
			></canvas>
		</main>
	);
}
