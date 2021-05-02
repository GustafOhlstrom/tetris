import { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase'

const AuthContext = createContext()

const AuthContextProvider = (props) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	const signUp = (email, password) => {
		return auth.createUserWithEmailAndPassword(email, password)
	}

	const signIn = (email, password) => {
		return auth.signInWithEmailAndPassword(email, password)
	}

	const signOut = () => {
		return auth.signOut()
	}

	const resetPassword = (email) => {
		return auth.sendPasswordResetEmail(email)
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			setUser(user)
			setLoading(false)
		})

		return unsubscribe
	}, [])

	const contextValues = {
		user,
		loading,
		signUp,
		signIn,
		signOut,
		resetPassword
	}

	return (
		<AuthContext.Provider value={contextValues}>
			{ !loading && props.children }
		</AuthContext.Provider>
	)
}

export { AuthContext, AuthContextProvider as default }
