import './GameOver.scss'
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg'
import React from 'react'
import Loader from '../loader/Loader'

const GameOver = ({ mode, saveScore, highScore, level, lines, loading, onStartGame, setDisplayGameOver }) => (
	<div className="gameover">
		<div className="gameover-content">
			<header>
				<CloseSvg onClick={() => setDisplayGameOver(false)}/>
				<h1>{highScore === saveScore && saveScore > 0 ? 'New High Score!' : 'Game over'}</h1>
			</header>

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

