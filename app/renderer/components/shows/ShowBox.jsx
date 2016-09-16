
import React from 'react'
import { withRouter } from 'react-router'
import update from 'react-addons-update'
import ApiService from '../../services/api'
import ShowCard from './ShowCard'
import Loader from '../shared/Loader'

let apiService

class ShowBox extends React.Component {
  constructor(props) {
    super(props)

		apiService = new ApiService()

		this.state = {
			shows: [],
			genres: [],
			scrollListener: null
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
		let {page, searchQuery} = nextProps.location.query
		let {sort} = nextProps.params

		if(searchQuery && searchQuery != '') {
			this.searchMovies(searchQuery)
		}else {
			this.fetchMovies(sort, page)
		}
	}

	fetchMovies(nextSort, nextPage) {
		let { shows, page, sort } = this.state
		if(nextSort !== sort) {
			shows = []
			this.setState({ shows })
		}

		apiService.getMovies(nextSort, nextPage).then((res) => {
			let newShows = update(shows, {$push: res.results})
			this.setState({ shows: newShows })
		})
	}

	searchMovies(query) {
		let { shows } = this.state

		shows = []
		this.setState({ shows })

		apiService.searchMovies(query).then((res) => {
			let newShows = update(shows, {$push: res.results})
			this.setState({ shows: newShows })
		})
	}

	handlePageChange() {
		let {location} = this.props

		let page = parseInt(location.query.page) || 1
		page++

		this.props.router.push(location.pathname + '?page=' + page)
	}

	fetchTvs() {

	}

	fetchGenres() {
		apiService.getGenres().then((res) => {
			this.setState({ genres: res.genres })
		})
	}

  render() {
		if(this.state.shows.length == 0) {
				return <Loader />
		}

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
      <div className="container movie-list">
			  <div className="card-deck">
					{cards}
				</div>
      </div>
    );
  }
}

export default withRouter(ShowBox)
