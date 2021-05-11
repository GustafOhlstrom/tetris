import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { db } from '../firebase'

const useLeaderboard = type => {
	const [leaderboard, setLeaderboard] = useState([])
	const [loading, setLoading] = useState(true)
	const { user } = useContext(AuthContext)

	// Get leaderboard
	useEffect(() => {
		setLoading(true)
		
		const unsubscribe = db.collection(type)
			.orderBy('score', "desc")
			.limit(10)
			.onSnapshot(snapshot => {
				const tempLeaderboard = snapshot.docs.map(doc => ({ ...doc.data() }))
				setLeaderboard(tempLeaderboard)
				setLoading(false)
			})
			
		return unsubscribe
	}, [user, type])

	return { leaderboard, loading }
}

export default useLeaderboard 
