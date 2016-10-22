import React, {PropTypes} from 'react'
import { injectIntl, intlShape, FormattedMessage } from 'react-intl'

class Notification extends React.Component {
  render() {
		const {formatMessage} = this.props.intl
		const {type} = this.props

		let message
		switch (type) {
			case 'UPDATE':
				message = formatMessage({id: 'update.message'})
				break
			default:
		}

    return(
			<div className="notification alert alert-info alert-dismissible fade in" role="alert">
				<button type="button" className="close" data-dismiss="alert" aria-label="Close">
		    	<span aria-hidden="true">&times;</span>
		  	</button>

			  {message}
			</div>
		)
  }
}

Notification.propTypes = {
	type: PropTypes.string,
	intl: intlShape.isRequired
}

export default injectIntl(Notification)
