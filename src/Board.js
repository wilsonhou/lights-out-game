import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
    static defaultProps = {
        ncols               : 5,
        nrows               : 5,
        chanceLightStartsOn : 0.2,
        defaultMoves        : 2
    };
    constructor (props) {
        super(props);

        // TODO: set initial state
        this.state = {
            hasWon : false,
            board  : this.createBoard()
        };

        console.log(this.state.board);
    }

    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

    createBoard = () => {
        let board = Array(this.props.nrows).fill(null).map(() => Array(this.props.ncols).fill(null).map(() => false));

        for (let i = 0; i < this.props.defaultMoves; i++) {
            board = this.flipCellsAroundMe(
                `${Math.floor(Math.random() * this.props.nrows)}-${Math.floor(Math.random() * this.props.ncols)}`,
                true,
                board
            );
        }

        return board;
    };

    /** handle changing a cell: update board & determine if winner */

    flipCellsAroundMe = (coord, configFlip = false, configBoard = false) => {
        let { ncols, nrows } = this.props;
        let board = !configFlip
            ? [
                  ...this.state.board
              ]
            : configBoard;
        let [
            y,
            x
        ] = coord.split('-').map(Number);

        function flipCell (y, x) {
            // if this coord is actually on board, flip it

            if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                board[y][x] = !board[y][x];
            }
        }

        const coordsToFlip = [
            [
                y - 1,
                x
            ],
            [
                y,
                x
            ],
            [
                y + 1,
                x
            ],
            [
                y,
                x - 1
            ],
            [
                y,
                x + 1
            ]
        ];
        coordsToFlip.forEach((coords) => flipCell(...coords));

        // TODO: use reduce to get win condition from this.state.board
        if (!configFlip) this.setBoard(board);

        return board;
        // TODO: flip this cell and the cells around it

        // win when every cell is turned off
        // TODO: determine is the game has been won

        // this.setState({ board, hasWon });
    };
    setBoard = (newBoard) => {
        if (newBoard.every((row) => row.every((cell) => !cell))) this.setState({ hasWon: true });

        this.setState({ newBoard });
    };

    /** Render game board or winning message. */

    render () {
        // if the game is won, just show a winning msg & render nothing else
        if (this.state.hasWon)
            return (
                <div className="Board-title">
                    <div className="winner">
                        <span className="neon-orange">YOU</span>
                        <span className="neon-blue">WIN!</span>
                    </div>
                </div>
            );

        // make table board
        const board = this.state.board.map((arr, rowIdx) => (
            <tr key={`${rowIdx}`}>
                {arr.map((isOn, colIdx) => (
                    <Cell
                        key={`${rowIdx}-${colIdx}`}
                        cellCoord={`${rowIdx}-${colIdx}`}
                        isLit={isOn}
                        flipCellsAroundMe={this.flipCellsAroundMe}
                    />
                ))}
            </tr>
        ));

        return (
            <div>
                <div className="Board-title">
                    <div className="neon-orange">Lights</div>
                    <div className="neon-blue">Out</div>
                </div>

                <table className="Board">
                    <tbody>{board}</tbody>
                </table>
            </div>
        );
    }
}

export default Board;
