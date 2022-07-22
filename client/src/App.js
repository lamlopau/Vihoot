import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useEffect } from 'react'
import Auth from './views/Auth'
import AuthContextProvider from './contexts/AuthContext'
import Dashboard from './views/Dashboard'
import ProtectedRoute from './components/routing/ProtectedRoute'
import { useDispatch } from 'react-redux'
import {createSocket} from './actions/socket'
import io from "socket.io-client"
import CreateGame from './components/creategame/creategame'
import JoinForm from './components/auth/JoinForm'
import MyQuiz from './components/MyQuizes/MyQuizes'
import QuizDetail from './components/QuizDetails/QuizDetails'
import JoinGame from './components/Game/JoinGame/JoinGame'
import HostScreen from './components/Game/HostScreen/HostScreen'
import PlayerScreen from './components/Game/PlayerScreen/PlayerScreen'
import Quizes from './components/Quizes/Quizes'
function App() {

	const dispatch = useDispatch()

  useEffect(() => {
    const socket = io("http://localhost:3001")
    dispatch(createSocket(socket))

    return () => socket.disconnect()
  }, [dispatch])
	return (
		<AuthContextProvider>
		
				<Router>
					<Switch>
						<Route exact path='/' component={JoinForm} />
						<Route
							exact
							path='/login'
							render={props => <Auth {...props} authRoute='login' />}
						/>
						<Route
							exact
							path='/register'
							render={props => <Auth {...props} authRoute='register' />}
						/>
						<ProtectedRoute exact path='/dashboard' component={Dashboard} />
						<ProtectedRoute path='/myquizes/:id' component={CreateGame} />
						<ProtectedRoute path='/quizes/:id' component={QuizDetail} />
						<ProtectedRoute path='/games/joingame' component={JoinGame} />
						<ProtectedRoute path='/games/host/:id' component={HostScreen} />
						<ProtectedRoute path='/games/player/:id' component={PlayerScreen} />
						<ProtectedRoute exact path='/myquizes' component={MyQuiz} />

						
					</Switch>
				</Router>
			
		</AuthContextProvider>
	)
}

export default App
