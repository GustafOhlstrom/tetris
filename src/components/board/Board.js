import './Board.scss'
import React, { useEffect, useState } from 'react'
import Cell from '../cell/Cell'
import useTetromino from '../../hooks/useTetromino'
import useInterval from '../../hooks/useInterval'

const cellSize = 32
const boardWidth = 10
const boardHeight = 20

const Board = () => {
	const [status, setStatus] = useState(true)
	
	const [tick, setTick] = useState(0)
	const [delay, setDelay] = useState(null);

	const [board, setBoard] = useState(Array.from(Array(boardHeight), () => Array(boardWidth).fill([0, 0])))
	const { tetromino, moveTetromino, dropTetromino, rotateTetromino, resetTetromino } = useTetromino()

	useInterval(() => {
		if(status) {
			setTick(prev => prev + 1)
			moveTetromino(board, 0, 1)
		}
	}, delay);

	useEffect(() => {
		let gameOver = false

		setBoard(prev => {
			// Clear old tetromino/cells
			const newBoard = prev.map(row => 
				row.map(cell => {
					if(cell[0] &&! cell[1]) {
						return [0, 0]
					}
					return cell
				})
			)
			
			// Add new tetromino position
			tetromino.shape.forEach((row, y) => {
				row.forEach((cell, x) => {
					if(cell) {
						const newY = tetromino.pos.y + y
						const newX = tetromino.pos.x + x

						if(newBoard[newY][newX][1]) {
							gameOver = true
						} else {
							newBoard[newY][newX] = [cell, tetromino.locked]
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
				newBoard.splice(length - i, 1)
			})

			// Remove completed rows
			if(rows) {
				newBoard.unshift(...Array.from(Array(rows), () => Array(boardWidth).fill([0, 0])))
				console.log("Row completion")
			}

			// console.log("tetromino", tetromino)
			// console.log("new board", newBoard)

			if(gameOver) {
				setStatus(false)
				return prev
			}

			return newBoard
		})
	}, [tetromino])

	useEffect(() => {
		if(!status) {
			alert("game over")
		}
	}, [status])

	const onMove = ({ key }) => {
		if(!status) {
			return
		}

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
			default:
				break
		}
	}

	const onStartGame = () => {
		if(!status) {
			const newBoard = Array.from(Array(boardHeight), () => Array(boardWidth).fill([0, 0]))
			setBoard(newBoard)
			resetTetromino()
			setStatus(true)
			console.log("test", status)
		}

		setDelay(100)
	}

	const onPauseGame = () => {
		setDelay(null)
	}

	return (
		<>
			{
				status && tick
					? <button onClick={onPauseGame}>Pause Game</button>
					: <button onClick={onStartGame}>Start Game</button>
			}

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
							<Cell key={i + '-' + j} size={cellSize} tetromino={cell[0]} />
						))
					))
				}
			</div>
		</>
	)
}

export default Board

