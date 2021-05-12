import './Leaderboards.scss'
import React, { useEffect } from 'react'
import useLeaderboard from '../../hooks/useLeaderboard'
import Loader from '../../components/loader/Loader'
import Leaderboard from '../../components/leaderboard/Leaderboard'

const Leaderboards = () => {
	const { leaderboard: marathon, loading: mLoading } = useLeaderboard('marathon')
	const { leaderboard: sprint, loading: sLoading } = useLeaderboard('sprint')

	useEffect(() => {
		console.log("leaderboard", marathon)
	}, [marathon])

	return (
		<main className="leaderboards">
			<h1>Leaderboards</h1>
			
			<div className="leaderboards-container">
				{
					marathon &&  
					<div className="marathon">
						<h2>Marathon</h2>
						<Leaderboard leaderboard={marathon} />
					</div>
				}

				{
					sprint &&  
					<div className="sprint">
						<h2>Sprint</h2>
						<Leaderboard leaderboard={sprint} />
					</div>
				}
			</div>

			{
				(mLoading || sLoading) && <div className="loading">
					<Loader />
				</div>
			}
		</main>
	)
}

export default Leaderboards
