import * as React from 'react';

import Cell from './cell';
import { GameState } from '../game/state';

interface BoardProps {
	state: GameState;
	size: number | string;
	margin: number | string;
}

/**
 * Board displays the board as a 4x4 table, each cell sizing {cellSize}.
 */
export default class Board extends React.Component<BoardProps> {
	render() {
		const { state, size, margin } = this.props;
		return <table style={{ width: size, height: size, border: 'solid', marginLeft: margin }}><tbody>
			{state.board.map((row, id) => <tr key={id} style={{ height: '25%', border: 'solid' }}>
				{row.map((cell, id) => <Cell cell={cell} key={id} turn={state.turn} />)}
			</tr>)}
		</tbody></table>;
	}
}