import './Cell.scss'
import React from 'react'

const Cell = ({ size, tetromino, preview, noBorder }) => (
	<div 
		className="cell"
		style={{
			width: size,
			height: size,
			background: tetromino ? `var(--background-${tetromino})` : 'transparent',
			border: !tetromino && preview 
				? `1px solid var(--background-${preview})` 
				: noBorder && !tetromino
					? 'none'
					: '1px solid var(--background-2)'
		}}
	></div>
)

export default Cell

