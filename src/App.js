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

function App() {
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

					<Route path="*" element={ <NotFound /> } />
				</Routes>
			</div>
		</AuthContextProvider>
	);
}

export default App;
