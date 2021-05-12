import './Scoreboard.scss'
import React from 'react'

const Scoreboard = ({ mode, timer, score, level, lines }) => {
	let min = Math.floor((180 - timer) / 60)
	let sec = ('0' + ((180 - timer) - min * 60)).slice(-2)
	min = ('0' + min).slice(-2)

	return <div className="scoreboard">
		{
			mode === 'sprint' && 
			<div className="scoreboard-item">
				<div>Timer</div>
				<div>{min}:{sec}</div>
			</div>
		}

		<div className="scoreboard-item">
			<div>Score</div>
			<div>{score}</div>
		</div>

		<div className="scoreboard-item">
			<div>Level</div>
			<div>{level}</div>
		</div>

		<div className="scoreboard-item">
			<div>Lines</div>
			<div>{lines}</div>
		</div>
	</div>
}

export default Scoreboard