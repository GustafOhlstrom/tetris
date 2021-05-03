import './SignUp.scss'
import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../../components/loader/Loader'

const SignUp = () => {
	const emailRef = useRef()
	const passwordRef = useRef()
	
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	
	const { signUp, signIn } = useContext(AuthContext)
	const navigate = useNavigate()

	const handleSubmit = async e => {
		e.preventDefault()

		setError(null)
		setLoading(true)
		
		try {
			await signUp(emailRef.current.value, passwordRef.current.value)
			await signIn(emailRef.current.value, passwordRef.current.value)
			navigate('/')
		} catch (error) {
			setError(`Could not sign up: ${error}`)
			setLoading(false)
		}
	}

	return (
		<div className="signup">
			{
				loading
					? <Loader />
					: <>
						<h1>Sign Up</h1>

						<form onSubmit={handleSubmit}>
							<input type="email" ref={emailRef} placeholder="Email"/>
							<input type="password" ref={passwordRef} placeholder="Password"/>
					
							{ error && <p className="error">{error}</p> }
							
							<button>Sign up</button>
						</form>

						<p>
							Already a member? <Link to="/signin">Sign in now</Link>
						</p>
					</>
			}
		</div>
	)
}

export default SignUp