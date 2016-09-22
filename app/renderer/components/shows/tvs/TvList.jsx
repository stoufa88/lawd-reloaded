
import React from 'react'
import { withRouter } from 'react-router'
import update from 'react-addons-update'
import ApiService from '../../../services/api'
import ShowCard from './../ShowCard'
import Loader from '../../shared/Loader'

let apiService

class TvList extends React.Component {
  constructor(props) {
    super(props)

		apiService = new ApiService()

		this.state = {
			shows: [],
			genres: [],
			scrollListener: null
		}
  }

	componentWillMount() {
		this.fetchGenres()
		this.fetchShows()
	}

	componentDidMount() {
		let self = this

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

	shouldComponentUpdate(nextProps, nextState) {
		if(nextState.genres.length > 0) {
			return true
		}else {
			return false
		}
	}

	componentWillReceiveProps(nextProps) {
		let {page, searchQuery} = nextProps.location.query
		let {sort} = nextProps.params

		console.log(this.props.params.sort, sort)
		console.log(this.props.location.query.page, page)
		console.log(this.props.location.pathname, nextProps.location.pathname)

		if(sort == this.props.params.sort &&
			 page == this.props.location.query.page &&
			 searchQuery == this.props.location.query.searchQuery &&
		 		nextProps.location.pathname == this.props.location.pathname) {
			console.info('asbaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
			return
		}

		if(searchQuery && searchQuery != '') {
			this.searchTvs(searchQuery)
		}else {
			this.fetchShows(sort, page)
		}
	}

	fetchShows(nextSort, nextPage) {
		let { shows } = this.state

		if(nextSort != this.props.params.sort) {
			shows = []
			this.setState({ shows })
		}

		apiService.getTvs(nextSort, nextPage).then((res) => {
			let newShows = update(shows, {$push: res.results})
			this.setState({ shows: newShows })
		})

	}

	searchTvs(query) {
		let { shows } = this.state

		shows = []
		this.setState({ shows })

		apiService.searchTvs(query).then((res) => {
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

		this.state.shows.forEach((show) => {
			let genres = apiService.getGenresByIds(this.state.genres, show.genre_ids)

			let name = show.title || show.original_name
			cards.push(<ShowCard
				id={show.id}
				title={show.original_name}
				poster_path={show.poster_path}
				genres={genres}
				overview={show.overview}
				key={show.id}
				routeBase="tv" />)
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

export default withRouter(TvList)
