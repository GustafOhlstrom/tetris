import './Board.scss'
import React from 'react'
import Cell from '../cell/Cell'
import { boardWidth, boardHeight } from '../../constants' 

const Board = ({ board, cellSize, countdown }) => (
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
					<Cell key={i + '-' + j} size={cellSize} tetromino={countdown ? cell : cell[0]} preview={countdown ? 0 : cell[2]} />
				))
			))
		}
	</div>
)


export default Board

