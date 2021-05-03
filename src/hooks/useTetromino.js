import { useState } from "react"
import { tetrominos } from '../constants/tetrominos'

const useTetromino = () => {
	const [tetromino, setTetromino] = useState({
		shape: Object.values(tetrominos)[Math.floor(Math.random() * 6)],
		pos: {
			x: 0, 
			y: 0 
		},
	})

	const moveTetromino = (x, y) => {
		setTetromino(prev => ({
			...prev,
			pos: {
				x: prev.pos.x + x,
				y: prev.pos.y + y 
			}
		}))
	}

	const dropTetromino = () => {
		console.log("drop")
		// Need collision to implement
	}

	const rotateTetromino = () => {
		setTetromino(prev => {
			const shape = prev.shape.map((row, y) => 
				row.map((cell, x) => prev.shape[row.length - 1 - x][y])
			)
			
			return {
				...prev,
				shape
			}
		})
	}
	
	return { tetromino, moveTetromino, dropTetromino, rotateTetromino }
}

export default useTetromino