import React from 'react'
import { withRouter } from 'react-router'
import update from 'react-addons-update'
import ApiService from '../../../services/api'
import ShowCard from './../ShowCard'
import Loader from '../../shared/Loader'

let apiService

class MovieList extends React.Component {
  constructor(props) {
    super(props)

		let self = this

		apiService = new ApiService()

		this.state = {
			movies: [],
			genres: []
		}

		this.scrollListener = function() {
			if($(window).scrollTop() + $(window).height() == $(document).height() && $(window).scrollTop() > 0) {
				self.handlePageChange()
			}
		}
  }

	componentWillMount() {
		this.fetchMovies()
		this.fetchGenres()
	}

	componentDidMount() {
		$(window).scroll(this.scrollListener)
		this.setState({scrollListener: this.scrollListener})
	}

	componentWillUnmount() {
		$(window).off("scroll", this.scrollListener)
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.movies.length > this.state.movies.length || nextState.movies.length === 0) {
			return true
		}else {
			return false
		}
	}

	componentWillReceiveProps(nextProps) {
		let {page, searchQuery} = nextProps.location.query
		let {sort} = nextProps.params

		if(sort == this.props.params.sort &&
			 page == this.props.location.query.page &&
			 searchQuery == this.props.location.query.searchQuery &&
		 		nextProps.location.pathname == this.props.location.pathname) {
			console.info('asbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
			return
		}

		if(searchQuery && searchQuery != '') {
			this.searchMovies(searchQuery)
		}else {
			this.fetchMovies(sort, page)
		}
	}

	fetchMovies(nextSort, nextPage) {
		let { movies } = this.state

		if(nextSort != this.props.params.sort) {
			movies = []
			this.setState({ movies })
		}

		apiService.getMovies(nextSort, nextPage).then((res) => {
			let newMovies = update(movies, {$push: res.results})
			this.setState({ movies: newMovies })
		})

	}

	searchMovies(query) {
		let { movies } = this.state

		movies = []
		this.setState({ movies })

		apiService.searchMovies(query).then((res) => {
			let newMovies = update(movies, {$push: res.results})
			this.setState({ movies: newMovies })
		})
	}

	handlePageChange() {
		let {location} = this.props

		let page = parseInt(location.query.page) || 1
		page++

		this.props.router.replace(location.pathname + '?page=' + page)
	}

	fetchGenres() {
		apiService.getGenres().then((res) => {
			this.setState({ genres: res.genres })
		})
	}

  render() {
		if(this.state.movies.length == 0) {
			return <Loader />
		}

		let cards = []

		this.state.movies.forEach((movie) => {
			let genres = apiService.getGenresByIds(this.state.genres, movie.genre_ids)

			cards.push(<ShowCard
				id={movie.id}
				title={movie.title}
				poster_path={movie.poster_path}
				genres={genres}
				overview={movie.overview}
				key={movie.id}
				routeBase="movie" />)
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

export default withRouter(MovieList)
