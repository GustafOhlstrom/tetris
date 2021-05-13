import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { db } from '../firebase'

const useBestScores = () => {
	const [bestMarathon, setBestMarathon] = useState(null)
	const [bestSprint, setBestSprint] = useState(null)
	const { user } = useContext(AuthContext)

	// Save best scores
	useEffect(() => {
		if(!user) {
			return
		}
		
		const unsubscribe = db.collection('scores')
			.doc(user.uid)
			.onSnapshot(snapshot => {
				if (snapshot.exists) {
					const data = snapshot.data()
					
					if(data['marathon']?.length > 0) {
						setBestMarathon(Math.max(...data['marathon']))
					}

					if(data['sprint']?.length > 0) {
						setBestSprint(Math.max(...data['sprint']))
					}
				}
			})
			
		return unsubscribe
	}, [user])

	return { bestMarathon, bestSprint }
}

export default useBestScores
