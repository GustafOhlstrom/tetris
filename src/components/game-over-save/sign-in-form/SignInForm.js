import './SignInForm.scss'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import Loader from '../../loader/Loader'

const SignInForm = ({ setSignIn }) => {
	const emailRef = useRef()
	const passwordRef = useRef()
	
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	
	const { signIn } = useContext(AuthContext)

	const handleSubmit = async e => {
		e.preventDefault()

		setError(null)
		setLoading(true)

		try {
			await signIn(emailRef.current.value, passwordRef.current.value)
		} catch (error) {
			setError("Could not sign in. Please check your email and password.")
			setLoading(false)
		}
	}

	return (
		<div className="signin-form">
			{
				loading
					? <Loader />
					: <>
						<form onSubmit={handleSubmit}>
							<input type="email" ref={emailRef} placeholder="Email"/>
							<input type="password" ref={passwordRef} placeholder="Password"/>

							{ error && <p className="error">{error}</p> }

							<button>Sign in and save</button>
						</form>

						<p>
							Not a member? <span onClick={() => setSignIn(false)}>Sign up now</span>
						</p>
					</>
			}
		</div>
	)
}

export default SignInForm