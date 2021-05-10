import './Board.scss'
import React from 'react'
import Cell from '../cell/Cell'
import { cellSize, boardWidth, boardHeight } from '../../constants' 

const Board = ({ board }) => (
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
					<Cell key={i + '-' + j} size={cellSize} tetromino={cell[0]} preview={cell[2]} />
				))
			))
		}
	</div>
)


export default Board

