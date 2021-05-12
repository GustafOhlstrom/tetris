import { useCallback, useState } from "react"
import { boardWidth, boardHeight } from '../constants' 

const useBoard = () => {
	const [board, setBoard] = useState(Array.from(Array(boardHeight), () => Array.from(Array(boardWidth), () => [0, 0, 0]))) 	// [occupied, locked, preview]
	const [clearedRows, setClearedRows] = useState({ value: 0 })
	
	const updateBoard = useCallback((tetromino, moveTetromino, setGameOver) => {
		let gameOver = false
		setBoard(prev => {
			if(tetromino.new) {
				moveTetromino(prev, 0, 1)
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

						if(!newBoard[newY] || !newBoard[newY][newX] || newBoard[newY][newX][1]) {
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
				setClearedRows({ value: rows })
			}

			// console.log("tetromino", tetromino)
			// console.log("new board", newBoard)

			if(gameOver) {
				setGameOver(true)
				return prev
			}

			return newBoard
		})
	}, [])

	const newBoard = () => {
		const newBoard = Array.from(Array(boardHeight), () => Array.from(Array(boardWidth), () => [0, 0, 0]))
		setBoard(newBoard)
	}

	return { board, updateBoard, newBoard, clearedRows }
}

export default useBoard