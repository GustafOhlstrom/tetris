import './Board.scss'
import React, { useEffect, useState } from 'react'
import Cell from '../cell/Cell'
import useTetromino from '../../hooks/useTetromino'
import useInterval from '../../hooks/useInterval'
import NextUp from '../nextUp/NextUp'
import Hold from '../hold/Hold'
import Scoreboard from '../scoreboard/Scoreboard'

const cellSize = 32
const boardWidth = 10
const boardHeight = 20

const levels = [0.01667, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236, 0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36, 3.91, 6.61, 11.43, 20]

const Board = () => {
	const [status, setStatus] = useState(false)
	const [gameOver, setGameOver] = useState(false)
	
	const [tick, setTick] = useState(0)
	const [delay, setDelay] = useState(null)

	const [board, setBoard] = useState(Array.from(Array(boardHeight), () => Array.from(Array(boardWidth), () => [0, 0, 0])))		// [occupied, locked, preview]
	const { tetromino, nextUp, hold, moveTetromino, dropTetromino, rotateTetromino, resetTetromino, holdTetromino } = useTetromino(board)

	const [rows, setRows] = useState({ value: 0 })
	const [score, setScore] = useState(0)
	const [lines, setLines] = useState(0)
	const [level, setLevel] = useState(1)

	useInterval(() => {
		if(status) {
			console.log(delay)
			setTick(prev => prev + 1)
			moveTetromino(board, 0, 1)
		}
	}, delay)

	useEffect(() => {
		let gameOver = false
		setDelay(null)
	
		setBoard(prev => {
			if(tetromino.new) {
				moveTetromino(prev, 0, 0)
				return prev
			}

			// Clear old tetromino/cells
			const newBoard = prev.map(row => 
				row.map(cell => {
					if(cell[0] &&! cell[1]) {
						return [0, 0, 0]
					}
					return [cell[0], cell[1], 0]
				})
			)
			
			// Add new tetromino position
			tetromino.shape.forEach((row, y) => {
				row.forEach((cell, x) => {
					if(cell) {
						const newY = tetromino.pos.y + y
						const newX = tetromino.pos.x + x

						if(newBoard[newY][newX][1]) {
							console.log("game over")
							gameOver = true
						} else {
							newBoard[newY][newX] = [cell, tetromino.locked, 0]
							newBoard[tetromino.preview.y + y][tetromino.preview.x + x][2] = cell
						}
					}
				})
			})
			
			// Detect row completion
			const reversedBord = [...newBoard].reverse()
			const length = newBoard.length - 1
			let rows = 0
			reversedBord.forEach((row, i) => {
				if(row.some(cell => !cell[1])) {
					return
				}
				
				rows++
				// Remove completed rows
				newBoard.splice(length - i, 1)
			})
			
			if(rows) {
				// Add new empty rows on top 
				newBoard.unshift(...Array.from(Array(rows), () => Array.from(Array(boardWidth), () => [0, 0, 0])))
				setRows({ value: rows })
			}

			// console.log("tetromino", tetromino)
			// console.log("new board", newBoard)

			if(gameOver) {
				setGameOver(true)
				return prev
			}

			return newBoard
		})

		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}, [tetromino, moveTetromino, level])

	useEffect(() => {
		if(gameOver) {
			setStatus(false)
			alert("game over")
		}
	}, [gameOver])

	useEffect(() => {
		// Calc score
		setLevel(prev => {
			setScore(prevScore => {
				console.log("test", rows, prev, prevScore)
				switch(rows.value) {
					case 1:
						return prevScore + (100 * prev)
					case 2:
						return prevScore + (300 * prev)
					case 3:
						return prevScore + (500 * prev)
					case 4:
						return prevScore + (800 * prev)
					default:
						return prevScore
				}
			})

			return prev
		})

		// Calc lines
		setLines(prev => prev + rows.value)
	}, [rows])

	useEffect(() => {
		setLevel(prev => {
			if(prev * 10 <= lines) {
				return Math.floor(lines / 10) + 1
			} 

			return prev
		})
	}, [lines])

	useEffect(() => {
		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}, [level])

	const onMove = ({ key }) => {
		// console.log("onMove", key)
		switch(key) {
			case 'ArrowUp':
				rotateTetromino(board)
				break
			case 'ArrowRight':
				moveTetromino(board, 1, 0)
				break
			case 'ArrowDown':
				moveTetromino(board, 0, 1)
				break
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

	const onStartGame = () => {
		if(!status) {
			if(gameOver) {
				const newBoard = Array.from(Array(boardHeight), () => Array.from(Array(boardWidth), () => [0, 0, 0]))
				setBoard(newBoard)
				resetTetromino()
				setGameOver(false)
			}
			
			setStatus(true)
		}

		setDelay((1 / levels[level - 1]) / 60 * 1000)
	}

	const onPauseGame = () => {
		setDelay(prev => prev ? null : (1 / levels[level - 1]) / 60 * 1000)
	}

	return (
		<>
			{
				status && tick
					? <button onClick={onPauseGame}>{delay ? 'Pause Game' : 'Resume'}</button>
					: <button onClick={onStartGame}>Start Game</button>
			}


			<div className="flex">
				<div className="left">
					<Hold hold={hold} cellSize={cellSize} />
					<Scoreboard score={score} level= {level} lines={lines} />
				</div>

				<div 
					className="board" 
					style={{
						width: cellSize * boardWidth,
						height: cellSize * boardHeight
					}}
					onKeyDown={event => onMove(event)}
					tabIndex="0"
				>
					{
						board.map((row, i) => (
							row.map((cell, j) => (
								<Cell key={i + '-' + j} size={cellSize} tetromino={cell[0]} preview={cell[2]} />
							))
						))
					}
				</div>

				<NextUp nextUp={nextUp} cellSize={cellSize} />
			</div>
		</>
	)
}

export default Board

