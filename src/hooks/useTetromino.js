import { useCallback, useEffect, useState } from "react"
import { tetrominos } from '../constants/tetrominos'

const boardWidth = 10
const boardHeight = 20

const type = Object.keys(tetrominos)[Math.floor(Math.random() * 6)]

const wallKicksTests= [
	[[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, 2]],
	[[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
	[[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
	[[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
]

const wallKicksTestsI = [
	[[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
	[[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
	[[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
	[[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]]
]

const useTetromino = board => {
	const [nextUp, setNextUp] = useState([...Array(3)].map(() => Object.keys(tetrominos)[Math.floor(Math.random() * 6)]))
	const [tetromino, setTetromino] = useState({
		type: type,
		shape: tetrominos[type],
		pos: {
			x: type === 'O' ? 4 : 3, 
			y: type === 'I' ? -1 : 0
		},
		preview: {
			x: type === 'O' ? 4 : 3, 
			y: 18
		},
		state: 0,
		locked: false,
		new: true
	})
	
	useEffect(() => {
		if(tetromino.locked) {
			setNextUp(prev => {
				setTetromino({
					type: prev[0],
					shape: tetrominos[prev[0]],
					pos: {
						x: prev[0] === 'O' ? 4 : 3, 
						y: prev[0] === 'I' ? -1 : 0  
					},
					preview: {
						x: prev[0] === 'O' ? 4 : 3, 
						y: 18
					},
					state: 0,
					locked: false,
					new: true
				})

				const type = Object.keys(tetrominos)[Math.floor(Math.random() * 6)]
				const newNextUp = [prev[1], prev[2], type]

				return newNextUp
			})
		}
	}, [tetromino]);

	const dropTetromino = board => {
		setTetromino(prev => {
			let newX = prev.pos.x
			let newY = prev.pos.y + 1

			// Detect collision
			while(!detectCollision(board, prev.shape, newX, newY, 1).collision) {
				newY++
			}
			
			return {
				...prev,
				pos: {
					x: newX,
					y: newY - 1 
				},
				locked: true,
				new: false
			}
		})
	}

	const rotateTetromino = board => {
		setTetromino(prev => {
			if(prev.type === "O") {
				return prev
			}

			// Rotate tetromino
			const shape = prev.shape.map((row, y) => 
				row.map((cell, x) => prev.shape[row.length - 1 - x][y])
			)
			const state = prev.state

			// Get wallkick data depending on block
			const wallKicks = type !== "I"
				? wallKicksTests
				: wallKicksTestsI

			// Check collision and try to walk kick if collision occurred
			for(let i = 0; i < wallKicks[prev.state].length; i++) {
				let newX = prev.pos.x + wallKicks[state][i][0]
				let newY = prev.pos.y - wallKicks[state][i][1]
				
				if(!detectCollision(board, shape, newX, newY, 0).collision) {
					// Detect preview collision
					let previewX = newX
					let previewY = newY
					while(!detectCollision(board, shape, previewX, previewY, 0).collision) {
						previewY++
					}

					// Return new rotated tetromino
					return {
						shape,
						pos: {
							x: newX,
							y: newY
						},
						preview: {
							x: previewX,
							y: previewY - 1
						},
						state: state === 3 ? 0 : prev.state + 1,
						new: false
					}
				}
			}
			// Return prev if collision occurred and no walk kick was possible
			return { 
				...prev,
				new: false
			}
		})
	}
	
	const isCollision = useCallback((board, x, y) => {
		// Check board width
		if(x > boardWidth - 1 || x < 0) {
			return true
		}

		// Check board height
		if(y > boardHeight - 1 || y < 0) {
			return true
		}

		// Check cell
		if(board[y][x][0] && board[y][x][1]) {
			return true
		}

		return false
	}, [])

	const detectCollision =  useCallback((board, shape, newX, newY, moveDown) => {
		let result = {
			collision: false,
			newBlocK: false
		}

		// Check collision for all cells in tetromino
		shape.forEach((row, y) => {
			row.forEach((cell, x) => {
				if(cell && !result.collision) {
					result.collision = isCollision(board, newX + x, newY + y)
				}
			})
		})

		// If moving down check if collision occured on last row with a cell
		if(moveDown) {
			result.newBlocK = true;
		}

		// console.log("test", shape, result, moveDown)
		return result
	}, [isCollision])

	const moveTetromino = useCallback((board, x, y) => {
		setTetromino(prev => {
			const newX = prev.pos.x + x
			const newY = prev.pos.y + y

			// Detect collision
			const collision = detectCollision(board, prev.shape, newX, newY, y)

			// Return prev if collision occurred
			if(collision.collision) {
				if(collision.newBlocK) {
					return {
						...prev,
						locked: true,
						new: false
					}
				}
				return {
					...prev,
					new: false
				}
			}

			// Detect previwe collision
			let previewX = newX
			let previewY = newY
			while(!detectCollision(board, prev.shape, previewX, previewY, 1).collision) {
				previewY++
			}
			
			// Return new tetromino
			return {
				...prev,
				pos: {
					x: newX,
					y: newY 
				},
				preview: {
					x: previewX,
					y: previewY - 1
				},
				new: false
			}
		})
	}, [detectCollision])

	const resetTetromino = () => {
		const type = Object.keys(tetrominos)[Math.floor(Math.random() * 6)]
		setTetromino({
			type: type,
			shape: tetrominos[type],
			pos: {
				x: type === 'O' ? 4 : 3, 
				y: 0 
			},
			state: 0,
			locked: false,
			new: true
		})
	}
	
	return { tetromino, nextUp, moveTetromino, dropTetromino, rotateTetromino, resetTetromino }
}

export default useTetromino