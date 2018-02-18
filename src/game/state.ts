/**
 * This file implements 2048's state management class.
 * The exported class, `Game`, eschews a Game State object
 * and provides modifying functions over it.
 */

export type ID = 0|1|2|3;

export interface GameState {
  board: Cell[][];
  score: number;
  turn: number;
}

/**
 * A cell can either be a ValueCell or null (an empty cell).
 */
export type Cell = ValueCell|null;

/**
 * A cell in the game state.
 * @property {number} value The cell's value. It must be a non-negative integer.
 * @property {number} turn  The turn where the cell was created.
 */
interface ValueCell {
  value: number;
  turn: number;
}

/**
 * The 2048 state manager.
 */
export default class Game {
  state: GameState;
  constructor(state?: GameState) {
    if (state === undefined) {
      // The starting state, all cells are null.
      state = {
        board: [0, 1, 2, 3].map(() => [0, 1, 2, 3].map(() => null)),
        score: 0,
        turn: 0
      };
    } else {
      state = JSON.parse(JSON.stringify(state)) as GameState;
    }
    this.state = state;
  }

  /**
   * Spawns a new random cell.
   * This advances the turn count by 1.
   */
  spawn() {
    // There's a 1/4 chance that a 4 will be spawned.
    const value = [1, 1, 1, 2][Math.trunc(Math.random() * 4)];

    // A list of empty cells
    const emptyCells: [ID, ID][] = [];

    for (let i: ID = 0; i < 4; ++i) {
      for (let j: ID = 0; j < 4; ++j) {
        if (this.state.board[i][j] === null) {
          emptyCells.push([i, j] as [ID, ID]);
        }
      }
    }

    // We choose a random empty cell from the list.
    const cell = emptyCells[Math.trunc(Math.random() * emptyCells.length)];

    this.state.turn++;
    this.state.board[cell[0]][cell[1]] = {value, turn: this.state.turn};
  }

  /**
   * Is the game over?
   */
  lost(): boolean {
    // If the game can be moved in any way, then it's not over.
    if (new Game(this.state).pullLeft()) {
      return false;
    }
    if (new Game(this.state).pullRight()) {
      return false;
    }
    if (new Game(this.state).pullUp()) {
      return false;
    }
    if (new Game(this.state).pullDown()) {
      return false;
    }
    return true;
  }

  // The game's "pull" logic

  /**
   * `4 2 2 1` => `4 4 1 0`
   */
  pullLeft(): boolean {
    return this.pull(
        [0, 1, 2, 3], [0, 1, 2, 3], this.getRowCol.bind(this),
        this.setRowCol.bind(this));
  }

  /**
   * `4 2 2 1` => `0 4 4 1`
   */
  pullRight(): boolean {
    return this.pull(
        [0, 1, 2, 3], [3, 2, 1, 0], this.getRowCol.bind(this),
        this.setRowCol.bind(this));
  }

  /**
   * ```
   * 4
   * 2
   * 2
   * 1
   * ```
   * =>
   * ```
   * 4
   * 4
   * 1
   * 0
   * ```
   */
  pullUp(): boolean {
    return this.pull(
        [0, 1, 2, 3], [0, 1, 2, 3], this.getColRow.bind(this),
        this.setColRow.bind(this));
  }

  /**
   * ```
   * 4
   * 2
   * 2
   * 1
   * ```
   * =>
   * ```
   * 0
   * 4
   * 4
   * 1
   * ```
   */
  pullDown(): boolean {
    return this.pull(
        [0, 1, 2, 3], [3, 2, 1, 0], this.getColRow.bind(this),
        this.setColRow.bind(this));
  }

  private getRowCol(x: ID, y: ID): Cell {
    return this.state.board[x][y];
  }
  private setRowCol(x: ID, y: ID, c: Cell) {
    this.state.board[x][y] = c;
  }
  private getColRow(x: ID, y: ID): Cell {
    return this.state.board[y][x];
  }
  private setColRow(x: ID, y: ID, c: Cell) {
    this.state.board[y][x] = c;
  }

  /**
   * Make a pull. Returns whether any cell has been moved.
   * @param xOrder
   * @param yOrder
   * @param get
   * @param set
   */
  private pull(
      xOrder: ID[], yOrder: ID[], get: ((x: ID, y: ID) => Cell),
      set: ((x: ID, y: ID, value: Cell) => void)): boolean {
    let moved = false;

    for (let x of xOrder) {
      let lastFilledCell = -1, lastLockedCell = -1;
      for (let y of yOrder) {
        const cell = get(x, y);
        if (cell === null) {
          continue;
        }

        if (lastFilledCell !== -1) {
          const lastCell = get(x, yOrder[lastFilledCell]) as ValueCell;
          if (lastCell.value === cell.value &&
              lastLockedCell !== lastFilledCell) {
            // Merge the cells and lock them
            cell.value++;
            this.state.score += (1 << cell.value);
            set(x, y, null);
            set(x, yOrder[lastFilledCell], cell);
            lastLockedCell = lastFilledCell;
            moved = true;
            continue;
          }
        }

        // Pull the cell to the first empty cell.
        lastFilledCell++;
        set(x, y, null);
        set(x, yOrder[lastFilledCell], cell);
        if (y !== yOrder[lastFilledCell]) {
          moved = true;
        }
      }
    }
    return moved;
  }
}
