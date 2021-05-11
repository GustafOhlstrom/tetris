import './Game.scss'
import React, { useEffect, useState } from 'react'
import Board from '../board/Board'
import Hold from '../hold/Hold'
import NextUp from '../nextUp/NextUp'
import Scoreboard from '../scoreboard/Scoreboard'
import GameOver from '../game-over/GameOver'
import useTetromino from '../../hooks/useTetromino'
import useInterval from '../../hooks/useInterval'
import useBoard from '../../hooks/useBoard'
import useStats from '../../hooks/useStats'
import useSaveScore from '../../hooks/useSaveScore'

import { cellSize, levels } from '../../constants'

let touchStart
let touchFirstY
let touchLastX
let touchLastY

const Game = () => {
	const { tetromino, nextUp, hold, moveTetromino, dropTetromino, rotateTetromino, resetTetromino, holdTetromino } = useTetromino()
	const { board, updateBoard, newBoard, clearedRows } = useBoard()
	const { score, lines, level, resetStats } = useStats(clearedRows)
	const { saveScore, setSaveScore, highScore, setHighScore, loading: saveScoreLoading } = useSaveScore('marathon')

	const [gameOver, setGameOver] = useState(false)
	const [status, setStatus] = useState(false)
	const [tick, setTick] = useState(0)
	const [delay, setDelay] = useState(null)

	// Tracks ticks and move tetrominos if game is ongoing
	useInterval(() => {
		if(status) {
			setTick(prev => prev + 1)
			moveTetromino(board, 0, 1)
		}
	}, delay)

	// Update board after tetromino change
	useEffect(() => {
		setDelay(null)
		updateBoard(tetromino, moveTetromino, setGameOver)
		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}, [tetromino, moveTetromino, level, updateBoard])

	// Update delay depending on level change
	useEffect(() => {
		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}, [level])

	// Stop game on gameover
	useEffect(() => {
		if(gameOver) {
			setStatus(false)
			setSaveScore(score)
		}
	}, [gameOver, score, setSaveScore])

	// Start game or unpause game
	const onStartGame = () => {
		if(!status) {
			if(gameOver) {
				setSaveScore(null)
				setHighScore(null)
				setGameOver(false)
				resetStats()
				newBoard()
				resetTetromino()
			}
			
			setStatus(true)
		}

		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}

	// Pause game
	const onPauseGame = () => {
		setDelay(prev => prev ? null : (1 / levels[level - 1]) / 60 * 1000)
	}

	// Handle game inputs
	const handleMove = ({ key }) => {
		if(!status) {
			return
		}

		switch(key) {
			case "Up":
			case 'ArrowUp':
				rotateTetromino(board)
				break
			case "Right":
			case 'ArrowRight':
				moveTetromino(board, 1, 0)
				break
			case "Down":
			case 'ArrowDown':
				moveTetromino(board, 0, 1)
				break
			case "Left":
			case 'ArrowLeft':
				moveTetromino(board, -1, 0)
				break
			case ' ':
				dropTetromino(board)
				break
			case 'c':
			case 'C':
			case 'Shift':
				holdTetromino()
				break
			default:
				break
		}
	}

	// Handle mobile (touch) game inputs
	const handleTouchStart = e => {
		touchLastX = e.targetTouches[0].pageX
		touchLastY = e.targetTouches[0].pageY
		touchFirstY = e.targetTouches[0].pageY
		touchStart = null
	}

	const handleTouchMove = e => {
		if(!status) {
			return
		}
		
		const newX = e.targetTouches[0].pageX
		const newY = e.targetTouches[0].pageY
		
		// Down
		if (newY - touchLastY >= cellSize) {
			moveTetromino(board, 0, 1)
			if(!touchStart) {
				touchStart = (new Date()).getTime()
			}
			touchLastX = newX
			touchLastY = newY
			return
		}

		// Up
		if (newY - touchLastY <= -cellSize) {
			holdTetromino()
			touchLastX = newX
			touchLastY = newY
			return
		}

		// Right
		if (newX - touchLastX >= cellSize) {
			moveTetromino(board, 1, 0)
			touchLastX = newX
			touchLastY = newY
			return
		}

		// Left	
		if (newX - touchLastX <= -cellSize) {
			moveTetromino(board, -1, 0)
			touchLastX = newX
			touchLastY = newY
			return
		}
	}

	const handleTouchEnd = e => {
		if (touchStart && (new Date()).getTime() - touchStart < 200 && touchLastY - touchFirstY > 70) {
			dropTetromino(board)
		}
	}
	
	return (
		<>
			{
				status && tick
					? <button onClick={onPauseGame}>{delay ? 'Pause Game' : 'Resume'}</button>
					: <button onClick={onStartGame}>Start Game</button>
			}

			<div 
				className="game"
				onKeyDown={e => handleMove(e)}
				onTouchStart={e => handleTouchStart(e)}
				onTouchMove={e => handleTouchMove(e)}
				onTouchEnd={e => handleTouchEnd(e)}
				onClick={() => rotateTetromino(board)}
				tabIndex="0"
			>
				<div className="side-panel">
					<Hold
						hold={hold} 
						cellSize={cellSize} 
					/>
					
					<Scoreboard
						score={score} 
						level= {level} 
						lines={lines} 
					/>
				</div>

				<Board 
					board={board}
				/>

				<div className="side-panel">
					<NextUp 
						nextUp={nextUp} 
						cellSize={cellSize} 
					/>

					
				</div>
			</div>
			{
				gameOver &&
				<GameOver 
					saveScore={saveScore} 
					highScore={highScore}
					level= {level} 
					lines={lines} 
					loading={saveScoreLoading}
					onStartGame={onStartGame}
				/>
			}
		</>
	)
}

export default Game
