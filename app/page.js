import Link from 'next/link';

import BirdCanvas from './BirdCanvas';

import './page.css';

export default function Home() {
	return (
		<main className="main">
			<h1>Flappy Bird</h1>
			<BirdCanvas />
		</main>
	);
}
