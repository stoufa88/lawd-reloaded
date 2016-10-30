
import React, {PropTypes} from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
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
		this.fetchSubtitles(this.props.torrent.id)
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
				{this.props.torrent.objectId &&
					<Link to={`/player/internal/${this.props.torrent.objectId}/`}>
						{decodeURIComponent(this.props.torrent.name)}
					</Link>
				}

				{!this.props.torrent.objectId &&
					<Link to={{ pathname: '/player/external', query: { magnetURL: this.props.torrent.magnetURL } }}>
						{this.props.torrent.name}
					</Link>
				}

				<div className="torrent-votes">
					<i className="fa fa-thumbs-o-up" aria-hidden="true">
						{this.props.torrent.upVotes}
					</i>
					<i className="fa fa-thumbs-o-down m-l-1" aria-hidden="true">
						{this.props.torrent.downVotes}
					</i>
				</div>
				{(() => {
					if (this.props.torrent.verified) {
						return (
							<i className="checked-torrent fa fa-check-circle" aria-hidden="true"></i>
						)
					}
				})()}
			</li>
    );
  }
}

Magnet.propTypes = {
	// Parse object
	torrent: PropTypes.object.isRequired
};

export default Magnet

// <small>{this.props.name}</small>

// <div className="torrent-votes">
// 	<i className="fa fa-thumbs-o-up" aria-hidden="true">
// 		{this.props.torrent.get("upVotes")}
// 	</i>
// 	<i className="fa fa-thumbs-o-down m-l-1" aria-hidden="true">
// 		{this.props.torrent.get("downVotes")}
// 	</i>
// </div>
