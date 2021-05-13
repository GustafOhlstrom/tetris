import './Navbar.scss'
import { ReactComponent as LeaderboardSvg } from '../../assets/icons/leaderboard.svg'
import { ReactComponent as SettingsSvg } from '../../assets/icons/settings.svg'
import { ReactComponent as SignoutSvg } from '../../assets/icons/signout.svg'
import { ReactComponent as SigninSvg } from '../../assets/icons/signin.svg'
import { ReactComponent as PlaySvg } from '../../assets/icons/play.svg'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'

const Navbar = () => {
	const [dropdown, setDropdown] = useState(false)
	const { user, signOut } = useContext(AuthContext)
	const location = useLocation()

	useEffect(() => {
		setDropdown(false)
	}, [location])

	const onToggleDropdown = () => {
		setDropdown(prev =>  !prev)
	}

	return (
		<nav className="navbar">
			<Link className="logo" to="/">
				TETRIS
			</Link>

			<Link to="/leaderboards">
				<div className="svg leaderboard">
					<LeaderboardSvg />
				</div>
			</Link>
			
			<div 
				className="nav-item" 
				onClick={onToggleDropdown}
			>
				<div className="svg">
					<SettingsSvg />
				</div>
			</div>

			<ul className={`dropdown ${dropdown ? "dropdown-open" : ""}`}>
				<li>
					<Link 
						to="/"
					>
						<PlaySvg />
						Play
					</Link>
				</li>
				{
					user
						? <li>
							<Link 
								to="/"
								onClick={signOut}
							>
								<SignoutSvg />
								Sign out
							</Link>
						</li>
						: <li>
							<Link 
								to="/signin"
							>
								<SigninSvg />
								Sign in
							</Link>
						</li>
				}
			</ul>
		</nav>
	)
}

export default Navbar
