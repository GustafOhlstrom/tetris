import './Game.scss'
import React, { useContext, useEffect, useState } from 'react'
import { ReactComponent as PauseSvg } from '../../assets/icons/pause.svg'
import { ReactComponent as PlaySvg } from '../../assets/icons/play.svg'
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
import useBestScores from '../../hooks/useBestScores'

import { levels, countDown } from '../../constants'
import GameModes from '../game-modes/GameModes'
import GameOverSave from '../game-over-save/GameOverSave'
import { AuthContext } from '../../contexts/AuthContext'
import useCellSize from '../../hooks/useCellSize'

let touchStart
let touchFirstY
let touchLastX
let touchLastY

const Game = () => {
	const { cellSize } = useCellSize()

	const [pickMode, setPickMode] = useState(false)
	const [mode, setMode] = useState('marathon')
	const [newGameCounter, setNewGameCounter] = useState(null)
	const [gameOver, setGameOver] = useState(false)
	const [displayGameOver, setDisplayGameOver] = useState(false)
	const [displayGameOverSave, setDisplayGameOverSave] = useState(false)
	const [status, setStatus] = useState(false)
	const [tick, setTick] = useState(0)
	const [delay, setDelay] = useState(null)
	const [sprintTimer, setSprintTimer] = useState(0)

	const { bestMarathon, bestSprint } = useBestScores()
	const { tetromino, nextUp, hold, moveTetromino, dropTetromino, rotateTetromino, resetTetromino, holdTetromino } = useTetromino()
	const { board, updateBoard, newBoard, clearedRows } = useBoard()
	const { score, lines, level, resetStats } = useStats(clearedRows)
	const { saveScore, setSaveScore, highScore, setHighScore, loading: saveScoreLoading } = useSaveScore(mode)
	const { user} = useContext(AuthContext)

	// Tracks ticks and move tetrominos if game is ongoing
	useInterval(() => {
		if(status) {
			setTick(prev => prev + 1)
			moveTetromino(board, 0, 1)
		}
	}, delay)

	useInterval(() => {
		if(mode === 'sprint' && status) {
			setSprintTimer(prev => prev + 1)
			if(sprintTimer >= 180) {
				setGameOver(true)
				setDisplayGameOver(true)
			}
		}
	}, 1000)	
	
	useInterval(() => {
		if(newGameCounter) {
			setTick(1)
			setNewGameCounter(prev => prev < 3 ? prev + 1 : 0)

			if(newGameCounter >= 3) {
				if(gameOver) {
					setGameOver(false)
					setSaveScore(null)
					setHighScore(null)
					resetStats()
					newBoard()
					resetTetromino()
				}

				setStatus(true)
			}
		}
	}, newGameCounter ? 1000 : null)


	// Update board after tetromino change
	useEffect(() => {
		if(!status) {
			return
		}
		setDelay(null)
		updateBoard(tetromino, moveTetromino, setGameOver)
		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}, [tetromino, moveTetromino, level, updateBoard, status])

	// Update delay depending on level change
	useEffect(() => {
		setDelay(prev => prev ? ((1 / levels[level - 1]) / 60 * 1000) : prev)
	}, [level])

	useEffect(() => {
		console.log("test", cellSize)
	}, [cellSize])

	// Stop game on gameover
	useEffect(() => {
		if(gameOver) {
			setStatus(false)
			if(user) {
				setDisplayGameOver(true)
				setSaveScore(score)
			} else {
				setDisplayGameOverSave(true)
			}
		}
	}, [gameOver, score, setSaveScore, user])

	// Start game or unpause game
	const onStartGame = mode => {
		if(!status) {
			setPickMode(false)
			setMode(mode)
			setDisplayGameOver(false)
			setSprintTimer(0)
			setNewGameCounter(1)
		}

		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}

	// Pause game
	const onPauseGame = () => {
		setDelay(prev => {
			if(prev) {
				setStatus(false)
				return null
			} else {
				setStatus(true)
				return (1 / levels[level - 1]) / 60 * 1000
			}
		})
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
		<div className="game">
			{
				pickMode && 
				<GameModes 
					bestMarathon={bestMarathon}
					bestSprint={bestSprint}
					onStartGame={onStartGame} 
					setPickMode={setPickMode}
				/>
			}

			<div className="game-actions">
				{
					(!status && !tick) || gameOver
						? <PlaySvg onClick={() => !newGameCounter && setPickMode(prev => !prev)} />
						: <div onClick={onPauseGame} >
							{
								status 
									? <PauseSvg />
									: <PlaySvg />
							}
						</div>
				}
			</div>

			{
				<div 
					className="game-panels"
					onKeyDown={e => handleMove(e)}
					onTouchStart={e => handleTouchStart(e)}
					onTouchMove={e => handleTouchMove(e)}
					onTouchEnd={e => handleTouchEnd(e)}
					onClick={() => status && rotateTetromino(board)}
					tabIndex="0"
				>
					<div className="side-panel">
						<Hold
							hold={tick || newGameCounter ? hold : [null, true]} 
							cellSize={cellSize} 
						/>
						
						{
							tick || newGameCounter
								? <Scoreboard
									mode={mode}
									timer={sprintTimer}
									score={score} 
									level= {level} 
									lines={lines} 
								/>
								: <></>
						}
						
					</div>

					<Board 
						board={newGameCounter && newGameCounter <= 3
							? countDown[newGameCounter - 1] 
							: board
						}
						cellSize={cellSize}
						countdown={newGameCounter}
					/>

					<div className="side-panel">
						<NextUp 
							nextUp={tick || newGameCounter ? nextUp : []} 
							cellSize={cellSize} 
						/>
					</div>
				</div>
			}
			
			{
				displayGameOver &&
				<GameOver 
					mode={mode}
					saveScore={saveScore} 
					highScore={highScore}
					level= {level} 
					lines={lines} 
					loading={saveScoreLoading}
					onStartGame={onStartGame}
					setDisplayGameOver={setDisplayGameOver}
				/>
			}

			{
				displayGameOverSave &&
				<GameOverSave 
					mode={mode}
					onStartGame={onStartGame}
					setDisplayGameOver={setDisplayGameOver}
					setDisplayGameOverSave={setDisplayGameOverSave}
					score={score}
					setSaveScore={setSaveScore}
				/>
			}
		</div>
	)
}

export default Game
