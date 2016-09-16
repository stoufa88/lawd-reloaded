import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class TopNav extends React.Component {
	constructor() {
		super()

		this.state = {
			sortTitle: '',
			searchQuery: ''
		}

		this.handleSearchTextChange = this.handleSearchTextChange.bind(this)
	}

	componentDidMount() {
		const {formatMessage} = this.props.intl
		this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
	}

	componentWillReceiveProps(nextProps) {
		const {formatMessage} = nextProps.intl

		console.log(nextProps)

		switch (nextProps.params.sort) {
			case 'popular':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
				break
			case 'now_playing':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.now_playing'})})
				break
			case 'top_rated':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.top_rated'})})
				break
			default:
		}
	}

	handleSearchTextChange(e) {
		this.setState({searchQuery: e.target.value})
	}

  render() {
		const {formatMessage} = this.props.intl

		console.log("hellooooooo", this.state.sortTitle)

    return(
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
				<a className="navbar-brand" href="#">Lawd</a>

			  <ul className="nav navbar-nav">
					<li className="nav-item">
						<div className="btn-group">
							<button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								{this.state.sortTitle}
							</button>

						  <div className="dropdown-menu">
								<Link className="dropdown-item" to="/movies/popular"><FormattedMessage id="navigation.sort.popular" /></Link>
								<Link className="dropdown-item" to="/movies/now_playing"><FormattedMessage id="navigation.sort.now_playing" /></Link>
								<Link className="dropdown-item" to="/movies/top_rated"><FormattedMessage id="navigation.sort.top_rated" /></Link>
						  </div>
						</div>
			    </li>
			  </ul>

			  <div className="search-form pull-xs-right">
					<div className="search input-group">
				    <input className="form-control" type="text"
									placeholder={formatMessage({id: 'navigation.search_placholder'})}
									onChange={this.handleSearchTextChange}/>
				    <Link className="btn btn-secondary" to={`/search/movie?searchQuery=${this.state.searchQuery}`}>
							<FormattedMessage id="navigation.search" />
						</Link>
					</div>
			  </div>
			</nav>
		)
  }
}

TopNav.propTypes = {
  intl: intlShape.isRequired,
	sort: PropTypes.string
}

export default injectIntl(TopNav)

// <li className="nav-item">
// 	<div className="btn-group">
// 		<button type="button" className="btn btn-link"><FormattedMessage id="navigation.tvs" /></button>
// 		<button type="button" className="btn btn-link dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
// 			<span className="sr-only">Toggle Dropdown</span>
// 		</button>
// 		<div className="dropdown-menu">
// 			<Link className="dropdown-item" to="/tv/popular"><FormattedMessage id="navigation.tvs" /></Link>
// 		</div>
// 	</div>
// </li>
