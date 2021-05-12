import './Leaderboard.scss'
import React from 'react'

const Leaderboard = ({ leaderboard }) => (
	<table className="leaderboard">
		<thead>
			<tr>
				<th>Rank</th>
				<th>Name</th>
				<th className="score">Score</th>
			</tr>
		</thead>
		<tbody>
			{
				leaderboard.map((user, i) => 
					<tr key={'lb-' + i}>
						<td>{i + 1}</td>
						<td>{user.name}</td>
						<td className="score">{user.score}</td>
					</tr>
				)
			}
		</tbody>
	</table>
)

export default Leaderboard

