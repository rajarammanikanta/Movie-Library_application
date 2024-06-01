import React, { Component } from 'react';
import { ThreeDots } from "react-loader-spinner";
import Navbar from '../Navbar';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { PlaylistContext } from '../../contexts/PlaylistContext';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default CSS for toastify
import './index.css';

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class MovieDetails extends Component {
  static contextType = PlaylistContext;

  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      apiStatus: apiStatusConstants.initial,
      error: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;
    this.fetchMovieDetails(id);
  }

  async fetchMovieDetails(id) {
    this.setState({ apiStatus: apiStatusConstants.inProgress });

    try {
      const apiKey = "7222f7c3";
      const baseUrl = "https://www.omdbapi.com/";
      const url = `${baseUrl}?i=${id}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "False") {
        this.setState({
          error: data.Error,
          apiStatus: apiStatusConstants.failure,
        });
        return;
      }

      this.setState({
        movie: data,
        apiStatus: apiStatusConstants.success,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        apiStatus: apiStatusConstants.failure,
      });
    }
  }

  handleAddToPlaylist = async (movie) => {
    const { addToPlaylist } = this.context;

    // Call the addToPlaylist function from context
    addToPlaylist(movie);

    // Display success toast notification
    toast.success("Movie added to playlist successfully!");
  };

  renderLoadingView = () => (
    <div className="loading-container">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="#f52246"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );

  renderFailureView = () => (
    <div>
      <p>Sorry, there was a network error.</p>
    </div>
  );

  renderMovieDetailsView = () => {
    const { movie } = this.state;

    return (
      <div className="moviedetails-container">
        <h1 className="movie-heading">{movie.Title}</h1>
        <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
        <div className="movies-details-container">
          <p className="content"><span className="span">Year:</span> {movie.Year}</p>
          <p className="content"><span className="span">Genre:</span> {movie.Genre}</p>
          <p className="content"><span className="span">Director:</span> {movie.Director}</p>
          <p className="content"><span className="span">Actors:</span> {movie.Actors}</p>
          <p className="content"><span className="span">Plot:</span> {movie.Plot}</p>
          <p className="content"><span className="span">IMDB Rating:</span> {movie.imdbRating}</p>
          <div className='two-buttons-container'>
            <button className="login-button btn" onClick={() => this.handleAddToPlaylist(movie)}>Add to Playlist</button>
            <button className="login-button btn" onClick={() => this.props.history.push('/')}>Back</button>
          </div>
        </div>
      </div>
    );
  };

  renderShowMovieDetails = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderMovieDetailsView();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="movies-sidebar-container">
          <div>
            <Sidebar>
              <Menu
                menuItemStyles={{
                  button: {
                    [`&.active`]: {
                      backgroundColor: '#13395e',
                      color: '#b6c8d9',
                    },
                  },
                }}
              >
                <MenuItem component={<Link to="/" />}>Home</MenuItem>
                <MenuItem component={<Link to="/playlist" />}>Playlist</MenuItem> {/* Add a link to the playlist page */}
              </Menu>
            </Sidebar>
          </div>
          {this.renderShowMovieDetails()}
        </div>
      </div>
    );
  }
}

export default MovieDetails;
