import './SignIn.scss'
import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../../components/loader/Loader'

const SignIn = () => {
	const emailRef = useRef()
	const passwordRef = useRef()
	
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	
	const { signIn } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		setError(null)
		setLoading(true)

		try {
			await signIn(emailRef.current.value, passwordRef.current.value)
			navigate('/')
		} catch (error) {
			setError("Could not sign in. Please check your email and password.")
			setLoading(false)
		}
	}

	return (
		<div className="signin">
			{
				loading
					? <Loader />
					: <>
						<h1>Sign In</h1>

						<form onSubmit={handleSubmit}>
							<input type="email" ref={emailRef} placeholder="Email"/>
							<input type="password" ref={passwordRef} placeholder="Password"/>

							<Link className="forgot-password" to="/forgot-password">Forgot Password?</Link>

							{ error && <p className="error">{error}</p> }

							<button>Sign in</button>
						</form>

						<p>
							Not a member? <Link to="/signup">Sign up now</Link>
						</p>
						
					</>
			}
		</div>
	)
}

export default SignIn