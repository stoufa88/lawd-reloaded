import React, {PropTypes} from 'react'
import { Link, withRouter } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class TopNav extends React.Component {
	constructor() {
		super()

		this.state = {
			sortTitle: '',
			searchQuery: ''
		}

		this.handleSearchTextChange = this.handleSearchTextChange.bind(this)
		this.handleEnterOnSearch = this.handleEnterOnSearch.bind(this)
	}

	componentDidMount() {
		const {formatMessage} = this.props.intl
		this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
	}

	componentWillReceiveProps(nextProps) {
		const {formatMessage} = nextProps.intl

		switch (nextProps.params.sort) {
			case 'popular':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
				break
			case 'now_playing':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.now_playing'})})
				break
			case 'on_the_air':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.on_the_air'})})
				break
			case 'top_rated':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.top_rated'})})
				break
			default:
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
				break
		}
	}

	handleSearchTextChange(e) {
		this.setState({searchQuery: e.target.value})
	}

	handleEnterOnSearch(e) {
		if (e.key === 'Enter') {
			const {path} = this.props.route

			switch (path) {
				case '/search/movie':
				case 'movies':
					this.props.router.push(`/search/movie?searchQuery=${this.state.searchQuery}`)
					break
				case '/search/tv':
				case 'tv':
					this.props.router.push(`/search/tv?searchQuery=${this.state.searchQuery}`)
					break
			}
    }
	}

  render() {
		const {formatMessage} = this.props.intl
		const {path} = this.props.route

		let sortLinks
		let searchArea

		switch (path) {
			case '/search/movie':
			case 'movies':
				sortLinks = (
					<div className="dropdown-menu">
						<Link className="dropdown-item" to="/movies/popular"><FormattedMessage id="navigation.sort.popular" /></Link>
						<Link className="dropdown-item" to="/movies/now_playing"><FormattedMessage id="navigation.sort.now_playing" /></Link>
						<Link className="dropdown-item" to="/movies/top_rated"><FormattedMessage id="navigation.sort.top_rated" /></Link>
					</div>
				)
				searchArea = (
					<div className="search input-group">
				    <input className="form-control" type="text"
									placeholder={formatMessage({id: 'navigation.search.movie_placeholder'})}
									onChange={this.handleSearchTextChange}
									onKeyPress={this.handleEnterOnSearch} />
						<Link className="btn btn-secondary" to={`/search/movie?searchQuery=${this.state.searchQuery}`}>
							<FormattedMessage id="navigation.search" />
						</Link>
					</div>
				)
				break;
			case '/search/movie':
			case 'tvs':
				sortLinks = (
					<div className="dropdown-menu">
						<Link className="dropdown-item" to="/tvs/popular"><FormattedMessage id="navigation.sort.popular" /></Link>
						<Link className="dropdown-item" to="/tvs/on_the_air"><FormattedMessage id="navigation.sort.on_the_air" /></Link>
						<Link className="dropdown-item" to="/tvs/top_rated"><FormattedMessage id="navigation.sort.top_rated" /></Link>
					</div>
				)
				searchArea = (
					<div className="search input-group">
						<input className="form-control" type="text"
									placeholder={formatMessage({id: 'navigation.search.tv_placeholder'})}
									onChange={this.handleSearchTextChange}
									onKeyPress={this.handleEnterOnSearch} />
						<Link className="btn btn-secondary" to={`/search/tv?searchQuery=${this.state.searchQuery}`}>
							<FormattedMessage id="navigation.search" />
						</Link>
					</div>
				)
				break;
			default:

		}

    return(
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
				<a className="navbar-brand" href="#">Lawd</a>

			  <ul className="nav navbar-nav">
					<li className="nav-item">
						<div className="btn-group">
							<button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{this.state.sortTitle}
							</button>

							{sortLinks}
						</div>
			    </li>
			  </ul>

			  <div className="search-form pull-xs-right">
					{searchArea}
			  </div>
			</nav>
		)
  }
}

TopNav.propTypes = {
  intl: intlShape.isRequired,
	sort: PropTypes.string
}

export default withRouter(injectIntl(TopNav))
