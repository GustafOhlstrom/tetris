import './Cell.scss'
import React from 'react'

const Cell = ({ size, tetromino }) => (
	<div 
		className="cell"
		style={{
			width: size,
			height: size,
			background: tetromino ? `var(--background-${tetromino})` : 'transparent'
		}}
	></div>
)


export default Cell

