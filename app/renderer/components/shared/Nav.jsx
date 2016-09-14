import React from 'react'
import { Link } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class Nav extends React.Component {
  componentDidMount() {
  }

  render() {
		const {formatMessage} = this.props.intl

    return(
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
			  <a className="navbar-brand" href="#">Lawd</a>
			  <ul className="nav navbar-nav">
			    <li className="nav-item">
						<div className="btn-group">
						  <button type="button" className="btn btn-link"><FormattedMessage id="navigation.movies" /></button>
						  <button type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						    <span className="sr-only">Toggle Dropdown</span>
						  </button>
						  <div className="dropdown-menu">
								<Link className="dropdown-item" to="/movies/popular"><FormattedMessage id="navigation.movies.popular" /></Link>
								<Link className="dropdown-item" to="/movies/now_playing"><FormattedMessage id="navigation.movies.now_playing" /></Link>
								<Link className="dropdown-item" to="/movies/top_rated"><FormattedMessage id="navigation.movies.top_rated" /></Link>
								<Link className="dropdown-item" to="/movies/upcoming"><FormattedMessage id="navigation.movies.upcoming" /></Link>
						  </div>
						</div>
			    </li>

			    <li className="nav-item">
						<div className="btn-group">
							<button type="button" className="btn btn-link"><FormattedMessage id="navigation.tvs" /></button>
							<button type="button" className="btn btn-link dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<span className="sr-only">Toggle Dropdown</span>
							</button>
							<div className="dropdown-menu">
								<Link className="dropdown-item" to="/tv/popular"><FormattedMessage id="navigation.tvs" /></Link>
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
  intl: intlShape.isRequired
}

export default injectIntl(Nav)
