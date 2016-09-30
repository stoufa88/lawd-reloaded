import React, {PropTypes} from 'react'

class Notification extends React.Component {
  render() {
    return(
			<div className="notification alert alert-info alert-dismissible fade in" role="alert">
				<button type="button" className="close" data-dismiss="alert" aria-label="Close">
		    	<span aria-hidden="true">&times;</span>
		  	</button>
			  <strong>{this.props.title}</strong> {this.props.message}
			</div>
		)
  }
}

Notification.propTypes = {
	title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
}

export default Notification
