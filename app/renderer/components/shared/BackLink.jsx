import React, {PropTypes} from 'react'
import { Link } from 'react-router'

class BackLink extends React.Component {
	constructor() {
		super()
	}

  render() {
    return(
			<Link to="/">
				<i className="fa fa-times" aria-hidden="true"></i>
			</Link>
		)
  }
}

// BackLink.propTypes = {
//   intl: intlShape.isRequired
// }

export default BackLink
