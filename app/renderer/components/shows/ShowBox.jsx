
import React from 'react'
import update from 'react-addons-update'
import ApiService from '../../services/api'
import ShowCard from './ShowCard'

let apiService

export default class ShowBox extends React.Component {
  constructor(props) {
    super(props)

		apiService = new ApiService()

		this.state = {
			shows: [],
			genres: []
		}
  }

	componentDidMount() {
		let self = this
		this.fetchMovies()
		this.fetchGenres()


		$(window).scroll(function() {
			if($(window).scrollTop() + $(window).height() == $(document).height()) {
				self.handlePageChange()
			}
		})
	}

	componentWillReceiveProps(nextProps) {
		this.fetchMovies(nextProps.params.sort, nextProps.location.query.page)
	}

	fetchMovies(sort, page) {
		apiService.getMovies(sort, page).then((res) => {
			let newShows = update(this.state.shows, {$push: res.results})
			this.setState({ shows: newShows })
		})
	}

	handlePageChange() {
		let {location} = this.props

		let page = parseInt(location.query.page) || 1
		page++

		this.props.history.push(location.pathname + '?page=' + page)
	}

	fetchTvs() {

	}

	fetchGenres() {
		apiService.getGenres().then((res) => {
			this.setState({ genres: res.genres })
		})
	}

  render() {
		let cards = []

		this.state.shows.forEach((movie) => {
			let genres = apiService.getGenresByIds(this.state.genres, movie.genre_ids)

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
