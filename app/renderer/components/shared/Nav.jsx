import React from 'react'
import { Link } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

export default class Nav extends React.Component {
  componentDidMount() {
  }

  render() {
		const {formatMessage} = this.props.intl

    return(
			<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
			  <a className="navbar-brand" href="#">Lawd reloaded</a>
			  <ul className="nav navbar-nav">
			    <li className="nav-item active">
			      <Link className="nav-link" to="/movies"><FormattedMessage id="navigation.movies" /></Link>
			    </li>
			    <li className="nav-item">
			      <Link className="nav-link" to="/tv"><FormattedMessage id="navigation.tvs" /></Link>
			    </li>
			  </ul>
			  <form className="search-form form-inline pull-xs-right">
					<div className="search input-group">
				    <input className="form-control" type="text" placeholder={formatMessage({id: 'navigation.search_placholder'})} />
				    <button className="btn btn-primary" type="submit">
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
