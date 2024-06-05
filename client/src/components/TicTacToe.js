import React, { useState, useEffect } from 'react';
import '../App.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerXScore, setPlayerXScore] = useState(0);
  const [playerOScore, setPlayerOScore] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scoresHistory, setScoresHistory] = useState([]);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem('scores'));
    if (scores) {
      setScoresHistory(scores);
      setPlayerXScore(scores[scores.length - 1].playerX);
      setPlayerOScore(scores[scores.length - 1].playerO);
    }
  }, []);

  
  useEffect(() => {
    if (scoresHistory.length === 5) {
      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scores: scoresHistory,
          winner,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data, 'score======='))
        .catch((error) => console.error('Error:', error));
    }
  }, [scoresHistory, winner]);


  const handleClick = (index) => {
    if (board[index] || gameOver) return;
  
    const newBoard = [...board];
    newBoard[index] = 'X'; // User's move is always 'X'
    setBoard(newBoard);
  
    const winnerResult = calculateWinner(newBoard);
    if (winnerResult) {
      setWinner(winnerResult);
      setGameOver(true);
      updateScores(winnerResult);
    } else if (!newBoard.includes(null)) {
      setGameOver(true);
    } else {
      setCurrentPlayer('O'); // Set current player as 'O' for the computer's move
  
      // Simulate computer's move after a slight delay (for simulation)
      setTimeout(() => {
        const emptySquares = newBoard.reduce((acc, val, idx) => {
          if (val === null) acc.push(idx);
          return acc;
        }, []);
        const randomIndex = Math.floor(Math.random() * emptySquares.length);
        const computerMoveIndex = emptySquares[randomIndex];
  
        newBoard[computerMoveIndex] = 'O'; // Computer's move is always 'O'
        setBoard(newBoard);
  
        const computerWinnerResult = calculateWinner(newBoard);
        if (computerWinnerResult) {
          setWinner(computerWinnerResult);
          setGameOver(true);
          updateScores(computerWinnerResult);
        } else if (!newBoard.includes(null)) {
          setGameOver(true);
        } else {
          setCurrentPlayer('X'); // Switch back to player X for the next user move
        }
      }, 500); 
    }
  };
  


  const calculateWinner = (board) => {
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
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };


  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setWinner(null);
    setCurrentPlayer('X');
  };


  const updateScores = (winner) => {
    if (winner === 'X') {
      setPlayerXScore(playerXScore + 1);
    } else if (winner === 'O') {
      setPlayerOScore(playerOScore + 1);
    }
    const updatedScores = [
      ...scoresHistory.slice(-4),
      { playerX: playerXScore + (winner === 'X' ? 1 : 0), playerO: playerOScore + (winner === 'O' ? 1 : 0) },
    ];
    setScoresHistory(updatedScores);
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  };

  return (
    <div className="tic-tac-toe">
      <h1>Tic Tac Toe</h1>
      <div className="board">
        {board.map((value, index) => (
          <div key={index} className={`cell ${value}`} onClick={() => handleClick(index)}>
            {value}
          </div>
        ))}
      </div>
      <div className="container">
        <div className="status">
          {gameOver && (
            <div>
              <span className={winner ? 'winner-message' : 'tie-message'}>
                {winner ? `Winner: ${winner}` : 'It\'s a tie!'}
              </span>
              <br />
              <button onClick={resetGame}>New Game</button>
            </div>
          )}
          {!gameOver && <div>Current Player: {currentPlayer}</div>}
        </div>
        <div className="scores">
          <div>
            <span>Player X Score:</span> {playerXScore}
          </div>
          <div>
            <span>Player O Score:</span> {playerOScore}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
