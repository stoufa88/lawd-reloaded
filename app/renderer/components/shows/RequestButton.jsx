import React from 'react'
import { FormattedMessage } from 'react-intl'
import ApiService from '../../services/api'

let apiService

export default class RequestButton extends React.Component {
  constructor(props) {
    super(props)

		apiService = new ApiService()
  }

	handleRequestClick(lang) {
		let { id, title} = this.props
		apiService.sendRequest(id, title, lang)
	}

  render() {
    return (
			<div className="btn-group btn-group-sm pull-xs-right m-r-1">
				<button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<FormattedMessage id="request" />
				</button>
				<div className="dropdown-menu">
					<button className="dropdown-item" onClick={this.handleRequestClick.bind(this, "English")}>
						<FormattedMessage id="request.lang.english" />
					</button>
					<button className="dropdown-item" onClick={this.handleRequestClick.bind(this, "French")}>
						<FormattedMessage id="request.lang.french" />
					</button>
					<button className="dropdown-item" onClick={this.handleRequestClick.bind(this, "Arabic")}>
						<FormattedMessage id="request.lang.arabic" />
					</button>
				</div>
			</div>
    );
  }
}
