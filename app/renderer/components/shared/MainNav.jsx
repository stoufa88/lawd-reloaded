import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class MainNav extends React.Component {
	constructor() {
		super()
	}

  render() {
		const {formatMessage} = this.props.intl

    return(
			<div>
				<ul className="nav">
				  <li className="nav-item">
						<Link className="nav-link" to="/movies/popular">
							<i className="fa fa-film" aria-hidden="true"></i>
							<FormattedMessage id="navigation.movies" />
						</Link>
				  </li>
				</ul>
				<p className="versionNumber">0.1.0</p>
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
