import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class Nav extends React.Component {
	constructor() {
		super()

		this.state = {
			sortTitle: ''
		}
	}

	componentDidMount() {
		const {formatMessage} = this.props.intl
		this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
	}

	componentWillReceiveProps(nextProps) {
		const {formatMessage} = nextProps.intl

		switch (nextProps.sort) {
			case 'popular':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.popular'})})
				break;
			case 'now_playing':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.now_playing'})})

				break;
			case 'top_rated':
				this.setState({sortTitle: formatMessage({id: 'navigation.sort.top_rated'})})
				break;
			default:
		}
	}

  render() {
		const {formatMessage} = this.props.intl
		// <a className="navbar-brand" href="#">Lawd</a>

    return(
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
			  <ul className="nav navbar-nav">
			    <li className="nav-item current">
						<Link className="nav-link" to="/movies/popular"><FormattedMessage id="navigation.movies" /></Link>
			    </li>

					<li className="nav-item">
						<div className="btn-group">
						  <button type="button" className="btn btn-link">{this.state.sortTitle}</button>
						  <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						    <span className="sr-only">Toggle Dropdown</span>
						  </button>
						  <div className="dropdown-menu">
								<Link className="dropdown-item" to="/movies/popular"><FormattedMessage id="navigation.sort.popular" /></Link>
								<Link className="dropdown-item" to="/movies/now_playing"><FormattedMessage id="navigation.sort.now_playing" /></Link>
								<Link className="dropdown-item" to="/movies/top_rated"><FormattedMessage id="navigation.sort.top_rated" /></Link>
						  </div>
						</div>
			    </li>
			  </ul>

			  <form className="search-form form-inline pull-xs-right">
					<div className="search input-group">
				    <input className="form-control" type="text" placeholder={formatMessage({id: 'navigation.search_placholder'})} />
				    <button className="btn btn-secondary" type="submit">
							<FormattedMessage id="navigation.search" />
						</button>
					</div>
			  </form>
			</nav>
		)
  }
}

Nav.propTypes = {
  intl: intlShape.isRequired,
	sort: PropTypes.string
}

export default injectIntl(Nav)

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
