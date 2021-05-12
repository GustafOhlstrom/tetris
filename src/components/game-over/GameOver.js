import './GameOver.scss'
import React from 'react'
import Loader from '../loader/Loader'

const GameOver = ({ mode, saveScore, highScore, level, lines, loading, onStartGame }) => (
	<div className="gameover">
		<div className="gameover-content">
			<h1>{highScore === saveScore ? 'New High Score!' : 'Game over'}</h1>

			{
				loading  
					? <Loader />
					: <>
						<table>
							<tbody>
								<tr>
									<th>Score</th>
									<td>{saveScore}</td>
								</tr>
								<tr>
									<th>Level</th>
									<td>{level}</td>
								</tr>
								<tr>
									<th>Lines</th>
									<td>{lines}</td>
								</tr>
							</tbody>
						</table>

						<button onClick={() => onStartGame(mode)}>Play Again</button>
					</>
			}
		</div>
	</div>
)

export default GameOver

