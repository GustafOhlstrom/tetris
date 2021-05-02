import './ForgotPassword.scss'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Loader from '../../components/loader/Loader'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
	const emailRef = useRef()
	
	const [success, setSuccess] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	
	const { resetPassword } = useContext(AuthContext)

	const handleSubmit = async e => {
		e.preventDefault()

		setSuccess(null)
		setError(null)
		setLoading(true)
		
		try {
			await resetPassword(emailRef.current.value)
			setSuccess(`Instruction have been sent to the provided email.`)
			setLoading(false)
		} catch (error) {
			setError(`Could not reset password, please check email.`)
			setLoading(false)
		}
	}

	return (
		<div className="forgot-password">
			{
				loading
					? <Loader />
					: <>
						<h1>Forgot Password</h1>

						<p>Please provide the email address associated with your account and we'll send you an link to reset your password.</p>

						<form onSubmit={handleSubmit}>
							<input type="email" ref={emailRef} placeholder="Email"/>
					
							{ success && <p className="success">{success}</p> }
							{ error && <p className="error">{error}</p> }
							
							<button>Reset Password</button>
						</form>

						<Link to="/signin">Back To Sign In</Link>
					</>
			}
		</div>
	)
}

export default ForgotPassword