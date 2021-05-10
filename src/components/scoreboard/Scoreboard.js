import './Scoreboard.scss'
import React from 'react'

const Scoreboard = ({ score, lines }) => (
	<div className="scoreboard">
		<div className="scoreboard-item">
			<div>Score</div>
			<div>{score}</div>
		</div>

		<div className="scoreboard-item">
			<div>Lines</div>
			<div>{lines}</div>
		</div>
	</div>
)

export default Scoreboard