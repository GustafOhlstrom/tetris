import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import firebase, { db } from '../firebase'

const useSaveScore = type => {
	const [saveScore, setSaveScore] = useState(null)
	const [highScore, setHighScore] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const { user } = useContext(AuthContext)

	// Save score
	useEffect(() => {
		if(!saveScore) {
			return
		}

		(async () => {
			try {
				setLoading(true)
				await db.collection("scores").doc(user.uid).set({
					[type]: firebase.firestore.FieldValue.arrayUnion(saveScore)
				}, { merge: true })

				// Save score to leaderboard if new highscore
				db.collection("scores")
					.doc(user.uid)
					.get()
					.then(async doc => {
						let highscore = 0
						if (doc.exists) {
							const data = doc.data()
							if(data && data[type]) {
								highscore = Math.max(...data[type])
							}
						}
						
						if(highscore === saveScore) {
							setHighScore(highscore)

							await db.collection(type).doc(user.uid).set(
								{
								name: user.displayName, 
								score: saveScore
							}, { merge: true })
						}
						
						setLoading(false)
					})
			} catch (error) {
				setLoading(false)
				setError(`An error occurred when saving your score: ${error.message}`)
				console.log(`An error occurred when saving your score: ${error.message}`)
			}
		})();
	}, [saveScore, type, user])

	return { saveScore, setSaveScore, highScore, setHighScore, loading, error }
}

export default useSaveScore
