import './NextUp.scss'
import React from 'react'
import { tetrominos } from '../../constants/tetrominos'
import Cell from '../cell/Cell'

const NextUp = ({ nextUp, cellSize }) => (
	<div 
		className="next-up"
		style={{
			width: cellSize * 4
		}}
	>
		{
			nextUp && nextUp.map((type, i) => (
				<div 
					className="next-up-tetromino"
					key={'nu-t' + i}
				>
					{
						tetrominos[type].map((row, j) => (
							row.includes(type) &&
							<div 
								className="next-up-row"
								key={'nu-r' + i + '-' + j}
							>
								{
									row.map((cell, k) => (
										<Cell 
											key={'nu-c' + i + '-' + j + '-' + k} 
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
			))
		}
	</div>
)

export default NextUp