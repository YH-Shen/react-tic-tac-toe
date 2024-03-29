import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {

//     render() {
//         return (
//             <button className="square" onClick={() => this.props.onClick()}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) {
    // console.log(props);

    // console.log(props.winner.winner_line);
    return (
        <button
            onClick={props.onClick}
            winner_square={props}
            className={
                props.winner_square
                    ? "square highlight_win"
                    : "square"
            }
        >
            {props.value}
        </button>
    );
}
class Board extends React.Component {
    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     if (calculateWinner(squares) || squares[i]) {
    //         return;
    //     }

    //     squares[i] = this.state.xIsNext ? "X" : "O";
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext,
    //     });
    // }

    renderSquare(i) {
        // console.log(this.props);
        const winner_line = this.props.winner_line;
        // console.log(winner_line);
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winner_square={
                    winner_line && winner_line.lines.includes(i)
                }
            />
        );
    }

    render() {
        // input number of rows and columns in here
        let self = this;
        let count = 0;

        function render_board(num_of_cols, num_of_rows) {
            let render_arr = [];

            for (let idx = 0; idx < num_of_rows; idx++) {
                let row_arr = [];
                for (
                    let idx_col = 0;
                    idx_col < num_of_cols;
                    idx_col++
                ) {
                    let render_element = self.renderSquare(count);
                    row_arr.push(render_element);

                    count++;
                }
                render_arr.push(
                    <div key={idx} className="board-row">
                        {row_arr}
                    </div>
                );
            }
            return render_arr;
        }
        return render_board(3, 3);
    }
}
// console.log(Board);
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            xIsNext: true,
            stepNumber: 0,
            ascending_order: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(
            0,
            this.state.stepNumber + 1
        );
        const current = history[history.length - 1];
        // console.log(current);
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    // save square index inside history
                    squareNum: i,
                },
            ]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }
    handleToggle() {
        this.setState({
            ascending_order: !this.state.ascending_order,
        });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        // console.log(current.squareNum);
        const moves = history.map((step, moveIdx) => {
            const location = displayLocation(
                history[moveIdx].squareNum
            );
            const desc =
                moveIdx !== 0
                    ? "Go to move #" + moveIdx + location
                    : "Go to game start";

            return (
                <li key={moveIdx}>
                    <button
                        className={
                            this.state.stepNumber === moveIdx
                                ? "selected_bold"
                                : ""
                        }
                        onClick={() => this.jumpTo(moveIdx)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
        let status;

        const winner = calculateWinner(current.squares);
        // const winner_line = calculateWinner(current.squares).lines;
        // console.log(winner);
        if (winner) {
            status = "Winner " + winner.squares;
        } else if (!current.squares.includes(null)) {
            status = "It's a Draw!";
        } else {
            status =
                "Next Player: " + (this.state.xIsNext ? "X" : "O");
        }
        // console.log(winner_line);
        let ascending_order = this.state.ascending_order;
        if (!ascending_order) {
            moves.reverse();
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner_line={winner}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>

                    <ol>{moves}</ol>
                    <button onClick={() => this.handleToggle()}>
                        {ascending_order ? "Descending" : "Ascending"}
                    </button>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return { squares: squares[a], lines: lines[i] };
        }
    }
    return null;
}

function displayLocation(i) {
    // return (col, row)
    return "(" + ((i % 3) + 1) + ", " + (Math.floor(i / 3) + 1) + ")";
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
