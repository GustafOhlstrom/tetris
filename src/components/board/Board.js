import './Board.scss'
import React, { useState } from 'react'
import { tetrominos } from './tetrominos'
import Cell from '../cell/Cell';

const cellSize = 48;
const boardWidth = 10;
const boardHeight = 20;

const Board = () => {
	const board = Array.from(Array(boardHeight), () => Array(boardWidth).fill(0));
	
	const [tetromino, setTetromino] = useState({
		shape: Object.values(tetrominos)[0],
		pos: {
			x: 0, 
			y: 0 
		},
	});

	// const allTetrominos = 'IJLOSTZ';
	// const tetromino = allTetrominos[Math.floor(Math.random() * allTetrominos.length)];
	// tetrominos[tetromino].forEach((row, i) => {
	// 	row.forEach((cell, j) => {
	// 		board[i][j] = cell;
	// 	})
	// });

	const placeTetromino = () => {
		console.log("tetromino", tetromino)
		tetromino.shape.forEach((row, i) => {
			row.forEach((cell, j) => {
				board[tetromino.pos.y + i][tetromino.pos.x + j] = cell;
			})
		});
	}
	placeTetromino();
	console.log("board", board);

	const onMoveDown = () => {
		setTetromino(prev => ({
			...prev,
			pos: {
				x: prev.pos.x,
				y: prev.pos.y++ 
			}
		}));

		console.log("tetromino", tetromino)
		placeTetromino();
	}
	
	return (
		<>
			<button onClick={onMoveDown}>Move down</button>

			<div 
				className="board" 
				style={{
					width: cellSize * boardWidth,
					height: cellSize * boardHeight
				}}
			>
				{
					board.map((row, i) => (
						row.map((cell, j) => (
							<Cell key={i + '-' + j} size={cellSize} tetromino={cell} />
						))
					))
				}
			</div>
		</>
		
	)
}

export default Board

