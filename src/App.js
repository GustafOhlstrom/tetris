import './App.scss';
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home';
import NotFound from './pages/not-found/NotFound';
import Navbar from './components/navbar/Navbar';
import SignUp from './pages/sign-up/SignUp';
import SignIn from './pages/sign-in/SignIn';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import AuthContextProvider from './contexts/AuthContext'
import AuthRoute from './components/AuthRoute';
import Leaderboard from './pages/leaderboard/Leaderboard';
import { boardWidth, boardHeight, setCellSize } from './constants';

function App() {
	const { innerWidth, innerHeight } = window;
	const maxCellWidth = (innerWidth - 24*2 ) / (boardWidth + 8)
	const maxCellHeight = (innerHeight - 24*4 - 72*2) / boardHeight
	console.log(innerWidth, innerHeight, maxCellWidth, maxCellHeight)
	let cellSize = maxCellWidth < maxCellHeight ? maxCellWidth : maxCellHeight
	if(cellSize > 32) {
		cellSize = 32
	}
	setCellSize(cellSize)

	return (
		<AuthContextProvider>
			<Navbar />

			<div className="container">
				<Routes>
					<AuthRoute path='/'>
						<Home />
					</AuthRoute>

					<Route path='/signup'>
						<SignUp />
					</Route>

					<Route path='/signin'>
						<SignIn />
					</Route>

					<Route path='/forgot-password'>
						<ForgotPassword />
					</Route>

					<AuthRoute path='/leaderboard'>
						<Leaderboard />
					</AuthRoute>

					<Route path="*" element={ <NotFound /> } />
				</Routes>
			</div>
		</AuthContextProvider>
	);
}

export default App;
