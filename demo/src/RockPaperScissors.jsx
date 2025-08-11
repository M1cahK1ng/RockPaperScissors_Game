import React, { useState, useEffect } from 'react';
import './RockPaperScissors.css';

const choices = ['rock', 'paper', 'scissors'];

const RockPaperScissors = () => {
  const [winningScore, setWinningScore] = useState(3);
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [result, setResult] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [animate, setAnimate] = useState(false);
  const [roundHistory, setRoundHistory] = useState([]);

  const gameStarted = playerScore > 0 || computerScore > 0;

  const handlePlayerChoice = (choice) => {
    if (isGameOver) return;

    setAnimate(true);
    const newComputerChoice = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(newComputerChoice);
  };

  useEffect(() => {
    if (playerChoice && computerChoice && !isGameOver) {
      determineWinner();
    }
  }, [playerChoice, computerChoice, isGameOver]);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [animate]);

  useEffect(() => {
    if (winningScore > 0 && playerScore === winningScore) {
      setIsGameOver(true);
      setGameOverMessage('Congratulations, You Won The Game!');
    } else if (winningScore > 0 && computerScore === winningScore) {
      setIsGameOver(true);
      setGameOverMessage('Game Over, The Computer Won!');
    }
  }, [playerScore, computerScore, winningScore]);

  const determineWinner = () => {
    let roundResult;
    if (playerChoice === computerChoice) {
      roundResult = "It's a Tie!";
    } else if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'scissors' && computerChoice === 'paper') ||
      (playerChoice === 'paper' && computerChoice === 'rock')
    ) {
      roundResult = 'You Win!';
      setPlayerScore((score) => score + 1);
    } else {
      roundResult = 'You Lose!';
      setComputerScore((score) => score + 1);
    }
    setResult(roundResult);

    const newRound = {
      player: playerChoice,
      computer: computerChoice,
      result: roundResult,
      id: Date.now(), // Unique key for the list
    };
    setRoundHistory((prevHistory) => [newRound, ...prevHistory]);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setPlayerScore(0);
    setComputerScore(0);
    setResult(null);
    setIsGameOver(false);
    setGameOverMessage('');
    setRoundHistory([]);
  };

  const getEmoji = (choice) => {
    switch (choice) {
      case 'rock':
        return '✊';
      case 'paper':
        return '✋';
      case 'scissors':
        return '✌️';
      default:
        return '❔';
    }
  };

  const getPlayerChoiceClass = () => {
    if (!result || !playerChoice) return '';
    if (result === "It's a Tie!") return 'tie';
    return result === 'You Win!' ? 'winner' : 'loser';
  };

  const getComputerChoiceClass = () => {
    if (!result || !computerChoice) return '';
    if (result === "It's a Tie!") return 'tie';
    return result === 'You Lose!' ? 'winner' : 'loser';
  };

  const getHistoryItemClass = (result) => {
    if (result === "It's a Tie!") return 'tie';
    if (result === 'You Win!') return 'winner';
    return 'loser';
  };

  return (
    <div className="rps-container">
      <h1>Rock, Paper, Scissors</h1>
      <div className="settings">
        <label htmlFor="winning-score-input">First to score:</label>
        <input
          id="winning-score-input"
          type="number"
          min="1"
          value={winningScore}
          disabled={gameStarted}
          onChange={(e) => {
            const newScore = parseInt(e.target.value, 10);
            setWinningScore(newScore > 0 ? newScore : 1);
          }}
        />
      </div>

      <div className="scoreboard">
        <div className="score">
          <h2>Player</h2>
          <p>{playerScore}</p>
        </div>
        <div className="score">
          <h2>Computer</h2>
          <p>{computerScore}</p>
        </div>
      </div>

      <div className="choices">
        <div className={`choice-display ${getPlayerChoiceClass()}`}>
          <span className={`emoji ${animate && playerChoice ? 'animate' : ''}`}>{getEmoji(playerChoice)}</span>
          <p>Your Choice</p>
        </div>
        <div className={`choice-display ${getComputerChoiceClass()}`}>
          <span className={`emoji ${animate && computerChoice ? 'animate' : ''}`}>{getEmoji(computerChoice)}</span>
          <p>Computer's Choice</p>
        </div>
      </div>

      <div className="buttons">
        {choices.map((choice) => (
          <button
            key={choice}
            className="choice-btn"
            onClick={() => handlePlayerChoice(choice)}
            aria-label={choice}
            disabled={isGameOver}
          >
            {getEmoji(choice)}
          </button>
        ))}
      </div>

      {gameOverMessage ? (
        <div className="result">
          <h2>{gameOverMessage}</h2>
        </div>
      ) : (
        result && (
        <div className="result">
          <h2>{result}</h2>
        </div>
        )
      )}

      {roundHistory.length > 0 && (
        <div className="history-container">
          <h2>Round History</h2>
          <ul>
            {roundHistory.map((round) => (
              <li
                key={round.id}
                className={`history-item ${getHistoryItemClass(round.result)}`}
              >
                <span>
                  You: {getEmoji(round.player)} vs Comp: {getEmoji(round.computer)}
                </span>
                <span className="history-result">{round.result}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
};

export default RockPaperScissors;