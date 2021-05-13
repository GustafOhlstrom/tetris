import './GameOverSave.scss'
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg'
import React, { useContext, useEffect, useState } from 'react'
import SignInForm from './sign-in-form/SignInForm'
import { AuthContext } from '../../contexts/AuthContext'
import SignUpForm from './sign-up-form/SignUpForm'

const GameOverSave = ({ mode, onStartGame, setDisplayGameOver, setDisplayGameOverSave, score, setSaveScore }) => {
	const [signIn, setSignIn] = useState(true)
	const { user} = useContext(AuthContext)

	useEffect(() => {
		if(user) {
			setSaveScore(score)
			setDisplayGameOver(true)
			setDisplayGameOverSave(false)
		}
	}, [user, score, setDisplayGameOver, setSaveScore])

	return <div className="gameover-save">
		<div className="gameover-save-content">
			<header>
				<CloseSvg onClick={() => setDisplayGameOverSave(false)}/>
				
				<h1>Sign in to save score</h1>
			</header>

			{
				signIn 
					? <SignInForm setSignIn={setSignIn}/>
					: <SignUpForm setSignIn={setSignIn}/>
			}

			<p className="or">or</p>

			<button onClick={() => onStartGame(mode)}>Play Again</button>
		</div>
	</div>
}

export default GameOverSave

