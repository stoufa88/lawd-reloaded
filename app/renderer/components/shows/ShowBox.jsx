
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
			genres: [],
			scrollListener: null,
			page: 1,
			sort: 'popular'
		}
  }

	componentDidMount() {
		let self = this
		this.fetchMovies()
		this.fetchGenres()

		let scrollListener = function() {
			if($(window).scrollTop() + $(window).height() == $(document).height()) {
				self.handlePageChange()
			}
		}

		$(window).scroll(scrollListener)
		this.setState({scrollListener})
	}

	componentWillUnmount() {
		$(window).off("scroll", this.state.scrollListener)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({page: nextProps.location.query.page})
		this.setState({sort: nextProps.params.sort})
		this.fetchMovies(nextProps.params.sort, nextProps.location.query.page)
	}

	fetchMovies(nextSort, nextPage) {
		let { shows, page, sort } = this.state
		if(nextSort !== sort) {
			shows = []
		}

		apiService.getMovies(nextSort, nextPage).then((res) => {
			let newShows = update(shows, {$push: res.results})
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
      <div className="container movie-list m-t-2">
			  <div className="card-deck">
					{cards}
				</div>
      </div>
    );
  }
}
