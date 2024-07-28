'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function BirdCanvas() {
	const [type, setType] = useState('classic');
	const canvas = useRef();

	const crowPos = [
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
	const flappyWidth = 51;
	const flappyHeight = 36;
	let top = 200;
	let index = 0;

	const swapType = (newType) => {
		setType(newType);
		top = 200;
	};

	useEffect(() => {
		const crowImg = new Image();
		const flappyImg = new Image();
		crowImg.src = 'crow-flying-set.png';
		flappyImg.src = 'flappy-bird-set.png';
		const ctx = canvas.current.getContext('2d');

		const renderCrow = () => {
			index++;
			ctx.clearRect(0, 0, 200, 200);
			if (top > 60) {
				top -= 5;
			}
			ctx.drawImage(
				crowImg,
				crowPos[index % 9].x, // x-coordinate of pipe image in source image
				crowPos[index % 9].y, // y-coordinate of pipe image in source image
				120, // width of image to crop
				140, // height of image to crop
				68, // x-coordinate of canvas to draw onto
				top, // y-coordinate of canvas to draw onto
				70, // width of drawing
				70 // height of drawing
			);
			if (type === 'classic') {
				window.requestAnimationFrame(renderClassic);
			} else {
				window.requestAnimationFrame(renderCrow);
			}
		};
		const renderClassic = () => {
			index++;
			ctx.clearRect(0, 0, 200, 200);
			if (top > 80) {
				top -= 5;
			}
			ctx.drawImage(
				flappyImg,
				432,
				Math.floor((index % 9) / 3) * flappyHeight,
				flappyWidth,
				flappyHeight,
				100 - flappyWidth / 2,
				top,
				65,
				50
			);
			if (type === 'classic') {
				window.requestAnimationFrame(renderClassic);
			} else {
				window.requestAnimationFrame(renderCrow);
			}
		};
		renderClassic();
		return () => ctx.reset();
	}, [type]);

	return (
		<>
			<canvas ref={canvas} width="200" height="200" />
			<div className="types">
				<button className="typeButton" onClick={() => swapType('classic')}>
					Classic flappy
				</button>
				<button className="typeButton" onClick={() => swapType('crow')}>
					Crow flappy
				</button>
			</div>
			<Link className="link" href={`/${type}`}>
				<button className="linkButton">Go</button>
			</Link>
		</>
	);
}
