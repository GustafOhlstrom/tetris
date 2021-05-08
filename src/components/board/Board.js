import './Board.scss'
import React, { useEffect, useState } from 'react'
import Cell from '../cell/Cell'
import useTetromino from '../../hooks/useTetromino'

const cellSize = 32
const boardWidth = 10
const boardHeight = 20

const Board = () => {
	const [tickId, setTickId] = useState(null)
	const [tick, setTick] = useState(0)

	const [board, setBoard] = useState(Array.from(Array(boardHeight), () => Array(boardWidth).fill([0, 0])))
	const { tetromino, moveTetromino, dropTetromino, rotateTetromino } = useTetromino()

	useEffect(() => {
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

						newBoard[newY][newX] = [cell, tetromino.locked]
					}
				})
			})

			console.log("tetromino", tetromino)
			console.log("new board", newBoard)
			return newBoard
		})
	}, [tetromino])

	const onMove = ({ key }) => {
		console.log("onMove", key)
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

	useEffect(() => {
		if(!tick) {
			return
		}
		
		moveTetromino(board, 0, 1)
	}, [tick])

	const onStartGame = () => {
		if(tickId) {
			return
		}

		const id = setInterval(() => {
			setTick(prev => prev + 1)
		}, 500)

		setTickId(id)
	}

	const onPauseGame = () => {
		if(!tickId) {
			return
		}

		clearInterval(tickId)
		setTickId(null)
	}

	return (
		<>
			{
				tickId
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

