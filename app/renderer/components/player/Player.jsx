
import React, { PropTypes } from 'react'
import videojs from 'video.js'
import ApiService from '../../services/api'
import Engine from '../../services/engine'
import DatabaseService from '../../services/db'
import Torrent from '../torrents/Torrent'

let player

class Player extends React.Component {
  constructor(props) {
    super(props)

		this.state = {
			torrent: null,
			torrentId: null // This is webtorrent id
		}

		this.apiService = new ApiService()
		this.engine = new Engine()
		this.databaseService = new DatabaseService()
  }

	componentDidMount() {
		player = videojs('video-player', { 'controls': true, 'autoplay': false, 'preload': 'auto' })
		console.log("Getting torrent id from props...", this.props.params.torrentId)

		this.serveTorrent(this.props.params.torrentId);
	}

	componentWillUpdate(nextProps, nextState) {
		// We now have torrentId in state, let's play a bit
		if(nextState.torrentId) {
			this.playTorrent(nextState.torrentId)
		}
	}

	serveTorrent(torrentId) {
		this.apiService.getTorrentById(torrentId).then((torrent) => {
			this.setState({torrent})
			if(torrent.get('subtitles')) {
				torrent.get('subtitles').forEach((subtitle) => {
					this.addRemoteTextTrack(subtitle)
				})
			}

			this.engine.addMagnet(torrent.get('magnetURL'), ((webtorrent) => {
				this.engine.serve(webtorrent.infoHash)
				this.setState({ torrentId: webtorrent.infoHash })

				// Add torrent to local database
				this.databaseService.addTorrent(webtorrent).then(() => {
					console.info('NEW TORRENT ADDED')
				})
			}))
		})
	}

	playTorrent(torrentId) {
		let media = this.engine.getMedia(torrentId)
		let torrent = this.engine.getTorrent(torrentId)

		// renderTo only works with mp4
		if(media.mediaEncoding == 'mp4') {
			torrent.files[media.mediaIndex].renderTo('video',function(err, elem){
        console.log(err)
      })
		}else {
			$('#video-player_html5_api').attr(
				'src',
				'http://localhost:25111/' + media.mediaIndex
			)
		}
	}

	addRemoteTextTrack(subtitle) {
		console.info('adding sub', subtitle)
		player.addRemoteTextTrack({
			kind: 'subtitles',
			language: subtitle.get('lang'),
			src: subtitle.get('vttFile').url()
		})
	}

  render() {
    return (
      <div className="m-t-1 container-fluid">
				<div id="player">
					<video id="video-player" className="video-js vjs-default-skin vjs-big-play-centered m-x-auto">
					</video>
				</div>

      </div>
    );
  }
}

Player.propTypes = {
	params: PropTypes.shape({
		torrentId: PropTypes.string.isRequired // This comes from our api
	})
};

export default Player
