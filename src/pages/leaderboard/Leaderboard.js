import './Leaderboard.scss'
import React, { useEffect } from 'react'
import useLeaderboard from '../../hooks/useLeaderboard'
import Loader from '../../components/loader/Loader'

const Leaderboard = () => {
	const { leaderboard, loading } = useLeaderboard('marathon')
	
	useEffect(() => {
		console.log("leaderboard", leaderboard)
	}, [leaderboard])

	return (
		<main className="leaderboard">
			<h1>Leaderboard</h1>
			
			{
				leaderboard &&  
				<table>
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
			}
			{
				loading && <div className="loading">
					<Loader />
				</div>
			}
		</main>
	)
}

export default Leaderboard
