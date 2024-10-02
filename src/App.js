import './App.css'
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Project from './pages/project/Project'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { useAuthContext } from './hooks/UseAuthContext'
import OnlineUsers from './components/OnlineUsers'

function App() {
  const {user, authIsReady} = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
        {user && <Sidebar />}
        <div className="container">
          <Navbar />
          <Switch>
            <Route exact path="/" >
              {!user && <Redirect to="/Login"/>}
              {user && <Dashboard />}
            </Route>
            <Route  path="/Create">
              {!user && <Redirect to="/Login"/>}
              {user && <Create />}
            </Route>
            <Route  path="/Project/:id">
              {!user && <Redirect to="/Login"/>}
              {user && <Project />}
            </Route>
            <Route  path="/Login">
              {!user && <Login />}
              {user && <Redirect to="/"/>}
            </Route>
            <Route  path="/Signup">
              {!user && <Signup />}
              {user && <Redirect to="/"/>}
            </Route>
          </Switch>
        </div>
        {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App