
import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import ApiService from '../../services/api'

let apiService

class Magnet extends React.Component {

  constructor(props) {
    super(props)

		this.state = {
			subtitleLanguages: []
		}

		apiService = new ApiService()
  }

	componentWillReceiveProps(nextProps) {
		this.fetchSubtitles(nextProps.torrentId)
	}

	fetchSubtitles(torrentId) {
		let subtitleLanguages = []

		apiService.getTorrentById(torrentId).then((torrent) => {
			torrent.get('subtitles').forEach((subtitle) => {
				subtitleLanguages.push(subtitle.get('lang'))
			})

			this.setState({subtitleLanguages})
		})
	}

  render() {
		let subtitles
		if(this.state.subtitleLanguages.length > 0) {
			subtitles = (
				<div>
					<i className="fa fa-comment p-r-1" aria-hidden="true"></i>
					<span>{this.state.subtitleLanguages.join(', ')}</span>
				</div>
			)
		}

    return (
			<li>
				<Link to={`/player/${this.props.torrentId}/`}>
					<div className="d-inline-block">
						{this.props.lang} - {this.props.quality}
					</div>
					<p>{this.props.name}</p>
					{subtitles}
				</Link>
			</li>
    );
  }
}

Magnet.propTypes = {
	index: PropTypes.number.isRequired,
	torrentId: PropTypes.string.isRequired,
	magnetURL: PropTypes.string.isRequired,
	lang: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	quality: PropTypes.string.isRequired
};

export default Magnet
