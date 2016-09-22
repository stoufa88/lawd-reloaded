
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

	componentDidMount() {
		this.fetchSubtitles(this.props.torrentId)
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
				<span className="tag tag-default tag-pill pull-xs-right">
					{this.state.subtitleLanguages.join(', ')}
				</span>
			)
		}

    return (
			<li className="list-group-item torrent-item">
				<Link to={`/player/${this.props.torrentId}/`}>
					{this.props.name}
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

// <small>{this.props.name}</small>
