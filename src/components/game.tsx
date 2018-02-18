import * as React from 'react';

import Game, { GameState } from '../game/state';
import Board from './board';

interface gameState extends GameState {
	validMove: boolean;
}

export default class game extends React.Component<{}, gameState> {
	handler: (ev: KeyboardEvent) => void;
	constructor(props: {}) {
		super(props);
		// Create a new game and spawn a cell.
		const g = new Game();
		g.spawn();
		this.state = Object.assign({}, g.state, {
			validMove: true
		});
		// this.handler
		this.handler = this.handleKeypress.bind(this);
	}
	// Handles the keyboard arrows.
	handleKeypress(ev: KeyboardEvent) {
		this.setState((oldState: gameState): gameState => {
			const g = new Game(oldState);
			const keyValue = ev.key;

			let validMove = false;
			if (keyValue === 'ArrowDown') {
				validMove = g.pullDown();
			}
			if (keyValue === 'ArrowUp') {
				validMove = g.pullUp();
			}
			if (keyValue === 'ArrowLeft') {
				validMove = g.pullLeft();
			}
			if (keyValue === 'ArrowRight') {
				validMove = g.pullRight();
			}
			if (!validMove) {
				return { ...oldState, validMove };
			}
			g.spawn();
			return { ...g.state, validMove };
		});
	}
	// Bind the component's keypress listener.
	componentDidMount() {
		document.addEventListener("keydown", this.handler);
	}
	// Unbind if game ended.
	componentDidUpdate() {
		if (new Game(this.state).lost()) {
			document.removeEventListener("keydown", this.handler);
		}
	}
	handleReset() {
		const g = new Game();
		g.spawn();
		this.state = Object.assign({}, g.state, {
			validMove: true
		});
		// this.handler
	}
	render() {
		const game = this.state;
		const g = new Game(game);

		return <div style={{
			width: '60vw',
			marginLeft: '20vw'
		}}>
			{
				g.lost() ?
					<h1 style={{
						textAlign: 'center'
					}} >You Lost</h1> :
					null
			}
			{
				!game.validMove ?
					<h3 style={{
						textAlign: 'center'
					}} >Invalid Move</h3> :
					null
			}
			<button onClick={() => alert('click')}>
				Restart game
			</button>
			<div style={{ marginBottom: '20px' }}>
				<span style={{ float: 'right' }}>Moves: {game.turn - 1}</span>
				<span style={{ float: 'left' }}>Score: {game.score}</span>
			</div>
			<Board state={game} size="calc(90vh - 20px)" margin="calc((60vw - 90vh + 20px) / 2)" />
		</div>;
	}
} 