import React, {PropTypes} from 'react'
import { withRouter } from 'react-router'

class BackLink extends React.Component {
	constructor() {
		super()

		this.goBack = this.goBack.bind(this)
	}

	goBack() {
		this.props.router.goBack()
	}

  render() {
    return(
			<button onClick={this.goBack}>
				<i className="fa fa-times" aria-hidden="true"></i>
			</button>
		)
  }
}

export default withRouter(BackLink)
