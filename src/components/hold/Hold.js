import './Hold.scss'
import React from 'react'
import { tetrominos } from '../../constants/tetrominos'
import Cell from '../cell/Cell'

const Hold = ({ hold, cellSize }) => (
	<div 
		className="hold"
		style={{
			width: cellSize * 4
		}}
	>
		{
			hold[0] && tetrominos[hold[0]].map((row, i) => (
				row.includes(hold[0]) &&
				<div 
					className="hold-row"
					key={'h-r' + i}
				>
					{
						row.map((cell, j) => (
							<Cell 
								key={'h-c' + i + '-' + j} 
								size={cellSize} 
								tetromino={cell[0]} 
								preview={cell[2]} 
								noBorder={true} 
							/>
						))
					}
				</div>
			))
		}
	</div>
)

export default Hold