import { Component } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, withRouter } from 'react-router-dom';
import Header from "../Navbar";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      movieName: "horror",
      searchInput: "",
      apiStatus: apiStatusConstants.initial,
      error: null,
      noResults: false,
    };
  }

  componentDidMount() {
    const { movieName } = this.state;
    this.fetchAllMovies(movieName);
  }

  async fetchMoviesByPage(searchTitle, page) {
    const apiKey = "7222f7c3";
    const baseUrl = "https://www.omdbapi.com/";
    const url = `${baseUrl}?s=${encodeURIComponent(searchTitle)}&page=${page}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async fetchAllMovies(searchTitle) {
    this.setState({ apiStatus: apiStatusConstants.inProgress, noResults: false });

    try {
      const firstPageData = await this.fetchMoviesByPage(searchTitle, 1);

      if (firstPageData.Response === "False") {
        this.setState({
          error: firstPageData.Error,
          apiStatus: apiStatusConstants.failure,
          noResults: true,
        });
        return;
      }

      const totalResults = parseInt(firstPageData.totalResults, 10);
      const totalPages = Math.ceil(totalResults / 10);

      let allMovies = firstPageData.Search.filter(
        (movie) => movie.Poster && movie.Poster !== "N/A"
      );

      const fetchPromises = [];
      for (let page = 2; page <= totalPages && allMovies.length < 20; page++) {
        fetchPromises.push(this.fetchMoviesByPage(searchTitle, page));
      }

      const results = await Promise.all(fetchPromises);
      results.forEach((result) => {
        if (result.Response !== "False") {
          const moviesWithImages = result.Search.filter(
            (movie) => movie.Poster && movie.Poster !== "N/A"
          );
          allMovies = allMovies.concat(moviesWithImages).slice(0, 15);
        }
      });

      this.setState({
        movies: allMovies,
        apiStatus: apiStatusConstants.success,
        noResults: allMovies.length === 0,
      });
    } catch (error) {
      this.setState({
        error: error.message,
        apiStatus: apiStatusConstants.failure,
        noResults: true,
      });
    }
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  handleSearchFormSubmit = (event) => {
    event.preventDefault();
    const { searchInput } = this.state;
    const movieName = searchInput.trim() !== "" ? searchInput : "horror";
    this.setState({ movieName }, () => {
      this.fetchAllMovies(movieName);
    });
  };

  handleMovieClick = (imdbID) => {
    const { history } = this.props;
    history.push(`/movies/${imdbID}`);
  };

  handleBackToHorror = () => {
    this.setState({ movieName: "horror", searchInput: "" }, () => {
      this.fetchAllMovies("horror");
    });
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
      />
    </div>
  );

  renderFailureView = () => (
    <div>
      <p>😓Sorry, there was a network error.</p>
    </div>
  );

  renderNoResultsView = () => (
    <div className="no-results-page-container">
     <p className="sorry-text">Sorry, no movies found. Try another keyword to get your favorite movie.</p>

      <button onClick={this.handleBackToHorror} className="login-button">
        Back to Home
      </button>
    </div>
  );

  renderVideosView = () => {
    const { movies } = this.state;
    return (
      <div>
        <div className="title-search-container">
          <p className="all-movies-heading">All Movies</p>
          <div className="search-bar-container">
            <form onSubmit={this.handleSearchFormSubmit}>
              <input
                type="text"
                placeholder="Search for movies..."
                value={this.state.searchInput}
                onChange={this.handleSearchInputChange}
                className="search-input"
              />
              <button type="submit" className="login-button">Search</button>
            </form>
          </div>
        </div>
        <ul className="movies-list-container">
          {movies.map((movie) => (
            <li
              key={movie.imdbID}
              className="list-item-container"
              onClick={() => this.handleMovieClick(movie.imdbID)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="movie-poster"
              />
              <div className="movie-details-container">
                <p className="movie-title">
                  <span className="span">Movie Title:</span> {movie.Title}
                </p>
                <p className="movie-title">
                  <span className="span">Year: </span>
                  {movie.Year}
                </p>
                <p className="movie-title">
                  <span className="span">Type:</span> {movie.Type}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  renderShowMovies = () => {
    const { apiStatus, noResults } = this.state;

    if (noResults) {
      return this.renderNoResultsView();
    }

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideosView();
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
        <Header />
        <div className="sidebar-showmovies-container">
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
          <div className="movies-container">{this.renderShowMovies()}</div>
        </div>
      </div>
    );
  }
}

export default withRouter(Home);
