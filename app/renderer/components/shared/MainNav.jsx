import React, {PropTypes} from 'react'
import classNames from 'classnames'
import { Link } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'
import pjson from '../../../package.json'

const version = pjson.version

class MainNav extends React.Component {
	constructor() {
		super()
	}

  render() {
		const {formatMessage} = this.props.intl

		let currentSort = this.props.location

    return(
			<div>
				<ul className="nav">
				  <li className="nav-item">
						<Link className="nav-link" activeClassName="top-nav-active-link" to="/movies">
							<i className="fa fa-film" aria-hidden="true"></i>
							<FormattedMessage id="navigation.movies" />
						</Link>
				  </li>
					<li className="nav-item">
						<Link className="nav-link" activeClassName="top-nav-active-link" to="/tvs">
							<i className="fa fa-television" aria-hidden="true"></i>
							<FormattedMessage id="navigation.tvs" />
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" activeClassName="top-nav-active-link" to="/torrents">
							<i className="fa fa-magnet" aria-hidden="true"></i>
							<FormattedMessage id="navigation.torrents" />
						</Link>
					</li>
				</ul>
				<p className="versionNumber">{`v${version}`}</p>
			</div>
		)
  }
}

MainNav.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(MainNav)

// <li className="nav-item">
// 	<Link className="nav-link" to="/movies/popular">
// 		<i className="fa fa-television" aria-hidden="true"></i>
// 		<FormattedMessage id="navigation.tvs" />
// 	</Link>
// </li>
