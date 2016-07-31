
import React from 'react'
import MovieService from '../../services/movies'
import ShowCard from './ShowCard'

let movieService

export default class ShowBox extends React.Component {
  constructor(props) {
    super(props)

		movieService = new MovieService()

		this.state = {
			movies: [],
			tvs: [],
			genres: []
		}
  }

	componentDidMount() {
		this.fetchMovies()
		this.fetchGenres()
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
	}

	fetchMovies() {
		movieService.getPopularMovies().then((res) => {
			this.setState({ movies: res.results })
		})
	}

	fetchTvs() {

	}

	fetchGenres() {
		movieService.getGenres().then((res) => {
			this.setState({ genres: res.genres })
		})
	}

  render() {
		let cards = []

		this.state.movies.forEach((movie) => {
			let genres = movieService.getGenresByIds(this.state.genres, movie.genre_ids)

			cards.push(<ShowCard
				id={movie.id}
				title={movie.title}
				poster_path={movie.poster_path}
				genres={genres}
				overview={movie.overview}
				key={movie.id} />)
		})

    return (
      <div className="movie-list">
			  <div className="card-deck">
					{cards}
				</div>
      </div>
    );
  }
}
