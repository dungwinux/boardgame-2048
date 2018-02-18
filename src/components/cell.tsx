import * as React from 'react';

import { Cell as ICell } from '../game/state';

/**
 * Returns a RGB Color that ascends from white to complete yellow
 * when value raises from 0 to 11, and slowly to red after that.
 * 
 * Result is a tuple [backgroundColor, foregroundColor]
 */
function color(value: number): [string, string] {
	if (value <= 11) {
		// Divide 0..255 into 13 steps (0 for empty cell, 255 for 2048).
		const yellowShade = Math.trunc(255 / 12) * value;
		// Return the shade of yellow in term of RGB.
		return [`rgb(0, 255, ${255 ^ yellowShade})`, `rgb(0, 0, ${yellowShade})`];
	}
	// Decrease the green shade by 2**(value - 11 + 4) - 1 because when value hits 15
	// (its maximum value) our color will be fully red.
	const redShade = 255 - 2 ** (value - 11 + 4) + 1;
	return [`rgb(255, ${redShade}, 0)`, `rgb(0, ${255 ^ redShade}, 255)`];
}

interface CellProps {
	cell: ICell
	turn: number
}

/**
 * A cell that holds a number in the game.
 */
export default class Cell extends React.Component<CellProps> {
	render() {
		const cell = this.props.cell;
		if (cell === null) {
			return <td style={{
				width: '25%',
				fontSize: '24px',
				textAlign: 'center',
				verticalAlign: 'middle',
				border: 'solid'
			}} />;
		}
		const isNew = this.props.turn === cell.turn;
		const [bg, text] = color(cell.value);
		// We simply render a <td> that holds a cute number.
		return <td style={{
			width: '25%',
			fontSize: isNew ? '40px' : '24px',
			textAlign: 'center',
			verticalAlign: 'middle',
			border: 'solid',
			backgroundColor: bg,
			color: text
		}}>{2 ** cell.value}</td>;
	}
}