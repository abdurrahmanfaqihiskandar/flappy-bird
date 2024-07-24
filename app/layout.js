import './globals.css';

export const metadata = {
	title: 'Flappy Bird',
	description: 'Flappy Bird game'
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
