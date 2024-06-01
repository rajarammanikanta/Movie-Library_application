import { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import SignUp from './components/SignUp'
import Login from './components/Login'
import MovieDetails from './components/MovieDetails'
import Home from './components/Home'
import { ToastContainer } from "react-toastify";
import Playlist from './components/Playlist'
import { PlaylistProvider } from './contexts/PlaylistContext';
import "react-toastify/dist/ReactToastify.css";
import { auth } from './components/firebase'


class App extends Component {
  state = { user: '' }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      this.setState({ user: user })
    })
  }

  render() {
    const { user } = this.state
    return (
      <PlaylistProvider> {/* Wrap your component hierarchy with PlaylistProvider */}
        <>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/" component={user ? Home : Login} />
            <Route path="/movies/:id" component={MovieDetails} />
            <Route path="/playlist" component={Playlist} />
          </Switch>
          <ToastContainer />
        </>
      </PlaylistProvider>
    )
  }

}



export default App;
