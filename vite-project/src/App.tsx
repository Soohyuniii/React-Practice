// 틱택토 게임 만들어보기

import { useState } from "react";
import "./App.css";

type Squares = (string | null)[];

type HistoryItem = {
  squares: Squares;
  position: number | null;
};

// 승자 계산 함수
function calculateWinner(squares: Squares): string | null {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

type SquareProps = {
  value: string | null;
  onSquareClick: () => void;
};

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

type BoardProps = {
  xIsNext: boolean;
  squares: Squares;
  onPlay: (nextSquares: Squares, position: number) => void;
};

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    onPlay(nextSquares, i); // 클릭 위치 전달
  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// App 컴포넌트
function App() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { squares: Array(9).fill(null), position: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares: Squares, position: number) {
    const nextHistory = history.slice(0, currentMove + 1);
    setHistory([...nextHistory, { squares: nextSquares, position }]);
    setCurrentMove(nextHistory.length);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  // position -> (x, y) = (col, row) = (나누기 3한 결과의 나머지 + 1, 나누기 3한 결과의 몫 + 1)
  // 0 ->  (1, 1)
  // 1 ->  (2, 1)
  // 2 ->  (3, 1)
  // 3 ->  (1, 2)
  // 4 ->  (2, 2)
  // 5 ->  (3, 2)
  // 6 ->  (1, 3)
  // 7 ->  (2, 3)
  // 8 ->  (3, 3)

  function calculatePosition(index: number): string {
    const row = Math.floor(index / 3) + 1; //  나누기 3한 결과의 나머지 + 1,
    const col = (index % 3) + 1; // 나누기 3한 결과의 몫 + 1
    return `(${col}, ${row})`;
  }

  const moves = history.map((squares, move) => {
    const description = move
      ? `Go to move #${move}, Position: ${
          squares.position !== null ? calculatePosition(squares.position) : ""
        }`
      : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default App;
